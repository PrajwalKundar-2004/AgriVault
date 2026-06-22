import {NextResponse} from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";

//get all transaction logs
export async function GET() {
    try {
        await connectDB();
        //grabs everything and auto-fills product data details
        const historyLogs=await Transaction.find({})
        .populate('productId')
        .sort({createdAt: -1}); //sort by most recent first
        return NextResponse.json({ historyLogs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}