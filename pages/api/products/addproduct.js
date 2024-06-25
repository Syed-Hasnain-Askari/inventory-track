import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method === "POST") {
		try {
			console.log(req.body, "req.body");
			const {
				name,
				price,
				description,
				stock,
				category,
				manufacturePrice,
				image
			} = req.body;

			// Ensure all fields are present
			if (
				!name ||
				!price ||
				!description ||
				!stock ||
				!category ||
				!manufacturePrice ||
				!image
			) {
				return res.status(400).json({ message: "Missing fields" });
			}
			const product = new Product(req.body);
			const response = await product.save();
			return res.status(200).json({
				message: "Product added successfully",
				result: response
			});
		} catch (error) {
			console.error("Error adding product:", error); // Log the error to the console
			return res
				.status(500)
				.json({ message: "Error adding product", error: error.message });
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
