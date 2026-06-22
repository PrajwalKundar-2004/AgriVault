import {NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
export async function POST(request) {
    try {
        //connect to database
        await connectDB();

        //get user data
        const { name, email, password,role } = await request.json();

        //basic validation to ensure no fields are empty
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Please fill all required fieds(name, email , password and role)" }, 
                { status: 400 }
            );
        }
        //check user with this email already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" }, 
                { status: 400 }
            );
        }

        //create new user
        const newUser = await User.create({ name, email, password, role });

        //return success response
        return NextResponse.json(
            { message: "User registered successfully", userId: newUser._id }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:",error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}