import connectDB from "../../../lib/db";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";
const Product = require("../../../models/products");
const Customer = require("../../../models/customer");
const Order = require("../../../models/order");

export default apiHandler(async (req, res) => {
	if (req.method !== "GET") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	await connectDB();

	const [totalProduct, totalCustomers, orderStats] = await Promise.all([
		Product.aggregate([{ $count: "totalProduct" }]),
		Customer.aggregate([{ $count: "totalCustomers" }]),
		Order.aggregate([
			{
				$group: {
					_id: null,
					totalOrders: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" }
				}
			}
		])
	]);

	return res.success({
		totalProduct: totalProduct[0]?.totalProduct || 0,
		totalCustomers: totalCustomers[0]?.totalCustomers || 0,
		totalOrders: orderStats[0]?.totalOrders || 0,
		totalRevenue: orderStats[0]?.totalRevenue || 0
	}, "Data fetched successfully");
});

