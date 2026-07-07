import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const customerToken = req.cookies.get("customer_token")?.value;
    if (!customerToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(customerToken, process.env.JWT_SECRET);
    if (decoded.role !== "customer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { message } = await req.json();
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();

    // Verify user exists and get their full details
    const customer = await User.findById(decoded.userId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // 1. Save Ticket to MongoDB
    const ticket = await SupportTicket.create({
      customerId: customer._id,
      message,
      status: "OPEN",
    });

    // 2. Dispatch Email via Nodemailer (if credentials exist)
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const mailOptions = {
          from: `"AgriVault System" <${emailUser}>`,
          to: emailUser, // Send to the admin's email
          subject: `🚨 New Support Ticket: ${customer.name}`,
          text: `You have received a new support ticket from ${customer.name} (${customer.email}).\n\nMessage:\n${message}\n\nTicket ID: ${ticket._id}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc;">
              <h2 style="color: #047857;">New Support Request</h2>
              <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
              <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
                <p style="white-space: pre-wrap; color: #1e293b;">${message}</p>
              </div>
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Ticket ID: ${ticket._id}</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Support email dispatched successfully.");
      } catch (emailError) {
        console.error("Failed to send support email:", emailError);
        // We do NOT return an error to the user if the email fails, as the DB save succeeded.
      }
    } else {
      console.warn("EMAIL_USER or EMAIL_PASS not set in .env. Skipping email dispatch.");
    }

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error("Support Ticket Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
