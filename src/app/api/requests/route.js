import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import RequestModel from '@/models/Request';

//staff view list all requests
export async function GET() {
    try {
        await connectDB();
        const requests = await RequestModel.find({}).populate('productId').sort({ createdAt: -1 });
        return NextResponse.json(requests, { status: 200 });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
//user submission submit a request (buyer or supplier)
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { productId, requestType, entityName, quantityRequested, notes } = body;
        if (!productId || !requestType || !entityName || !quantityRequested) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        //pre-checks to save users from making impossible reuqests
        if (requestType === 'BUYER_ORDER' && quantityRequested > product.quantity) {
            return NextResponse.json({ error: "Requested quantity exceeds available stock" }, { status: 400 });
        }
        const currentAvailableStorage = product.maxCapacity - product.quantity;
        if (requestType === 'SUPPLIER_DELIVERY' && quantityRequested > currentAvailableStorage) {
            return NextResponse.json({
                error: `Warehouse storage full.Can only accept up to${currentAvailableStorage} 
                ${product.unit}`
            }, { status: 400 });
        }
        const newRequest = await RequestModel.create({
            productId,
            requestType,
            entityName,
            quantityRequested,
            notes
        });
        return NextResponse.json({ message: "Request submitted  successfully!", data: newRequest }, { status: 201 });
    } catch (error) {
        console.error("Error submitting request:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}