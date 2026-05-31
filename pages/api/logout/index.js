const isProduction = process.env.NODE_ENV === "production";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	// Clear the token cookie by setting Max-Age to 0
	res.setHeader(
		"Set-Cookie",
		`session=; HttpOnly; Path=/; Max-Age=0; SameSite=${
			isProduction ? "None" : "Lax"
		}; ${isProduction ? "Secure;" : ""}`
	);

	return res.status(200).json({ message: "Logout successful" });
}
