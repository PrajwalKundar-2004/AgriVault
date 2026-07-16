import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request) {
    try {
        await connectDB();
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        const customer = await User.findOne({ email, role: 'customer' });
        if (!customer) {
            return NextResponse.json({ message: "Customer account not found" }, { status: 404 });
        }

        if (!customer.otp || !customer.otpExpires) {
            return NextResponse.json({ message: "No active OTP found. Please log in again." }, { status: 400 });
        }

        if (new Date() > customer.otpExpires) {
            return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        if (customer.otp !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
        }

        // OTP is valid and not expired. Clear it.
        customer.otp = undefined;
        customer.otpExpires = undefined;
        await customer.save();

        const token = jwt.sign({ userId: customer._id, role: 'customer' }, JWT_SECRET);

        const response = NextResponse.json({
            message: 'Login successful',
            role: 'customer',
            user: { name: customer.name, email: customer.email }
        }, { status: 200 });

        response.cookies.set('customer_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
