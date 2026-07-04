import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedStaff = await User.findOneAndDelete({ 
            _id: id,
            role: { $in: ['STAFF', 'staff'] } 
        });

        if (!deletedStaff) {
            return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Staff member removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting staff:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
