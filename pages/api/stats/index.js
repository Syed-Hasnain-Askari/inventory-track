import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
const Manufacture = require("../../../models/manufacture");

export default async function handler(req, res) {
	await connectDB();

	if (req.method !== "GET") {
		return res.status(405).json({ message: "Only GET requests are allowed" });
	}

	try {
		// Fetch both counts concurrently
		const [totalProduct, totalManufacture] = await Promise.all([
			Product.aggregate([{ $count: "totalProduct" }]),
			Manufacture.aggregate([{ $count: "totalManufacture" }])
		]);

		res.status(200).json({
			message: "Data fetched successfully",
			result: {
				totalProduct: totalProduct[0]?.totalProduct || 0, // Handling case where no data is found
				totalManufacture: totalManufacture[0]?.totalManufacture || 0
			}
		});
	} catch (error) {
		res.status(500).json({
			message: "Error fetching data",
			error: error.message
		});
	}
}
