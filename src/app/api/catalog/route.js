import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request) {
    try {
        await connectDB();
        const {searchParams} = new URL(request.url);
        const role=searchParams.get('role')?.toUpperCase();
        const products = await Product.find({});

        //buyer catalogue view
        if(role === 'BUYER'){
            const buyerView = products.map(product => ({
                productId: product._id,
                name: product.name,
                category: product.category,
                availableQuantity: product.quantity,
                pricePerUnit: product.sellingPrice,
                unit: product.unit,
            }));
            return NextResponse.json(buyerView,{ status: 200 });
        }
        //supplier catalog view
        if(role === 'SUPPLIER'){
            const supplierView = products.map(product => {
                const remainingStorageSpace = product.maxCapacity - product.quantity;
                return {
                    productId: product._id,
                    name: product.name,
                    category: product.category,
                    maxQuantityAllowedToSupply: remainingStorageSpace > 0 ? remainingStorageSpace : 0,
                    payoutPerUnit: product.costPrice,
                    unit: product.unit,
                };
            });
            return NextResponse.json(supplierView,{ status: 200 });
        }
        return NextResponse.json({ error: "Invalid role specified. Use 'buyer' or 'supplier'." }, { status: 400 });
    } catch (error) {
        console.error("Error fetching catalog:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}