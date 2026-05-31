// services/orderService.js
import Order from "../../models/order.js";
import Product from "../../models/products.js";

class OrderService {
	async getAllOrders(filters = {}, page = 1, limit = 10) {
		try {
			const query = {};

			if (filters.status) query.status = filters.status;
			if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
			if (filters.userId) query.user = filters.userId;
			if (filters.startDate) {
				query.createdAt = { $gte: new Date(filters.startDate) };
			}
			if (filters.endDate) {
				query.createdAt = {
					...query.createdAt,
					$lte: new Date(filters.endDate)
				};
			}

			const skip = (page - 1) * limit;

			const orders = await Order.find(query)
				.populate("user", "name email")
				.populate("items.product", "name price images")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 });

			const total = await Order.countDocuments(query);
			const totalRevenue = await Order.aggregate([
				{ $match: { paymentStatus: "paid" } },
				{ $group: { _id: null, total: { $sum: "$total" } } }
			]);

			return {
				success: true,
				data: orders,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				},
				summary: {
					totalRevenue: totalRevenue[0]?.total || 0,
					totalOrders: total
				}
			};
		} catch (error) {
			throw new Error(`Error fetching orders: ${error.message}`);
		}
	}

	async getOrderById(id) {
		try {
			const order = await Order.findById(id)
				.populate("user", "name email phone")
				.populate("items.product", "name price sku images");

			if (!order) {
				throw new Error("Order not found");
			}

			return {
				success: true,
				data: order
			};
		} catch (error) {
			throw new Error(`Error fetching order: ${error.message}`);
		}
	}

	async createOrder(orderData) {
	try {
		const orderCount = await Order.countDocuments();
		orderData.orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

		orderData.user = orderData.user || null;
		orderData.paymentMethod = "cash_on_delivery";
		orderData.paymentStatus = "pending";
		orderData.status = "pending";

		let total = 0;

		for (const item of orderData.items) {
			const product = await Product.findById(item.product);

			if (!product) {
				throw new Error(`Product ${item.product} not found`);
			}

			if (product.stock < item.quantity) {
				throw new Error(`Insufficient stock for product: ${product.name}`);
			}

			const price = product.discountPrice || product.price;
			item.price = price;
			total += price * item.quantity;

			product.stock -= item.quantity;
			await product.save();
		}

		orderData.total = total;

		const order = new Order(orderData);
		await order.save();

		return {
			success: true,
			data: order,
			message: "Order created successfully"
		};
	} catch (error) {
		throw new Error(`Error creating order: ${error.message}`);
	}
}

	async updateOrderStatus(id, status) {
		try {
			const order = await Order.findByIdAndUpdate(
				id,
				{ status, updatedAt: Date.now() },
				{ new: true }
			);

			if (!order) {
				throw new Error("Order not found");
			}

			return {
				success: true,
				data: order,
				message: "Order status updated successfully"
			};
		} catch (error) {
			throw new Error(`Error updating order status: ${error.message}`);
		}
	}

	async updatePaymentStatus(id, paymentStatus, transactionId = null) {
		try {
			const updateData = { paymentStatus, updatedAt: Date.now() };
			if (transactionId) updateData.transactionId = transactionId;

			const order = await Order.findByIdAndUpdate(id, updateData, {
				new: true
			});

			if (!order) {
				throw new Error("Order not found");
			}

			return {
				success: true,
				data: order,
				message: "Payment status updated successfully"
			};
		} catch (error) {
			throw new Error(`Error updating payment status: ${error.message}`);
		}
	}

	async cancelOrder(id) {
		try {
			const order = await Order.findById(id);
			if (!order) {
				throw new Error("Order not found");
			}

			if (order.status === "delivered") {
				throw new Error("Cannot cancel delivered order");
			}

			// Restore stock
			for (const item of order.items) {
				await Product.findByIdAndUpdate(item.product, {
					$inc: { stock: item.quantity }
				});
			}

			order.status = "cancelled";
			await order.save();

			return {
				success: true,
				data: order,
				message: "Order cancelled successfully"
			};
		} catch (error) {
			throw new Error(`Error cancelling order: ${error.message}`);
		}
	}

	async getUserOrders(userId, page = 1, limit = 10) {
		try {
			const skip = (page - 1) * limit;

			const orders = await Order.find({ user: userId })
				.populate("items.product", "name images")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 });

			const total = await Order.countDocuments({ user: userId });

			return {
				success: true,
				data: orders,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			};
		} catch (error) {
			throw new Error(`Error fetching user orders: ${error.message}`);
		}
	}

	async getDashboardStats() {
		try {
			const now = new Date();
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

			const [
				totalOrders,
				totalRevenue,
				averageOrderValue,
				pendingOrders,
				monthlyOrders,
				monthlyRevenue
			] = await Promise.all([
				Order.countDocuments(),
				Order.aggregate([
					{ $match: { paymentStatus: "paid" } },
					{ $group: { _id: null, total: { $sum: "$total" } } }
				]),
				Order.aggregate([
					{ $match: { paymentStatus: "paid" } },
					{ $group: { _id: null, avg: { $avg: "$total" } } }
				]),
				Order.countDocuments({ status: "pending" }),
				Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
				Order.aggregate([
					{
						$match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } }
					},
					{ $group: { _id: null, total: { $sum: "$total" } } }
				])
			]);

			return {
				success: true,
				data: {
					totalOrders,
					totalRevenue: totalRevenue[0]?.total || 0,
					averageOrderValue: averageOrderValue[0]?.avg || 0,
					pendingOrders,
					monthlyOrders,
					monthlyRevenue: monthlyRevenue[0]?.total || 0
				}
			};
		} catch (error) {
			throw new Error(`Error fetching dashboard stats: ${error.message}`);
		}
	}
}

export default new OrderService();
