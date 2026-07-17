import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request) {
    try {
        await connectDB();
        const { email, password, secretKey } = await request.json();

        if (!email || !password || !secretKey) {
            return NextResponse.json({ message: "Email, password, and Company Auth Key are required" }, { status: 400 });
        }

        // 1. Verify Company Auth Key first for security
        const expectedSecret = process.env.STAFF_SECRET_KEY || "agrivault-staff-2026";
        if (secretKey !== expectedSecret) {
            return NextResponse.json({ message: "Invalid Company Auth Key" }, { status: 401 });
        }

        // 2. Find user by email and verify role
        const staff = await User.findOne({ email, role: 'staff' }).lean();
        if (!staff) {
            return NextResponse.json({ message: "Staff account not found or invalid role" }, { status: 404 });
        }

        if (staff.lockUntil && staff.lockUntil > new Date()) {
            return NextResponse.json({ 
                message: "Account locked due to too many failed attempts.", 
                lockUntil: staff.lockUntil 
            }, { status: 403 });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            const attempts = (staff.loginAttempts || 0) + 1;
            const updateData = { loginAttempts: attempts };
            if (attempts >= 5) {
                updateData.lockUntil = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
            }
            await User.updateOne({ _id: staff._id }, { $set: updateData }, { strict: false });
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        await User.updateOne(
            { _id: staff._id },
            { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } },
            { strict: false }
        );

        // 3. Create Token
        const token = jwt.sign(
            { userId: staff._id, role: 'staff' },
            JWT_SECRET
        );

        const response = NextResponse.json({ 
            message: 'Login successful',
            role: 'staff'
        }, { status: 200 });
        
        response.cookies.set('staff_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("Staff Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}