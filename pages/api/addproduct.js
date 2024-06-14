import connectDB from "../../lib/db";
const Product = require("../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "POST") {
		try {
			if (!req.body) {
				return res.status(400).json({ message: "No data found" });
			}
			const {
				name,
				price,
				description,
				stock,
				category,
				manufacturerPrice,
				image
			} = req.body;
			const product = new Product({
				name,
				price,
				description,
				stock,
				manufacturerPrice,
				category,
				image
			});
			const response = await product.save();
			return res.status(200).json({
				message: "Product added successfully",
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
}
