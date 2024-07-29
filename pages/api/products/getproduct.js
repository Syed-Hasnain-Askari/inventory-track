import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			if (req.query.category) {
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
						$unwind: "$categoryInfo"
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
						$unwind: "$manufactureInfo"
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
							manufacture: "$manufactureInfo.name"
						}
					},
					{
						$match: {
							category: req.query.category
						}
					}
				]);
				return res.status(200).json({
					message: "Product fetched successfully",
					result: products
				});
			} else if (req.query.search) {
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
						$unwind: "$categoryInfo"
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
						$unwind: "$manufactureInfo"
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
							manufacture: "$manufactureInfo.name"
						}
					},
					{
						$match: {
							category: req.query.category
						}
					}
				]);

				return res.status(200).json({
					message: "Product fetched successfully",
					result: products
				});
			}
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
					$unwind: "$categoryInfo"
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
					$unwind: "$manufactureInfo"
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
				}
			])
				.sort({ createdAt: -1 })
				.exec();
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
