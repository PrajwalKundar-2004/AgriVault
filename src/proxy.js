import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Get both tokens if they exist
    const adminToken = req.cookies.get("admin_token")?.value;
    const staffToken = req.cookies.get("staff_token")?.value;

    // Helper: Verify Token
    const verifyToken = async (token) => {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
            return payload;
        } catch (e) {
            return null;
        }
    };

    // --- RULE 1: Admin Route Protection ---
    if (pathname.startsWith("/vault-admin")) {
        if (pathname === "/vault-admin/login") return NextResponse.next();
        
        const adminPayload = adminToken ? await verifyToken(adminToken) : null;
        if (!adminPayload || adminPayload.role !== "admin") {
            return NextResponse.redirect(new URL("/vault-admin/login", req.url));
        }
        return NextResponse.next();
    }

    // --- RULE 2: Staff Route Protection ---
    if (pathname.startsWith("/staff")) {
        if (pathname === "/staff/login" || pathname === "/staff/register") return NextResponse.next();
        
        const staffPayload = staffToken ? await verifyToken(staffToken) : null;
        if (!staffPayload || staffPayload.role !== "staff") {
            return NextResponse.redirect(new URL("/staff/login", req.url));
        }
        return NextResponse.next();
    }

    // --- RULE 3: API Protection ---
    // Protect everything under /api/admin and /api/staff
    if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/staff")) {
        const isApiAdmin = pathname.startsWith("/api/admin");
        const token = isApiAdmin ? adminToken : staffToken;
        const requiredRole = isApiAdmin ? "admin" : "staff";

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== requiredRole) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/vault-admin/:path*", "/staff/:path*", "/api/admin/:path*", "/api/staff/:path*"],
};