// app/middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/inventory", "/manufacture"];
const publicRoutes = ["/login", "/"];

export async function middleware(req) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// 3. Decrypt the session from the cookie
	const cookie = cookies().get("session")?.value;
	const session = await decrypt(cookie);

	// 4. Redirect
	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	if (
		isPublicRoute &&
		session?.userId &&
		!req.nextUrl.pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}
	return NextResponse.next(); // Proceed to the requested page
}
