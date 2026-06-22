import {NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

//get all products(view inventory)
export async function GET() {
    try {
        await connectDB();

        //fetch all items from database and sort them by newest to oldest
        const products = await Product.find({});
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
//create new product (add item to warehouse)
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, category, quantity, price, unit } = body;
    // backend validation to check if all required fields are provided
    if (!name || !category || quantity === null || price === null || !unit) {
        return NextResponse.json({ error: "Missing required fields " }, { status: 400 });
    }
    //check if prodcut with the same name already exists in the database
    const existingProduct = await Product.findOne({ 
        name :{ $regex: new RegExp(`^${name}$`, 'i')} // case-insensitive regex to match the name exactly
    });
    if(existingProduct){
        return NextResponse.json({ error: "Product with the same name already exists" }, { status: 409 });
    }
    //save inventory item to database
    const newProduct = new Product({
        name,
        category,
        quantity,
        price,
        unit
    });
    await newProduct.save();
    return NextResponse.json({message: "Product added successfully",product: newProduct}, { status: 201 });
    }catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}