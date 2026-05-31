import productService from "../../../services/product/productService";
import { uploadOnCloudinary } from "../../../util/fileuploader";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import connectDB from "../../../lib/db";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";

// Configure multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "./public/uploads";
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

// GET /api/products/[id]
export const getProductById = async (req, res) => {
	await connectDB();
	const { id } = req.query;
	const result = await productService.getProductById(id);
	return res.success(result);
};

// PATCH /api/products/[id]
export const updateProduct = async (req, res) => {
	let cloudinaryResponse = null;
	let localFilePath = null;

	try {
		await connectDB();
		const { id } = req.query;

		await runMiddleware(req, res, upload.single("image"));

		if (req.file) {
			localFilePath = req.file.path;
			cloudinaryResponse = await uploadOnCloudinary(localFilePath);
			if (!cloudinaryResponse) {
				throw new ApiError(500, "Failed to upload image to Cloudinary");
			}
		}

		const updateData = {
			...req.body,
			category: req.body.category?.trim?.() || req.body.category
		};
		if (cloudinaryResponse) {
			updateData.images = [cloudinaryResponse.secure_url];
		}

		if (updateData.price) updateData.price = Number(updateData.price);
		if (updateData.stock) updateData.stock = Number(updateData.stock);

		const result = await productService.updateProduct(id, updateData);
		return res.success(result.data, "Product updated successfully");
	} catch (error) {
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

		throw error;
	}
};

// DELETE /api/products/[id]
export const deleteProduct = async (req, res) => {
	await connectDB();
	const { id } = req.query;
	await productService.hardDeleteProduct(id);
	return res.success(null, "Product deleted");
};

export default apiHandler(async (req, res) => {
	if (req.method === "GET") {
		return getProductById(req, res);
	} else if (req.method === "PATCH") {
		return updateProduct(req, res);
	} else if (req.method === "DELETE") {
		return deleteProduct(req, res);
	} else {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}
});

