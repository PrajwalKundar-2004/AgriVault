//run using terminal using node js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//connection url
const MONGODB_URI = process.env.MONGODB_URI;

//user definition for script
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    secretKey: {                 // <--- ADDED SECRET KEY HERE
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "staff"],
        default: "staff"
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        //clear old records create fresh
        await User.deleteMany({});
        console.log('Admin users cleared');

        //define master shared credentials
        const masterEmail = process.env.ADMIN_EMAIL;
        const masterPassword = process.env.ADMIN_PASSWORD;
        const masterSecretKey = process.env.ADMIN_SECRET_KEY; // <--- NEW ADMIN PIN

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(masterPassword, salt);
        const hashedSecretKey = await bcrypt.hash(masterSecretKey, salt);

        //Insert admin user
        const masterAdmin = new User({
            name: 'Pastry House Admin',
            email: masterEmail,
            password: hashedPassword,
            secretKey: hashedSecretKey,  // <--- ADDED TO DATABASE RECORD
            role: 'admin'
        });
        
        await masterAdmin.save();
        
        console.log('✅ Admin user successfully created!');
        console.log('-----------------------------------');
        console.log('Email:      ', masterEmail);
        console.log('Password:   ', masterPassword);
        console.log('Secret Key: ', masterSecretKey);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        //disconnect from db engine
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

seedAdmin();