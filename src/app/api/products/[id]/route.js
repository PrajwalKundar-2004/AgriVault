import {NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

//get a single product by id
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } =await params; //grabs this from the url e.g. /api/products/123 => id = 123
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//update a product by id(eg:update stocks quantity or price)
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

       //find the product by id and update it with the new data from the request body
       const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: body }, // $set operator updates the document with the new data
        { new: true,runValidators: true } // return the newly updated documents
       );

       if(!updatedProduct){
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
       }
       return NextResponse.json({message: "Product updated successfully",product:updatedProduct}, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//delete a product from inventory by id
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({message: "Product deleted successfully"}, { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}