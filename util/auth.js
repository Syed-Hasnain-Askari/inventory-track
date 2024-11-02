// lib/auth.js
import * as jose from "jose";

export const verifyToken = async (req) => {
	const session = req.cookies.session; // Access the cookie directly

	if (!session) {
		return { authorized: false, message: "Unauthorized request" };
	}

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jose.jwtVerify(session, secret); // Verify the session
		return { authorized: true, payload }; // Return the payload if verification is successful
	} catch (error) {
		console.error("JWT verification failed:", error);
		return { authorized: false, message: "Invalid session" };
	}
};
