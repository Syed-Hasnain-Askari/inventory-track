"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Encrypts payload into a signed JWT token
export async function encrypt(payload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1h") // Token expires in 1 hour
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
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration
	const session = await encrypt({ userId, expiresAt });

	await cookies().set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/"
	});
	redirect("/dashboard");
}

// Refreshes the session if expired by re-encrypting it
export async function updateSession() {
	const session = await cookies().get("session")?.value;
	const payload = await decrypt(session);
	if (!session || !payload) {
		return null;
	}
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	await cookies().set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: "lax",
		path: "/"
	});
}

// Verifies the token and refreshes if the session is expired
export const verifyToken = async (sessionToken) => {
	try {
		const { payload, isExpired } = await decrypt(sessionToken);
		console.log(payload, isExpired, "payload, isExpired ");
		if (payload === null && isExpired === true) {
			// If the token is expired, update the session once
			console.log("Updating expired session...");
			await updateSession();
			return { isAuth: true, userId: payload.userId }; // Session refreshed successfully
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

// Deletes the session (for logout)
export async function deleteSession() {
	await cookies().delete("session");
	redirect("/login");
}
