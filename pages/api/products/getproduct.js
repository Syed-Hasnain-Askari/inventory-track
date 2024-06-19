import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const products = await Product.find();
			return res.status(200).json({
				message: "Product fetched successfully",
				result: products
			});
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching products", error: error.message });
		}
	} else {
		res.status(500).json({ message: "This method is not allowed" });
	}
}
