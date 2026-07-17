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
        const admin = await User.findOne({ email, role: 'admin' }).lean();
        if (!admin) {
            return NextResponse.json({ message: "Admin not found or invalid role" }, { status: 404 });
        }

        if (admin.lockUntil && admin.lockUntil > new Date()) {
            return NextResponse.json({ 
                message: "Account locked due to too many failed attempts.", 
                lockUntil: admin.lockUntil 
            }, { status: 403 });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            const attempts = (admin.loginAttempts || 0) + 1;
            const updateData = { loginAttempts: attempts };
            if (attempts >= 5) {
                updateData.lockUntil = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
            }
            await User.updateOne({ _id: admin._id }, { $set: updateData }, { strict: false });
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

        await User.updateOne(
            { _id: admin._id },
            { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } },
            { strict: false }
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
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365 // 1 year
        });

        return response;

    } catch (error) {
        console.error("Admin Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}