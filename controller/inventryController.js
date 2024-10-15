import connectDB from "../lib/db";
import { createRedisInstance } from "../lib/redis";
import { uploadOnCloudinary } from "../util/fileuploader";
import multer from "multer";
import path from "path";
import {
	fetchProducts,
	createProductService,
	getProductByIdService,
	updateProductByIdService,
	getLatestProductsServices
} from "../services/inventory/products.sevice";
const Product = require("../models/products");
export const getAllProducts = async (req, res) => {
	await connectDB();
	if (req.method === "GET") {
		try {
			const { search, category, manufacture, page, limit } = req.query;
			console.log(req.query, "req.query");
			// Call the service to fetch products
			const { searchResult, products, pagination } = await fetchProducts({
				search,
				category,
				manufacture,
				page,
				limit
			});
			return res.status(200).json({
				message: "Products fetched successfully",
				result: products || searchResult,
				pagination
			});
		} catch (error) {
			console.error("Error fetching products:", error);
			res.status(500).json({
				message: "Error fetching products",
				error: error.message
			});
		}
	} else {
		res.status(405).json({ message: "This method is not allowed" });
	}
};
export const createProduct = async function handler(req, res) {
	await connectDB();
	if (req.method === "POST") {
		try {
			console.log(req?.body);

			const upload = await uploadOnCloudinary(req?.body?.image);
			console.log(upload, "Response from clounary");

			// const { name, price, description, stock, category, manufacture, image } =
			// 	req.body;
			// console.log(req.body, "req.body===");
			// // Ensure all fields are present
			// if (
			// 	!manufacture ||
			// 	!name ||
			// 	!price ||
			// 	!description ||
			// 	!stock ||
			// 	!category
			// ) {
			// 	return res.status(400).json({ message: "Missing fields", status: 400 });
			// }
			// const product = await createProductService(
			// 	name,
			// 	price,
			// 	description,
			// 	stock,
			// 	category,
			// 	manufacture
			// );
			return res.status(200).json({
				message: "Product added successfully",
				status: 200
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
			const product = await getProductByIdService(id);
			return res.status(200).json({
				result: product
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
			const response = await updateProductByIdService(id, req.body);
			console.log(response, "response====");
			console.log(req.body, "req.body====");
			if (!response) {
				res.status(404).json({ message: "Product is not found" });
			}
			return res.status(200).json({
				message: "Updated successfully",
				result: response
			});
		} catch (error) {
			res.status(500).json({
				message: "Error updating product",
				error: error
			});
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};
export const getLatestProduct = async (req, res) => {
	try {
		if (req.method === "GET") {
			const { products } = await getLatestProductsServices();
			return res.status(200).json({
				result: products
			});
		} else {
			res.status(500).json({ message: "This method is not allowed" });
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching products", error: error.message });
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
