import {NextResponse} from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(request) {
    try {
        await connectDB();
        const {email, password,secretKey} = await request.json();

        //find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        //Admin verification
        if (user.role === 'ADMIN') {
            if(secretKey !== process.env.ADMIN_SECRET_KEY){
                return NextResponse.json(
                    { message: "Invalid admin secret key" }, 
                    { status: 401 }
                );
            }
        }

         //Staff verification
        else if (user.role === 'STAFF') {
            if(secretKey !== process.env.STAFF_SECRET_KEY){
                return NextResponse.json(
                    { message: "Invalid staff secret key" }, 
                    { status: 401 }
                );
            }
        }

        //create token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
             process.env.JWT_SECRET,
             { expiresIn: '1d' }
            );
        return NextResponse.json(
            { 
            message: 'Login Successful',
            token, 
            role: user.role,
            }, 
            { status: 200 }
        );
    }catch (error) {
        console.error(error);
        return NextResponse.json({ error:error.message }, { status: 500 });
    }
}