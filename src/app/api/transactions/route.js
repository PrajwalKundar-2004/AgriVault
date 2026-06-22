import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'
import Transaction from '@/models/Transaction'
import Product from '@/models/Product'

//create transaction & automatically calculate stock levels
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { productId, quantity, type, customerOrSupplier, handledBy, notes } = body;

        //validation check
        if (!productId || !quantity || !type || !customerOrSupplier || !handledBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //verify whether product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found in inventory" }, { status: 404 });
        }

        //inventory adjustment calculation\
        let quantityChange = 0;
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
        } else {
            return NextResponse.json({ error: "Invalid transaction type use INCOMING or OUTGOING" }, { status: 400 });
        }

        // record the audit entry
        const newTransaction = await Transaction.create({
            productId,
            type,
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
