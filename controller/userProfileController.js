import connectDB from "../lib/db";
import { apiHandler, ApiError } from "../util/errorMiddleware";
const User = require("../models/users");

export const getUserProfileById = apiHandler(async (req, res, id) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();
	const user = await User.findById(id).select("-password");
	
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return res.success(user);
});

