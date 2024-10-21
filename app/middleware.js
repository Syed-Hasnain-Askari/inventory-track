// app/middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function middleware(req) {
	const jwt = cookies().get("token")?.value;

	const secret = new TextEncoder().encode(process.env.JWT_SECRET);

	if (!jwt) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	try {
		await jose.jwtVerify(jwt, secret);
		return NextResponse.next(); // Proceed to the requested page
	} catch (error) {
		console.error("JWT verification failed:", error);
		return NextResponse.redirect(new URL("/login", req.url));
	}
}
