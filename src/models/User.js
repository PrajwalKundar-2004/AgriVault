import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{type: String, enum: ['ADMIN', 'STAFF', 'CUSTOMER'], default: 'CUSTOMER'},
},
{ timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return ;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
export default mongoose.models.User || mongoose.model('User', userSchema);