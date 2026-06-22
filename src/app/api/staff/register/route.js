import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User"; // Reusing User model, assuming it has a 'role' field
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ message: "User already exists" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = new User({
            name,
            email,
            password: hashedPassword,
            role: 'staff' // Default to staff
        });

        await newStaff.save();
        return NextResponse.json({ message: "Staff account created. Please login with your secret key." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}