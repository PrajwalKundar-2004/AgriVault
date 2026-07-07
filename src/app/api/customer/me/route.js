import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(request) {
    try {
        await connectDB();
        
        const token = request.cookies.get('customer_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            role: user.role
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching customer identity:", error);
        return NextResponse.json({ error: "Unauthorized or token expired" }, { status: 401 });
    }
}
