import connectDB from "../lib/db";
import { apiHandler, ApiError } from "../util/errorMiddleware";
import orderService from "../services/order/order.service.js";
const Order = require("../models/order");
const Customer = require("../models/customer");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

const createOrderNumber = () =>
	"ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

export const getOrders = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();
	const orders = await Order.find()
		.populate("items.product", "name sku")
		.sort({ createdAt: -1 })
		.lean();

	return res.success(orders, "Orders fetched successfully");
});

export const createOrder = apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();

	const {
		customer,
		items = [],
		total = 0,
		status = "pending",
		paymentStatus = "pending",
		paymentMethod = "cash_on_delivery",
		shippingAddress,
		createAccount = false,
		password
	} = req.body || {};

	if (!customer || !customer.email || !items.length) {
		throw new ApiError(
			400,
			"Customer information and at least one order item are required"
		);
	}

	// 1. Handle Customer tracking
	let customerRecord = await Customer.findOne({ email: customer.email });
	if (!customerRecord) {
		customerRecord = await Customer.create({
			firstName: customer.firstName,
			lastName: customer.lastName,
			email: customer.email,
			phoneNumber: customer.phone,
			totalOrders: 1,
			totalSpent: total,
			addresses: [
				{
					line1: shippingAddress.street,
					city: shippingAddress.city,
					state: shippingAddress.state,
					country: shippingAddress.country,
					postalCode: shippingAddress.zipCode
				}
			]
		});
	} else {
		await Customer.findByIdAndUpdate(customerRecord._id, {
			$inc: { totalOrders: 1, totalSpent: total }
		});
	}

	// 2. Handle optional Account Creation
	let userId = null;
	if (createAccount && password) {
		const existingUser = await User.findOne({ email: customer.email });
		if (!existingUser) {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = await User.create({
				name: customer.firstName + " " + customer.lastName,
				email: customer.email,
				password: hashedPassword,
				role: "customer"
			});
			userId = newUser._id;
		} else {
			userId = existingUser._id;
		}
	}

	// 3. Create Order
	const order = await Order.create({
		orderNumber: createOrderNumber(),
		user: userId || req.body.user,
		customer,
		items,
		total,
		status,
		paymentStatus,
		paymentMethod,
		shippingAddress
	});

	return res.success(order, "Order created successfully", 201);
});

/**
 * Update Order Status
 * @param {string} orderId - Order ID
 * @param {string} status - New status (pending, processing, shipped, delivered, cancelled)
 * @returns {Object} Updated order with success message
 */
export const updateOrderStatus = apiHandler(async (req, res) => {
	if (req.method !== "PUT") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();

	const { id } = req.query;
	const { status } = req.body;

	if (!id) {
		throw new ApiError(400, "Order ID is required");
	}

	if (!status) {
		throw new ApiError(400, "Status is required");
	}

	const validStatuses = [
		"pending",
		"processing",
		"shipped",
		"delivered",
		"cancelled"
	];
	if (!validStatuses.includes(status)) {
		throw new ApiError(
			400,
			`Invalid status. Must be one of: ${validStatuses.join(", ")}`
		);
	}

	try {
		const result = await orderService.updateOrderStatus(id, status);

		if (!result.success) {
			throw new ApiError(404, result.message || "Order not found");
		}

		return res.success(
			result.data,
			result.message || "Order status updated successfully",
			200
		);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, `Error updating order status: ${error.message}`);
	}
});

/**
 * Update Payment Status
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - New payment status (pending, paid, failed)
 * @param {string} transactionId - Optional transaction ID
 * @returns {Object} Updated order with success message
 */
export const updatePaymentStatus = apiHandler(async (req, res) => {
	if (req.method !== "PUT") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();

	const { id } = req.query;
	const { paymentStatus, transactionId } = req.body;

	if (!id) {
		throw new ApiError(400, "Order ID is required");
	}

	if (!paymentStatus) {
		throw new ApiError(400, "Payment status is required");
	}

	const validStatuses = ["pending", "paid", "failed"];
	if (!validStatuses.includes(paymentStatus)) {
		throw new ApiError(
			400,
			`Invalid payment status. Must be one of: ${validStatuses.join(", ")}`
		);
	}

	try {
		const result = await orderService.updatePaymentStatus(
			id,
			paymentStatus,
			transactionId
		);

		if (!result.success) {
			throw new ApiError(404, result.message || "Order not found");
		}

		return res.success(
			result.data,
			result.message || "Payment status updated successfully",
			200
		);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, `Error updating payment status: ${error.message}`);
	}
});

/**
 * Get Order by ID
 * @param {string} orderId - Order ID
 * @returns {Object} Order details
 */
export const getOrderById = apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();

	const { id } = req.query;

	if (!id) {
		throw new ApiError(400, "Order ID is required");
	}

	try {
		const result = await orderService.getOrderById(id);

		if (!result.success) {
			throw new ApiError(404, result.message || "Order not found");
		}

		return res.success(result.data, "Order fetched successfully", 200);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, `Error fetching order: ${error.message}`);
	}
});

/**
 * Cancel Order
 * @param {string} orderId - Order ID
 * @returns {Object} Cancelled order with success message
 */
export const cancelOrder = apiHandler(async (req, res) => {
	if (req.method !== "DELETE") {
		throw new ApiError(405, "Method " + req.method + " Not Allowed");
	}

	await connectDB();

	const { id } = req.query;

	if (!id) {
		throw new ApiError(400, "Order ID is required");
	}

	try {
		const result = await orderService.cancelOrder(id);

		if (!result.success) {
			throw new ApiError(400, result.message || "Unable to cancel order");
		}

		return res.success(
			result.data,
			result.message || "Order cancelled successfully",
			200
		);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, `Error cancelling order: ${error.message}`);
	}
});
