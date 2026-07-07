import {NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import RequestModel from '@/models/Request';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';

export async function PUT(request,{params}){
    try {
        await connectDB();
        const {id} =await params;
        const body = await request.json();
        const {action, staffName} = body;//action approved or rejected
        if(!action||!staffName){
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const orderRequest = await RequestModel.findById(id);
        if(!orderRequest){
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }
        if(orderRequest.status !== 'PENDING'){
            return NextResponse.json({ error: "This request has already been processed" }, { status: 400 });
        }

        const product = await Product.findById(orderRequest.productId);
        if(!product){
            return NextResponse.json({ error: "Associated product not found" }, { status: 404 });
        }
        if (action === 'REJECTED') {
            const transactionNotes = body.notes || "No specific reason provided.";

            orderRequest.status = 'REJECTED';
            orderRequest.handledBy = staffName;
            orderRequest.notes = transactionNotes; 
            await orderRequest.save();

            await Transaction.create({
                productId: product._id,
                quantity: orderRequest.quantityRequested,
                type: orderRequest.requestType === 'BUYER_ORDER' ? 'OUTGOING' : 'INCOMING',
                status: 'REJECTED',
                customerOrSupplier: orderRequest.entityName,
                handledBy: staffName,
                notes: transactionNotes
            });

            return NextResponse.json({ 
                message: "Request rejected successfully",
                reason: rejectionReason 
            }, { status: 200 });
        }
        if(action === 'APPROVED'){
            let updatedQuantity = product.quantity;
            //final inventory validation checks at the moment of approval
            if(orderRequest.requestType === 'BUYER_ORDER'){
                //BUYER ORDER:reduce stock
                if(product.quantity < orderRequest.quantityRequested){
                    return NextResponse.json({ error: "Cannot approve:Requested quantity exceeds available stock" }, { status: 400 });
                }
               updatedQuantity= product.quantity - orderRequest.quantityRequested;
            }
            else if(orderRequest.requestType === 'SUPPLIER_DELIVERY'){
                //SUPPLIER DELIVERY:increase stock
                const availableStorage = product.maxCapacity - product.quantity;
                if(orderRequest.quantityRequested > availableStorage){
                    return NextResponse.json({ error: `Warehouse storage full.Can only accept up to ${availableStorage} ${product.unit}` }, { status: 400 });
                }
                updatedQuantity = product.quantity + orderRequest.quantityRequested;
            }
            //use findByIdAndUpdate to bypass schema validation for other fields
            await Product.findByIdAndUpdate(product._id, {
                $set: {
                    quantity: updatedQuantity
                }
            }
            );
            //update request log status
            orderRequest.status = 'APPROVED';
            orderRequest.handledBy = staffName;
            await orderRequest.save();
            const transactionNotes = body.notes || orderRequest.notes || 'No notes provided.';

            //automatically drop a pemament paper-tral inside your transaction collection
            await Transaction.create({
                productId: product._id,
                quantity: orderRequest.quantityRequested,
                type: orderRequest.requestType === 'BUYER_ORDER' ? 'OUTGOING' : 'INCOMING',
                status: 'ACCEPTED',
                customerOrSupplier: orderRequest.entityName,
                handledBy: staffName,
                notes: transactionNotes
            });
            return NextResponse.json({message:"Request approved , inventory updated and ledger written successfully!",
            currentStock: updatedQuantity
            },
            {status:200});
        }
        return NextResponse.json({ error: "Invalid action.use 'APPROVED' or 'REJECTED'" }, { status: 400 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}