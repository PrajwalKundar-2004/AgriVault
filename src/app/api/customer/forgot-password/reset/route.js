import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ message: "Email, OTP, and new password are required" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ message: "Password is too small (must be at least 8 characters)" }, { status: 400 });
        }

        if (newPassword.length > 15) {
            return NextResponse.json({ message: "Password is too long (maximum 15 characters)" }, { status: 400 });
        }

        // Use lean() to ensure we get the full document even if the schema cache is stale
        const customer = await User.findOne({ email, role: 'customer' }).lean();
        if (!customer) {
            return NextResponse.json({ message: "Customer account not found" }, { status: 404 });
        }

        if (!customer.otp || !customer.otpExpires) {
            return NextResponse.json({ message: "No active password reset request found. Please try again." }, { status: 400 });
        }

        if (new Date() > customer.otpExpires) {
            return NextResponse.json({ message: "Reset code has expired. Please request a new one." }, { status: 400 });
        }

        if (customer.otp !== otp) {
            return NextResponse.json({ message: "Invalid reset code" }, { status: 401 });
        }

        // OTP is valid and not expired. Hash the new password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user using updateOne to bypass schema cache issues and clear the OTP fields
        await User.updateOne(
            { _id: customer._id },
            { 
                $set: { password: hashedPassword },
                $unset: { otp: "", otpExpires: "" }
            },
            { strict: false }
        );

        return NextResponse.json({
            message: 'Password has been successfully reset. You can now log in.',
        }, { status: 200 });

    } catch (error) {
        console.error("Password Reset Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
