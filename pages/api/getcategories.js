import connectDB from "../../lib/db";
const Category = require("../../models/category");

export default async function handler(req, res) {
	await connectDB();
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Only GET requests are allowed" });
	}
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching products", error: error.message });
	}
}
