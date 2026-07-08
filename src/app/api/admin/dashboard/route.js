import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import SupportTicket from "@/models/SupportTicket";
import Transaction from "@/models/Transaction";
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

    // 1. Fetch Key Metrics
    const totalUsers = await User.countDocuments({ role: "customer" });
    const activeStaff = await User.countDocuments({ role: "staff" });
    const inventoryAlerts = await Product.countDocuments({ quantity: { $lt: 10 } });
    const openTickets = await SupportTicket.countDocuments({ status: "OPEN" });

    // 2. Fetch Chart Data (Last 7 Days of Transactions)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentTransactions = await Transaction.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Create a map to group by day of the week
    const daysMap = {};
    const dayNames = [];
    
    // Initialize the last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysMap[dayName] = { name: dayName, incoming: 0, outgoing: 0 };
      dayNames.push(dayName);
    }

    // Aggregate quantities
    recentTransactions.forEach(tx => {
      const dayName = new Date(tx.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (daysMap[dayName]) {
        if (tx.type === "INCOMING") {
          daysMap[dayName].incoming += tx.quantity;
        } else if (tx.type === "OUTGOING") {
          daysMap[dayName].outgoing += tx.quantity;
        }
      }
    });

    // Convert map to array sorted by the correct temporal order
    const chartData = dayNames.map(name => daysMap[name]);

    // 3. Fetch Category Breakdown for Pie Chart
    const categoryDataRaw = await Product.aggregate([
      { $group: { _id: "$category", value: { $sum: "$quantity" } } }
    ]);
    
    // Filter out categories with 0 quantity and map to required format
    const categoryData = categoryDataRaw
      .filter(item => item.value > 0)
      .map(item => ({
        name: item._id || "Uncategorized",
        value: item.value
      }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeStaff,
        inventoryAlerts,
        openTickets,
      },
      chartData,
      categoryData
    }, { status: 200 });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
