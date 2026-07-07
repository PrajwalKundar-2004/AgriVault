import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const adminToken = req.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Fetch tickets and populate customer name and email
    const tickets = await SupportTicket.find()
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Fetch Support Tickets Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
