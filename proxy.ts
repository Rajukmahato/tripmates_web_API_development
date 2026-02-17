import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";


const publicRoutes = ['/login', '/register', '/forget-password', '/reset-password', '/about'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user', '/requests'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const getHomeForRole = () => {
        if (user?.role === "admin") return "/admin";
        return "/user/dashboard";
    };

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && user) {
        if (isAdminRoute && user.role !== 'admin') {
            return NextResponse.redirect(new URL(getHomeForRole(), request.url));
        }
        if (isUserRoute && !user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL(getHomeForRole(), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // what routes to protect/match
        "/admin/:path*",
        "/user/:path*",
        "/requests/:path*",
        "/login",
        "/register",
        "/forget-password",
        "/reset-password"
    ]
}