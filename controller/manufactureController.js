import connectDB from "../lib/db";
import { verifyToken } from "../lib/session";
const Manufacture = require("../models/manufacture");
export const addManufacture = async function handler(req, res) {
	await connectDB();
	if (req.method == "POST") {
		const { authorized, payload, message } = await verifyToken(req);

		if (!authorized) {
			return res.status(401).json({ message });
		}
		try {
			if (!req.body) {
				return res.status(400).json({ message: "No data found" });
			}
			const { name, location, image, email, phoneNumber, contactName } =
				req.body;
			// Ensure all fields are present
			if (
				!name ||
				!location ||
				!image ||
				!email ||
				!phoneNumber ||
				!contactName
			) {
				return res.status(400).json({ message: "Missing fields" });
			}
			const manufacture = new Manufacture(req.body);
			const response = await manufacture.save();
			return res.json({
				message: "Manufacture added",
				result: response
			});
		} catch (error) {
			res.status(500).json({
				message: "Error is adding manufacture",
				error: error.message
			});
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};
export const getManufacture = async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		const { authorized, payload, message } = await verifyToken(req);

		if (!authorized) {
			return res.status(401).json({ message });
		}
		try {
			const manufactures = await Manufacture.aggregate([
				{
					$lookup: {
						from: "products",
						localField: "_id",
						foreignField: "manufacture",
						as: "result"
					}
				},
				{
					$addFields: {
						total_productCount: {
							$size: "$result"
						},
						total_stock: {
							$sum: {
								$map: {
									input: "$result",
									as: "product",
									in: "$$product.stock"
								}
							}
						}
					}
				},
				{
					$project: {
						_id: 1,
						name: 1,
						image: 1,
						location: 1,
						email: 1,
						contactName: 1,
						total_productCount: 1,
						total_stock: 1
					}
				}
			]);
			return res.status(200).json({
				message: "Manufactures fetched successfully",
				result: manufactures
			});
		} catch (error) {
			res.status(500).json({ message: "Error fetching manufactures" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};
