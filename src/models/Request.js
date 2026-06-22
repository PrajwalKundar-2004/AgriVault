import mongoose from 'mongoose';
const requestSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "Product ID is required"],
    },
    requestType:{
        type: String,
        enum: ['BUYER_ORDER', 'SUPPLIER_DELIVERY'],
        required: [true, "Request type is required"],
    },
    entityName: {
        type: String,
        required: [true, "Customer/Company name is required"],
    },
    quantityRequested: {
        type: Number,
        required: [true, "Requested quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    },
    handledBy: {
        type: String,
        default: null
     },
     notes:{
        type: String,
     },
},
{ timestamps: true }
);
export default mongoose.models.Request || mongoose.model('Request', requestSchema);
    