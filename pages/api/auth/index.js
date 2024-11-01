import * as jose from "jose";
import connectDB from "../../../lib/db";
import User from "../../../models/users"; // Assuming you have a Mongoose User model
import bcrypt from "bcrypt";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}
	try {
		// Connect to the database
		await connectDB();

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		// Compare the provided password with the stored hash
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		// Generate JWT
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const alg = "HS256";
		const jwt = await new jose.SignJWT({ email })
			.setProtectedHeader({ alg })
			.setIssuedAt()
			.setExpirationTime("2h")
			.sign(secret);
		// Set cookie using res.setHeader
		res.setHeader(
			"Set-Cookie",
			`token=${jwt}; HttpOnly; Path=/; Max-Age=${2 * 60 * 60}`
		);
		return res.status(200).json({
			data: {
				accessToken: jwt,
				user: user
			},
			message: "Login success"
		});
	} catch (error) {
		console.error("Error during login:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}
