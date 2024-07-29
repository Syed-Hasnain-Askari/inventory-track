import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const products = await Product.aggregate([
				{
					$lookup: {
						from: "categories",
						localField: "category",
						foreignField: "_id",
						as: "categoryInfo"
					}
				},
				{
					$unwind: {
						path: "$categoryInfo"
					}
				},
				{
					$lookup: {
						from: "manufactures",
						localField: "manufacture",
						foreignField: "_id",
						as: "manufactureInfo"
					}
				},
				{
					$unwind: {
						path: "$manufactureInfo"
					}
				},
				{
					$project: {
						_id: 1,
						name: 1,
						description: 1,
						price: 1,
						image: 1,
						stock: 1,
						manufacturePrice: 1,
						category: "$categoryInfo.name",
						manufacture: "$manufactureInfo.name",
						createdAt: 1,
						updatedAt: 1
					}
				},
				{
					$match: {
						manufacture: req.query.manufacture
					}
				}
			]);
			return res.status(200).json({
				message: "Product fetched successfully",
				result: products
			});
		} catch (error) {
			res.status(500).json({
				message: "Error is adding manufacture",
				error: error.message
			});
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
