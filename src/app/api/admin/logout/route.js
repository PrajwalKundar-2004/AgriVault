import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );

        // Delete the admin_token cookie by setting its expiration to the past
        response.cookies.set('admin_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0), // Expire immediately
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
