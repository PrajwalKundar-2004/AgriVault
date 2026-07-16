import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Set expiry to 2 minutes from now
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

        await User.updateOne(
            { _id: customer._id },
            { $set: { otp: otp, otpExpires: otpExpires } },
            { strict: false }
        );

        // Send OTP via Email
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (emailUser && emailPass) {
            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: { user: emailUser, pass: emailPass },
                });

                const mailOptions = {
                    from: `"AgriVault Security" <${emailUser}>`,
                    to: customer.email,
                    subject: `Your AgriVault Login OTP: ${otp}`,
                    text: `Hello ${customer.name},\n\nYour One-Time Password for login is: ${otp}\n\nThis code will expire in 2 minutes.\n\nIf you did not request this, please ignore this email.`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; max-width: 600px; margin: 0 auto; border-radius: 10px;">
                            <div style="background-color: #10b981; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                                <h2 style="color: white; margin: 0;">AgriVault Secure Login</h2>
                            </div>
                            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
                                <p style="color: #334155; font-size: 16px;">Hello <strong>${customer.name}</strong>,</p>
                                <p style="color: #64748b; font-size: 14px;">Please use the verification code below to securely log into your account.</p>
                                
                                <div style="background-color: #f0fdf4; border: 2px dashed #10b981; padding: 20px; margin: 25px auto; border-radius: 8px; max-width: 250px;">
                                    <h1 style="margin: 0; color: #065f46; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                                </div>
                                
                                <p style="color: #ef4444; font-size: 13px; font-weight: bold;">This code expires in 2 minutes.</p>
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
                                <p style="color: #94a3b8; font-size: 12px;">If you did not request this code, please ignore this email or contact support if you have concerns.</p>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error("Failed to send OTP email:", emailError);
                return NextResponse.json({ error: "Failed to dispatch OTP email. Please try again." }, { status: 500 });
            }
        } else {
            console.warn("EMAIL_USER or EMAIL_PASS not set. OTP flow will fail in production.");
            return NextResponse.json({ error: "Email service not configured on server." }, { status: 500 });
        }

        return NextResponse.json({
            message: 'OTP sent to your email',
            requiresOtp: true,
            email: customer.email,
        }, { status: 200 });

    } catch (error) {
        console.error("Customer Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
