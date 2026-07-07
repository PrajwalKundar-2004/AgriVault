import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'
import Transaction from '@/models/Transaction'
import Product from '@/models/Product'

//create transaction & automatically calculate stock levels
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { productId, quantity, type, status = 'ACCEPTED', customerOrSupplier, handledBy, notes } = body;

        //validation check
        if (!productId || !quantity || !type || !customerOrSupplier || !handledBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //verify whether product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found in inventory" }, { status: 404 });
        }

        if (type !== 'INCOMING' && type !== 'OUTGOING') {
            return NextResponse.json({ error: "Invalid transaction type use INCOMING or OUTGOING" }, { status: 400 });
        }

        //inventory adjustment calculation
        let quantityChange = 0;
        if (status === 'ACCEPTED') {
            if (type === 'INCOMING') {
                quantityChange = quantity; //increase stock
            } else if (type === 'OUTGOING') {
                if (product.quantity < quantity) {
                    return NextResponse.json({
                        error: `Insufficient stock. You want to sell ${quantity}, but only ${product.quantity} is available.`
                    },
                        { status: 400 }
                    );
                }
                quantityChange = -quantity; //decrease stock
            }
        }
        // record the audit entry
        const newTransaction = await Transaction.create({
            productId,
            type,
            status,
            quantity,
            customerOrSupplier,
            handledBy,
            notes
        });

        //perform math update directly in the prdocut document
        product.quantity += quantityChange;
        await product.save();

        return NextResponse.json({
             message: "Transaction recorded and stock updated successfully",
              transaction: newTransaction ,
              currentInventoryQuantity: product.quantity
            }, 
            { status: 201 }
        );
    }catch (error) {
        console.error("Error processing transaction:", error);
        return NextResponse.json({ error:error.message }, { status: 500 });
    }
}

// GET all transactions (view history)
export async function GET(request) {
    try {
        await connectDB();
        // Fetch all transactions, sort by newest, and populate the productId
        const transactions = await Transaction.find({})
            .populate('productId')
            .sort({ createdAt: -1 });
        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
