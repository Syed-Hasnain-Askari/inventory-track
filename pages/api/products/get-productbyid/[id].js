import connectDB from "../../../../lib/db";
const Product = require("../../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		const { id } = req.query;
		try {
			const response = await Product.findById(id);
			res.status(200).json({
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
