import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import RequestModel from '@/models/Request';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request) {
    try {
        await connectDB();
        
        // 1. Verify Identity
        const token = request.cookies.get('customer_token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Parse and Validate Request Body
        const body = await request.json();
        const { productId, requestType, quantityRequested } = body;

        if (!productId || !requestType || !quantityRequested) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (quantityRequested <= 0) {
            return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
        }

        if (requestType !== 'BUYER_ORDER' && requestType !== 'SUPPLIER_DELIVERY') {
            return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
        }

        // Verify Product Exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Prevent absurd supplier deliveries that exceed max capacity
        if (requestType === 'SUPPLIER_DELIVERY') {
            const availableSpace = product.maxCapacity - product.quantity;
            if (quantityRequested > availableSpace) {
                return NextResponse.json({ error: `Cannot supply ${quantityRequested}. Warehouse only has space for ${availableSpace} more.` }, { status: 400 });
            }
        }

        // Prevent absurd buyer orders that exceed current stock
        if (requestType === 'BUYER_ORDER') {
            if (quantityRequested > product.quantity) {
                 return NextResponse.json({ error: `Cannot order ${quantityRequested}. Warehouse only has ${product.quantity} in stock.` }, { status: 400 });
            }
        }

        // 3. Create the Request securely
        const newRequest = await RequestModel.create({
            productId,
            requestType,
            entityName: user.name, // Securely force the entityName to be the logged-in user!
            quantityRequested,
            status: 'PENDING'
        });

        return NextResponse.json({ message: "Request placed successfully", request: newRequest }, { status: 201 });

    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
