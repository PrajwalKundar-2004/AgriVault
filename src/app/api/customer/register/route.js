import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ message: "Password is too small (must be at least 8 characters)" }, { status: 400 });
        }

        if (password.length > 15) {
            return NextResponse.json({ message: "Password is too long (maximum 15 characters)" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
        }

        const customer = new User({ name, email, password, role: 'customer' });
        await customer.save();

        return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Customer Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
