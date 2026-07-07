import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import RequestModel from '@/models/Request';
import Transaction from '@/models/Transaction';

export async function GET(request) {
    try {
        await connectDB();

        // 1. Total Inventory Count
        const inventoryCount = await Product.countDocuments();

        // 2. Low Stock Count (e.g. quantity less than 10)
        // Alternatively, we could compare quantity to maxCapacity, but an absolute threshold is simpler.
        const lowStockCount = await Product.countDocuments({ quantity: { $lt: 10 } });

        // 3. Pending Orders (Tasks Assigned)
        const pendingOrders = await RequestModel.countDocuments({ status: 'PENDING' });

        // 4. Recent Activity (Latest 5 transactions)
        const recentActivity = await Transaction.find({})
            .populate('productId')
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            inventoryCount,
            lowStockCount,
            pendingOrders,
            recentActivity
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
