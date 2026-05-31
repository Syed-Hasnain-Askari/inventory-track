import productService from "../../../services/product/productService";
import { uploadOnCloudinary } from "../../../util/fileuploader";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import connectDB from "../../../lib/db";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";
import { generateSKU } from "../../../util/generateSKU";

// Configure multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads");
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
	}
});

const runMiddleware = (req, res, fn) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
};

export const config = {
	api: {
		bodyParser: false
	}
};

// GET /api/products
export const getAllProducts = async (req, res) => {
	await connectDB();
	const { page = 1, limit = 10, category, search } = req.query;

	const result = await productService.getAllProducts({
		category,
		search,
		page: parseInt(page, 10),
		limit: parseInt(limit, 10)
	});

	// Use res.success with pagination as extras
	return res.success(result.data, "Products fetched successfully", 200, {
		pagination: result.pagination
	});
};
export const getProductsByCategory = async (req, res) => {
	await connectDB();
	const { slug, page = 1, limit = 10 } = req.query;

	if (!slug) {
		throw new ApiError(400, "Category slug is required");
	}

	const result = await productService.getProductsByCategory(
		slug,
		parseInt(page, 10),
		parseInt(limit, 10)
	);

	// Use res.success with pagination as extras
	return res.success(result.data, "Products fetched successfully", 200, {
		pagination: result.pagination
	});
};

// POST /api/products
export const createProduct = async (req, res) => {
	let cloudinaryResponse = null;
	let localFilePath = null;

	try {
		await connectDB();
		await runMiddleware(req, res, upload.single("image"));

		if (req.file) {
			localFilePath = req.file.path;
			cloudinaryResponse = await uploadOnCloudinary(localFilePath);
			if (!cloudinaryResponse) {
				throw new ApiError(500, "Failed to upload image to Cloudinary");
			}
		}

		const {
			name,
			price,
			stock,
			category,
			description,
			sku,
			discountPrice,
			status,
			featured,
			tags
		} = req.body;

		// Validation
		if (!name || !price || !stock || !category) {
			throw new ApiError(
				400,
				"Missing required fields: name, price, stock, category"
			);
		}

		const productData = {
			name,
			price: Number(price),
			stock: Number(stock),
			category: category?.trim?.() || category,
			description,
			sku: sku || generateSKU(name, Date.now().toString()),
			discountPrice: discountPrice ? Number(discountPrice) : undefined,
			status,
			featured,
			tags,
			images: cloudinaryResponse ? [cloudinaryResponse.secure_url] : []
		};

		const result = await productService.createProduct(productData);
		return res.success(result.data, "Product created successfully", 201);
	} catch (error) {
		// Rollback logic
		if (cloudinaryResponse && cloudinaryResponse.public_id) {
			try {
				await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
			} catch (deleteError) {
				console.error("Failed to rollback Cloudinary upload:", deleteError);
			}
		}

		if (localFilePath && fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
		}

		throw error; // Let apiHandler handle it
	}
};

// Main handler for product routes
export default apiHandler(async (req, res) => {
	if (req.method === "GET") {
		if (req.query.slug) {
			return getProductsByCategory(req, res);
		}
		return getAllProducts(req, res);
	} else if (req.method === "POST") {
		return createProduct(req, res);
	} else {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}
});
