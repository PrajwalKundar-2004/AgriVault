export async function POST(request) {
    try {
        await connectDB();
        const { email, password, secretKey } = await request.json();

        // 1. Find user by email and verify role
        const staff = await User.findOne({ email, role: 'staff' });
        if (!staff) return NextResponse.json({ message: "Staff not found" }, { status: 404 });

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        // 3. NEW: Verify Secret Key before granting access
        if (secretKey !== process.env.STAFF_SECRET_KEY) {
            return NextResponse.json({ message: "Invalid staff secret key" }, { status: 401 });
        }

        // 4. Create Token
        const token = jwt.sign({ userId: staff._id, role: 'staff' }, process.env.JWT_SECRET);

        const response = NextResponse.json({ message: 'Login successful', role: 'staff' });
        
        response.cookies.set('staff_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}