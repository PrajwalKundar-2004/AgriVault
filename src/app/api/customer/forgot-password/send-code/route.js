import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        await connectDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const customer = await User.findOne({ email, role: 'customer' });
        if (!customer) {
            // Return success even if not found to prevent email enumeration, but in this case let's be helpful.
            return NextResponse.json({ message: "No customer account found with this email." }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Set expiry to 10 minutes from now for password reset
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

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
                    subject: `AgriVault Password Reset Code: ${otp}`,
                    text: `Hello ${customer.name},\n\nYour password reset code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request a password reset, please secure your account immediately.`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; max-width: 600px; margin: 0 auto; border-radius: 10px;">
                            <div style="background-color: #f59e0b; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                                <h2 style="color: white; margin: 0;">Password Reset Request</h2>
                            </div>
                            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
                                <p style="color: #334155; font-size: 16px;">Hello <strong>${customer.name}</strong>,</p>
                                <p style="color: #64748b; font-size: 14px;">We received a request to reset your AgriVault password. Use the code below to proceed.</p>
                                
                                <div style="background-color: #fffbeb; border: 2px dashed #f59e0b; padding: 20px; margin: 25px auto; border-radius: 8px; max-width: 250px;">
                                    <h1 style="margin: 0; color: #b45309; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                                </div>
                                
                                <p style="color: #ef4444; font-size: 13px; font-weight: bold;">This code expires in 10 minutes.</p>
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
                                <p style="color: #94a3b8; font-size: 12px;">If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error("Failed to send OTP email:", emailError);
                return NextResponse.json({ error: "Failed to dispatch email. Please try again." }, { status: 500 });
            }
        } else {
            console.warn("EMAIL_USER or EMAIL_PASS not set. OTP flow will fail in production.");
            return NextResponse.json({ error: "Email service not configured on server." }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Password reset code sent to your email',
            email: customer.email,
        }, { status: 200 });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
