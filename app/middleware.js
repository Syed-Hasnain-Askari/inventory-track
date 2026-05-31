import { NextResponse } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = [
	"http://localhost:3001",
	"http://127.0.0.1:3001"
];

function getAllowedOrigins() {
	const configuredOrigins = process.env.CORS_ORIGINS?.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	return configuredOrigins?.length
		? configuredOrigins
		: DEFAULT_ALLOWED_ORIGINS;
}

function applyCorsHeaders(response, request) {
	const origin = request.headers.get("origin");
	const requestHeaders = request.headers.get("access-control-request-headers");
	const allowedOrigins = getAllowedOrigins();

	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET,POST,PATCH,DELETE,OPTIONS"
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		requestHeaders || "Content-Type, Authorization"
	);
	response.headers.set("Access-Control-Allow-Credentials", "true");
	response.headers.set("Access-Control-Max-Age", "86400");
	response.headers.append("Vary", "Origin");

	if (origin && allowedOrigins.includes(origin)) {
		response.headers.set("Access-Control-Allow-Origin", origin);
	}

	return response;
}

export function middleware(request) {
	if (request.method === "OPTIONS") {
		return applyCorsHeaders(new NextResponse(null, { status: 204 }), request);
	}

	const { pathname } = request.nextUrl;

	if (pathname.length > 5 && pathname.endsWith("/")) {
		const rewriteUrl = request.nextUrl.clone();
		rewriteUrl.pathname = pathname.replace(/\/+$/, "");
		return applyCorsHeaders(NextResponse.rewrite(rewriteUrl), request);
	}

	return applyCorsHeaders(NextResponse.next(), request);
}

export const config = {
	matcher: ["/api/:path*"]
};
