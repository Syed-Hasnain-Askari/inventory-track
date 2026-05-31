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
import productService from "../services/product/productService";
const Product = require("../models/products");
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../lib/session";
import { apiHandler, ApiError } from "../util/errorMiddleware";

const verifyAuth = async (req) => {
	const sessionToken = req.cookies.session;
	const { isAuth } = await verifyToken(sessionToken);
	if (!isAuth) {
		throw new ApiError(401, "Failed to verify session");
	}
};

export const getAllProducts = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	await connectDB();

	const { search, category, page, limit } = req.query;

	const { searchResult, products, pagination } = await fetchProducts({
		search,
		category,
		page,
		limit
	});

	return res.success(
		products || searchResult,
		"Catalog items fetched successfully",
		200,
		{ pagination } // Note: we might want to adjust res.success to handle extra fields or just include pagination in result
	);
});

// Since I noticed pagination needs to be handled, let's adjust res.success usage or definition
// For now, I'll pass an object including both result and pagination to match existing structure if needed, 
// but let's stick to the cleaner way:

export const createProduct = apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	await connectDB();

	const { name, price, stock, category } = req.body || {};

	if (!name || price == null || stock == null || !category) {
		throw new ApiError(400, "Missing required fields: name, price, stock, category");
	}

	const product = await createProductService(req.body);
	
	return res.success(product, "Catalog item added successfully");
});

export const getProductById = apiHandler(async (req, res, id) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	await connectDB();

	const product = await getProductByIdService(id);
	
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	return res.success(product);
});

export const updateProductById = apiHandler(async (req, res, id) => {
	if (req.method !== "PATCH") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	await connectDB();

	const response = await updateProductByIdService(id, req.body);
	
	if (!response) {
		throw new ApiError(404, "Product not found");
	}

	return res.success(response, "Updated successfully");
});

export const getLatestProduct = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	await connectDB();

	const { products } = await getLatestProductsServices();
	
	return res.success(products);
});


export const deleteProductById = apiHandler(async (req, res) => {
	if (req.method !== "DELETE") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await verifyAuth(req);
	
	const { id } = req.query;
	if (!id) {
		throw new ApiError(400, "Product ID is required");
	}

	await connectDB();
	await productService.hardDeleteProduct(id);

	return res.status(204).end();
});

