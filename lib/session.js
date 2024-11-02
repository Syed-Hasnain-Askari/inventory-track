import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1hr")
		.sign(key);
}

export async function decrypt(session) {
	try {
		const { payload } = await jwtVerify(session, key, {
			algorithms: ["HS256"]
		});
		return payload;
	} catch (error) {
		console.log("Failed to verify session");
		return null;
	}
}

export async function createSession(id) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	// 1. Encrypt the session ID
	const session = await encrypt({ userId: id, expiresAt });

	// 3. Store the session in cookies for optimistic auth checks
	await cookies().set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/"
	});
	redirect("/dashboard");
}
export async function deleteSession() {
	await cookies().delete("session");
	redirect("/login");
}
