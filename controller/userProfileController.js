import connectDB from "../lib/db";
const User = require("../models/users");
export const getUserProfileById = async function handler(req, res, id) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const response = await User.findById(id).select("-password");
			return res.status(200).json({
				result: response
			});
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching products", error: error.message });
		}
	} else {
		res.status(500).json({ message: "This method is not allowed" });
	}
};
