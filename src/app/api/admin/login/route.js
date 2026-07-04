import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connectDB();
        const { email, password, secretKey } = await request.json();

        // 1. Find Admin
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return NextResponse.json({ message: "Admin not found or invalid role" }, { status: 404 });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // 3. Validate Admin Secret Key
        // Note: Using direct comparison as per your current setup
        
        const isSecretKey=await bcrypt.compare(secretKey,admin.secretKey);
        if (!isSecretKey) {
            return NextResponse.json({ message: "Invalid admin secret key" }, { status: 401 });
        }

        // 4. Create Admin Token
        const token = jwt.sign(
            { userId: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
        );

       // 5. Send secure response
        const response = NextResponse.json({
            message: 'Admin login successful',
            role: 'admin'
        }, { status: 200 });

        // IMPORTANT: Change 'token' to 'admin_token' to match our middleware
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365 // 1 year
        });

        return response;

    } catch (error) {
        console.error("Admin Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}