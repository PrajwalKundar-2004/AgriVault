import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true, 
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Stock quantity is required"],
        default: 0,
    },
    costPrice: {
        type: Number,
        required: [true, "Cost price per unit is required"],
        min:0
    },
    sellingPrice: {
        type: Number,
        required: [true, "Selling price per unit is required"],
        min:0
    },
    maxCapacity: {
        type: Number,
        required: [true, "Maximum storage capacity is required"],
        min: 1,
    },
    unit: {
        type: String,
        required: [true, "Unit of measurement is required"]
    },
},
{ timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', productSchema);