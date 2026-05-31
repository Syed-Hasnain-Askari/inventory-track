"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const SESSION_DURATION_MS = 60 * 60 * 1000;
const SESSION_DURATION = "1h";

// Encrypts payload into a signed JWT token
export async function encrypt(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(SESSION_DURATION)
		.sign(key);
}

// Verifies and decrypts a JWT token
export async function decrypt(token) {
	try {
		const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
		return { payload, isExpired: false }; // Token is valid and not expired
	} catch (error) {
		if (error.code === "ERR_JWT_EXPIRED") {
			console.log("Session expired.");
			return { payload: null, isExpired: true }; // Indicate expiration without looping
		}
		throw error; // Throw other errors to be handled elsewhere
	}
}

// Creates a new session and sets it in cookies
export async function createSession(userId) {
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	const session = await encrypt({ userId, expiresAt });

	(await cookies()).set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/"
	});
	redirect("/dashboard");
}

// Refreshes the session by extending it for another hour
export async function updateSession(sessionToken) {
	const { payload } = await decrypt(sessionToken);
	if (!payload?.userId) {
		return null;
	}
	const expires = new Date(Date.now() + SESSION_DURATION_MS);
	const session = await encrypt({ userId: payload.userId, expiresAt: expires });
	(await cookies()).set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: "lax",
		path: "/"
	});
	redirect("/dashboard");
}

export const verifyToken = async (sessionToken) => {
	try {
		if (!sessionToken) {
			return { isAuth: false, userId: null };
		}

		const { payload, isExpired } = await decrypt(sessionToken);
		if (payload === null && isExpired) {
			return { isAuth: false, userId: null };
		}

		if (!payload?.userId) {
			return { isAuth: false, userId: null };
		}
		return { isAuth: true, userId: payload.userId };
	} catch (error) {
		console.error("Failed to verify session:", error);
		return { isAuth: false, userId: null };
	}
};
