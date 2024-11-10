import connectDB from "../lib/db";
import { createRedisInstance } from "../lib/redis";
import { cookies } from "next/headers";
import { uploadOnCloudinary } from "../util/fileuploader";
import {
	fetchProducts,
	createProductService,
	getProductByIdService,
	updateProductByIdService,
	getLatestProductsServices
} from "../services/inventory/products.sevice";
const Product = require("../models/products");
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../lib/session";
// Ensure you have the correct path

export const getAllProducts = async (req, res) => {
	if (req.method === "GET") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		try {
			await connectDB();
			const { search, category, manufacture, page, limit } = req.query;

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
	if (req.method === "POST") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		try {
			await connectDB();
			const upload = await uploadOnCloudinary(req?.body?.image);
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
export const getProductById = async (req, res, id) => {
	if (req.method === "GET") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		try {
			await connectDB();
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
	if (req.method === "PATCH") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		try {
			await connectDB();
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
	if (req.method === "GET") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		try {
			await connectDB();
			const { products } = await getLatestProductsServices();
			return res.status(200).json({
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
};
export const deleteProductById = async function handler(req, res) {
	// Ensure the request method is DELETE
	if (req.method === "DELETE") {
		const sessionToken = req.cookies.session;
		const { isAuth, payload, message } = await verifyToken(sessionToken);
		console.log(isAuth, payload, message, "isAuth, payload, message");

		if (!isAuth) {
			return res.status(401).json({ message: "Failed to verify session" });
		}
		const { id } = req.query; // Assuming the ID is passed via query parameters
		if (!id) {
			return res.status(400).json({ message: "Product ID is required" });
		}
		try {
			await connectDB();
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
