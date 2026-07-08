import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    // Fetch users where role is STAFF or staff (case insensitive, or just check 'staff' based on registration logic)
    // Since we hardcoded role: 'staff' for customer, wait, what about staff? Let's check both for safety.
    const staffMembers = await User.find({
      role: { $in: ['STAFF', 'staff'] }
    }).select('-password'); // Exclude password from the response for security

    return NextResponse.json(staffMembers, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
