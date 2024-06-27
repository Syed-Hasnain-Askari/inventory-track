import connectDB from "../../../lib/db";
const Product = require("../../../models/products");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		console.log(req.query, "req.params");
		try {
			if (req.query.category) {
				const products = await Product.aggregate([
					{
						$lookup: {
							from: "categories",
							localField: "category",
							foreignField: "_id",
							as: "result"
						}
					},
					{
						$unwind: {
							path: "$result"
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
							category: "$result.name"
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
						$search: {
							index: "searchproducts",
							text: {
								query: `{"name":${req.query.search}}`,
								path: {
									wildcard: "*"
								}
							}
						}
					},
					{
						$lookup: {
							from: "categories",
							localField: "category",
							foreignField: "_id",
							as: "result"
						}
					},
					{
						$unwind: {
							path: "$result"
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
							category: "$result.name"
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
						as: "result"
					}
				},
				{
					$unwind: {
						path: "$result"
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
						category: "$result.name"
					}
				}
			]);
			// .sort({ createdAt: -1 })
			// .exec();
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
