import connectDB from "../lib/db";
import { apiHandler, ApiError } from "../util/errorMiddleware";
const Customer = require("../models/customer");

export const getCustomers = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();
	const customers = await Customer.find().sort({ createdAt: -1 }).lean();
	
	return res.success(customers, "Customers fetched successfully");
});

export const createCustomer = apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();
	const customer = await Customer.create(req.body);
	
	return res.success(customer, "Customer created successfully", 201);
});


