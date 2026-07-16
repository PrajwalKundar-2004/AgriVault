import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const customer = await User.findOne({ email, role: 'customer' });
        if (!customer) {
            return NextResponse.json({ message: "No customer account found with this email" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

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
        console.error("Customer Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
