import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(request) {
    try {
        await connectDB();
        
        // 1. Get and verify token
        const token = request.cookies.get('staff_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // 2. Get the user to find their exact name used in logs
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 3. Fetch ONLY the transactions handled by this specific staff member
        const myTransactions = await Transaction.find({ handledBy: user.name })
            .populate('productId')
            .sort({ createdAt: -1 });

        return NextResponse.json(myTransactions, { status: 200 });

    } catch (error) {
        console.error("Error fetching staff tasks:", error);
        return NextResponse.json({ error: "Unauthorized or token expired" }, { status: 401 });
    }
}
