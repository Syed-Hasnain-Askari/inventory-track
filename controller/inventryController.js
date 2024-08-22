import connectDB from "../lib/db";
const Product = require("../models/products");
export const getAllProducts = async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const { category, manufacture } = req.query;
			const match = {};
			if (category) match.category = category;
			if (manufacture) match.manufacture = manufacture;
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
				},
				{
					$match: match
				}
			])
				.sort({ createdAt: -1 })
				.exec();

			return res.status(200).json({
				message: "Products fetched successfully",
				result: products
			});
		} catch (error) {
			res.status(500).json({
				message: "Error fetching products",
				error: error.message
			});
		}
	} else {
		res.status(500).json({ message: "This method is not allowed" });
	}
};
export const createProduct = async function handler(req, res) {
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
				manufacture,
				image
			} = req.body;
			// Ensure all fields are present
			if (
				!image ||
				!manufacture ||
				!name ||
				!price ||
				!description ||
				!stock ||
				!category ||
				!manufacturePrice
			) {
				return res.status(400).json({ message: "Missing fields" });
			}
			const product = new Product({
				name: name,
				price: price,
				description: description,
				stock: stock,
				category: category,
				manufacturePrice: manufacturePrice,
				manufacture: manufacture,
				image: image
			});
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
};
export const getProductById = async function handler(req, res, id) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const response = await Product.findById(id);
			return res.status(200).json({
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
};

export const updateProductById = async function handler(req, res, id) {
	await connectDB();
	if (req.method === "PATCH") {
		try {
			console.log(id, "ID===");
			console.log(req.body, "req.body");
			const updatedProduct = await Product.findByIdAndUpdate(
				id,
				JSON.parse(req.body),
				{
					new: true, // Return the updated document instead of the old one
					runValidators: true // Ensure the update follows the schema validation
				}
			);
			if (!updatedProduct) {
				return res.status(404).json({ message: "Product not found" });
			}
			const response = await updatedProduct.save();
			return res.status(200).json({
				result: response
			});
		} catch (error) {
			res.status(500).json({
				message: "Error updating product",
				error: error.message
			});
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};
export const deleteProductById = async function handler(req, res) {
	await connectDB();
	// Ensure the request method is DELETE
	if (req.method === "DELETE") {
		const { id } = req.query; // Assuming the ID is passed via query parameters

		if (!id) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		try {
			const product = await Product.findByIdAndDelete(id);

			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}
			return res.status(204).end(); // No content response
		} catch (error) {
			return res.status(500).json({
				message: "Error deleting product",
				error: error.message
			});
		}
	} else {
		return res.status(405).json({ message: "Method not allowed" });
	}
};