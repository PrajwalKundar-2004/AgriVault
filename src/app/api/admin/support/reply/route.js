import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { ticketId, replyMessage } = await req.json();
    if (!ticketId || !replyMessage || replyMessage.trim().length === 0) {
      return NextResponse.json({ error: "Ticket ID and reply message are required" }, { status: 400 });
    }

    await connectDB();

    // 1. Find the ticket and populate customer to get their email
    const ticket = await SupportTicket.findById(ticketId).populate("customerId", "name email");
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // 2. Update the ticket in DB
    ticket.status = "RESOLVED";
    ticket.messages.push({ sender: "ADMIN", text: replyMessage });
    await ticket.save();

    // 3. Dispatch Email via Nodemailer
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass && ticket.customerId?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const mailOptions = {
          from: `"AgriVault Support" <${emailUser}>`,
          to: ticket.customerId.email,
          subject: `Re: Your Support Request - AgriVault`,
          text: `Hello ${ticket.customerId.name},\n\nWe have reviewed your support ticket.\n\nAdmin Reply:\n${replyMessage}\n\nOriginal Message:\n${ticket.messages[0]?.text}\n\nTicket ID: ${ticket._id}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; max-width: 600px; margin: 0 auto; border-radius: 10px;">
              <div style="background-color: #10b981; padding: 15px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">AgriVault Support</h2>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
                <p style="color: #334155; font-size: 16px;">Hello <strong>${ticket.customerId.name}</strong>,</p>
                <p style="color: #334155;">An admin has replied to your recent support ticket:</p>
                
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                  <p style="margin: 0; color: #065f46; white-space: pre-wrap;">${replyMessage}</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
                
                <h4 style="color: #64748b; margin-bottom: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Your Original Message:</h4>
                <p style="color: #64748b; font-style: italic; white-space: pre-wrap; font-size: 14px;">"${ticket.messages[0]?.text}"</p>
                
                <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">Ticket Reference: ${ticket._id}</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Reply email dispatched to customer successfully.");
      } catch (emailError) {
        console.error("Failed to send reply email:", emailError);
        // We still return success because the DB was updated
      }
    } else {
      console.warn("EMAIL_USER/EMAIL_PASS not set, or customer has no email. Skipping dispatch.");
    }

    return NextResponse.json({ success: true, ticket }, { status: 200 });
  } catch (error) {
    console.error("Admin Support Reply Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
