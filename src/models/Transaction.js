import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "Product ID is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    type: {
        type: String,
        enum: ['INCOMING', 'OUTGOING'],
        required:[true, "Transaction type is required"],
    },
    status: {
        type: String,
        enum: ['ACCEPTED', 'REJECTED'],
        default: 'ACCEPTED',
    },
    //tracks business partner
    customerOrSupplier: {
        type: String,
        required: [true, "Customer or Supplier is required"],
    },
    handledBy: {
        type: String,
        required: [true, "Handling staff name is required"],
    },
    notes:{
        type: String,
        trim: true,
    }
}, 
{ timestamps: true });
export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);