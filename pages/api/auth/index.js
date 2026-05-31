import * as jose from "jose";
import connectDB from "../../../lib/db";
import User from "../../../models/users";
import bcrypt from "bcrypt";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";
const isProduction = process.env.NODE_ENV === "production";
export default apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(400, "Email and password are required");
	}

	await connectDB();

	const user = await User.findOne({ email });
	if (!user) {
		throw new ApiError(401, "Invalid email or password");
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new ApiError(401, "Invalid email or password");
	}

	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	const alg = "HS256";
	const jwt = await new jose.SignJWT({ email })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime("2h")
		.sign(secret);
	res.setHeader(
		"Set-Cookie",
		`session=${jwt}; HttpOnly; Path=/; Max-Age=${2 * 60 * 60}; SameSite=${
			isProduction ? "None" : "Lax"
		}; ${isProduction ? "Secure;" : ""}`
	);

	return res.success(
		{
			data: {
				accessToken: jwt
			}
		},
		"Login success"
	);
});
