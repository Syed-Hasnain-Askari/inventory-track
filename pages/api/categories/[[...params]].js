import connectDB from "../../../lib/db";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";
const Category = require("../../../models/category");

export const getAllCategories = async (req, res) => {
	await connectDB();
	const categories = await Category.find({}).sort({ createdAt: -1 });
	return res.success(categories);
};

export const createCategory = async (req, res) => {
	await connectDB();
	const { name, description, isActive } = req.body;
	
	if (!name) {
		throw new ApiError(400, "Name is required");
	}

	const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

	const category = await Category.create({
		name,
		slug,
		description,
		isActive
	});

	return res.success(category, "Category created successfully", 201);
};

export const updateCategory = async (req, res, id) => {
	await connectDB();
	const { name, description, isActive } = req.body;

	const updateData = { description, isActive };
	if (name) {
		updateData.name = name;
		updateData.slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
	}

	const category = await Category.findByIdAndUpdate(
		id,
		updateData,
		{ new: true }
	);

	if (!category) {
		throw new ApiError(404, "Category not found");
	}

	return res.success(category, "Category updated successfully");
};

export const deleteCategory = async (req, res, id) => {
	await connectDB();
	const category = await Category.findByIdAndDelete(id);

	if (!category) {
		throw new ApiError(404, "Category not found");
	}

	return res.success(null, "Category deleted successfully");
};

export default apiHandler(async (req, res) => {
	const { params } = req.query;

	if (req.method === "GET") {
		return getAllCategories(req, res);
	} else if (req.method === "POST") {
		return createCategory(req, res);
	} else if (req.method === "PUT") {
		if (params?.[0]) {
			return updateCategory(req, res, params[0]);
		}
	} else if (req.method === "DELETE") {
		if (params?.[0]) {
			return deleteCategory(req, res, params[0]);
		}
	} else {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}
});

