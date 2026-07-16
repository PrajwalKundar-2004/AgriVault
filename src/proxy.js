import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return payload;
    } catch (e) {
        return null;
    }
}

export default async function proxy(req) {
    const { pathname } = req.nextUrl;

    const adminToken = req.cookies.get("admin_token")?.value;
    const staffToken = req.cookies.get("staff_token")?.value;
    const customerToken = req.cookies.get("customer_token")?.value;

    // --- RULE 0: Root Route ---
    if (pathname === "/") {
        const customerPayload = customerToken ? await verifyToken(customerToken) : null;
        if (customerPayload && customerPayload.role === "customer") {
            return NextResponse.redirect(new URL("/customer/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/customer/login", req.url));
    }

    // --- RULE 1: Admin Route Protection ---
    if (pathname.startsWith("/vault-admin")) {
        const adminPayload = adminToken ? await verifyToken(adminToken) : null;

        if (pathname === "/vault-admin/login") {
            if (adminPayload && adminPayload.role === "admin") {
                return NextResponse.redirect(new URL("/vault-admin/dashboard", req.url));
            }
            return NextResponse.next();
        }

        if (!adminPayload || adminPayload.role !== "admin") {
            return NextResponse.redirect(new URL("/vault-admin/login", req.url));
        }
        return NextResponse.next();
    }

    // --- RULE 2: Staff Route Protection ---
    if (pathname.startsWith("/staff")) {
        const staffPayload = staffToken ? await verifyToken(staffToken) : null;

        if (pathname === "/staff/login" || pathname === "/staff/register") {
            if (staffPayload && staffPayload.role === "staff") {
                return NextResponse.redirect(new URL("/staff/dashboard", req.url));
            }
            return NextResponse.next();
        }

        if (!staffPayload || staffPayload.role !== "staff") {
            return NextResponse.redirect(new URL("/staff/login", req.url));
        }
        return NextResponse.next();
    }

    // --- RULE 3: Customer Route Protection ---
    if (pathname.startsWith("/customer")) {
        const customerPayload = customerToken ? await verifyToken(customerToken) : null;

        if (pathname === "/customer/login" || pathname === "/customer/register") {
            if (customerPayload && customerPayload.role === "customer") {
                return NextResponse.redirect(new URL("/customer/dashboard", req.url));
            }
            return NextResponse.next();
        }

        if (!customerPayload || customerPayload.role !== "customer") {
            return NextResponse.redirect(new URL("/customer/login", req.url));
        }
        return NextResponse.next();
    }

    // --- RULE 4: API Protection ---
    if (
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/api/staff") ||
        pathname.startsWith("/api/customer")
    ) {
        const publicEndpoints = [
            "/api/admin/login",
            "/api/admin/logout",
            "/api/staff/login",
            "/api/staff/register",
            "/api/staff/logout",
            "/api/customer/login",
            "/api/customer/verify-otp",
            "/api/customer/register",
            "/api/customer/logout",
        ];

        if (publicEndpoints.includes(pathname)) {
            return NextResponse.next();
        }

        const isApiAdmin = pathname.startsWith("/api/admin");
        const isApiStaff = pathname.startsWith("/api/staff");
        const token = isApiAdmin ? adminToken : isApiStaff ? staffToken : customerToken;
        const requiredRole = isApiAdmin ? "admin" : isApiStaff ? "staff" : "customer";

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
    matcher: [
        "/",
        "/vault-admin/:path*",
        "/staff/:path*",
        "/customer/:path*",
        "/api/admin/:path*",
        "/api/staff/:path*",
        "/api/customer/:path*",
    ],
};
