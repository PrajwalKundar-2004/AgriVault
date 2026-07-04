import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// Quick inline schema to avoid Next.js module import issues in raw node script
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['staff', 'admin'], default: 'staff' },
  secretKey: { type: String }, // For admin only
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in your .env file");
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to DB');

    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const plainSecretKey = process.env.ADMIN_SECRET_KEY;

    // Check if admin already exists
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log('⚠️ Admin already exists. Deleting to recreate with fresh hashes...');
      await User.deleteOne({ email });
    }

    // Hash both password and secret key!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    const hashedSecretKey = await bcrypt.hash(plainSecretKey, salt);

    admin = new User({
      name: 'System Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
      secretKey: hashedSecretKey
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email:      ', email);
    console.log('Password:   ', plainPassword);
    console.log('Secret Key: ', plainSecretKey);
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
