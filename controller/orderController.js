import connectDB from "../lib/db";
import { apiHandler, ApiError } from "../util/errorMiddleware";
const Order = require("../models/order");
const Customer = require("../models/customer");

const createOrderNumber = () =>
	`ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const getOrders = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();
	const orders = await Order.find()
		.populate("customer", "firstName lastName email")
		.populate("items.product", "name sku")
		.sort({ createdAt: -1 })
		.lean();

	return res.success(orders, "Orders fetched successfully");
});

export const createOrder = apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();

	const {
		customer,
		customerName,
		customerEmail,
		items = [],
		subtotal = 0,
		shippingAmount = 0,
		taxAmount = 0,
		discountAmount = 0,
		totalAmount = 0,
		status,
		paymentStatus
	} = req.body || {};

	if (!customerName || !items.length) {
		throw new ApiError(400, "customerName and at least one order item are required");
	}

	const order = await Order.create({
		orderNumber: createOrderNumber(),
		customer,
		customerName,
		customerEmail,
		items,
		subtotal,
		shippingAmount,
		taxAmount,
		discountAmount,
		totalAmount,
		status,
		paymentStatus
	});

	if (customer) {
		await Customer.findByIdAndUpdate(customer, {
			$inc: { totalOrders: 1, totalSpent: totalAmount }
		});
	}

	return res.success(order, "Order created successfully", 201);
});

