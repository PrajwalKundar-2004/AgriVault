import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );

        response.cookies.set('staff_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("Staff Logout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
