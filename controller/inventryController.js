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

export const getAllProducts = async (NextRequest, res) => {
	await connectDB();
	if (NextRequest.method === "GET") {
		const { isAuth, payload, message } = await verifyToken(NextRequest);
		if (!isAuth) {
			return res.status(401).json({ message });
		}
		try {
			const { search, category, manufacture, page, limit } = NextRequest.query;
			console.log(NextRequest.query, "NextRequest.query");

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

export const createProduct = async function handler(NextRequest, res) {
	await connectDB();
	if (NextRequest.method === "POST") {
		const { isAuth, payload, message } = await verifyToken(NextRequest);

		if (!isAuth) {
			return res.status(401).json({ message });
		}
		try {
			console.log(NextRequest?.body);

			const upload = await uploadOnCloudinary(NextRequest?.body?.image);
			console.log(upload, "Response from clounary");

			// const { name, price, description, stock, category, manufacture, image } =
			// 	NextRequest.body;
			// console.log(NextRequest.body, "NextRequest.body===");
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
		res.status(405).end(`Method ${NextRequest.method} Not Allowed`);
	}
};
export const getProductById = async (NextRequest, res, id) => {
	await connectDB();
	if (NextRequest.method === "GET") {
		const { isAuth, payload, message } = await verifyToken(NextRequest);

		if (!isAuth) {
			// Corrected condition to check if the user is not authorized
			return res.status(401).json({ message });
		}

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

export const updateProductById = async function handler(NextRequest, res, id) {
	await connectDB();
	if (NextRequest.method === "PATCH") {
		const { authorized, payload, message } = await verifyToken(NextRequest);

		if (!authorized) {
			return res.status(401).json({ message });
		}
		try {
			const response = await updateProductByIdService(id, NextRequest.body);
			console.log(response, "response====");
			console.log(NextRequest.body, "NextRequest.body====");
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
export const getLatestProduct = async (NextRequest, res) => {
	if (NextRequest.method === "GET") {
		try {
			const { isAuth, payload, message } = await verifyToken(NextRequest);
			if (!isAuth) {
				return res.status(401).json({ message });
			}
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
export const deleteProductById = async function handler(NextRequest, res) {
	await connectDB();
	// Ensure the NextRequestuest method is DELETE
	if (NextRequest.method === "DELETE") {
		const { authorized, payload, message } = await verifyToken(NextRequest);

		if (!authorized) {
			return res.status(401).json({ message });
		}
		const { id } = NextRequest.query; // Assuming the ID is passed via query parameters

		if (!id) {
			return res
				.status(400)
				.json({ message: "Product ID is NextRequestuired" });
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
