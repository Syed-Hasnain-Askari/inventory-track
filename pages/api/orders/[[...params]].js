import orderService from "../../../services/order/order.service";
import connectDB from "../../../lib/db";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";

export const getAllOrders = async (req, res) => {
        const {
                page = 1,
                limit = 10,
                status,
                paymentStatus,
                userId,
                startDate,
                endDate
        } = req.query;

        const filters = { status, paymentStatus, userId, startDate, endDate };
        const result = await orderService.getAllOrders(
                filters,
                parseInt(page),
                parseInt(limit)
        );

        return res.success(result.data, "Orders fetched successfully", 200, {
                pagination: result.pagination,
                summary: result.summary
        });
};

export const getOrderById = async (req, res, id) => {
        const result = await orderService.getOrderById(id);
        if (!result.success) {
                throw new ApiError(404, result.message || "Order not found");
        }
        return res.success(result.data);
};

export const createOrder = async (req, res) => {
        const result = await orderService.createOrder(req.body);
        return res.success(result.data, "Order created successfully", 201);
};

export const updateOrderStatus = async (req, res, id) => {
        const { status } = req.body;
        const result = await orderService.updateOrderStatus(id, status);
        if (!result.success) {
                throw new ApiError(400, result.message || "Failed to update order status");
        }
        return res.success(result.data, result.message || "Order status updated successfully");
};

export const updatePaymentStatus = async (req, res, id) => {
        const { paymentStatus, transactionId } = req.body;
        const result = await orderService.updatePaymentStatus(
                id,
                paymentStatus,
                transactionId
        );
        if (!result.success) {
                throw new ApiError(400, result.message || "Failed to update payment status");
        }
        return res.success(result.data, result.message || "Payment status updated successfully");
};

export const cancelOrder = async (req, res, id) => {
        const result = await orderService.cancelOrder(id);
        if (!result.success) {
                throw new ApiError(400, result.message || "Failed to cancel order");
        }
        return res.success(result.data, result.message || "Order cancelled successfully");
};

export const getUserOrders = async (req, res, userId) => {
        const { page = 1, limit = 10 } = req.query;
        const result = await orderService.getUserOrders(
                userId,
                parseInt(page),
                parseInt(limit)
        );
        return res.success(result.data, "User orders fetched", 200, {
                pagination: result.pagination
        });
};

export const getDashboardStats = async (req, res) => {
        const result = await orderService.getDashboardStats();
        return res.success(result.data);
};

// Main handler for order routes
export default apiHandler(async (req, res) => {
        await connectDB();
        const { params } = req.query;

        if (req.method === "GET") {
                // GET /api/orders/dashboard/stats
                if (params?.[0] === "dashboard" && params?.[1] === "stats") {
                        return getDashboardStats(req, res);
                }
                // GET /api/orders/user/[userId]
                if (params?.[0] === "user" && params?.[1]) {
                        return getUserOrders(req, res, params[1]);
                }
                // GET /api/orders/[id]
                if (params?.[0] && params.length === 1) {
                        return getOrderById(req, res, params[0]);
                }
                // GET /api/orders
                return getAllOrders(req, res);
        } else if (req.method === "POST") {
                // POST /api/orders
                return createOrder(req, res);
        } else if (req.method === "PUT") {
                // PUT /api/orders/status/[id]
                if (params?.[0] === "status" && params?.[1]) {
                        return updateOrderStatus(req, res, params[1]);
                }
                // PUT /api/orders/payment/[id]
                if (params?.[0] === "payment" && params?.[1]) {
                        return updatePaymentStatus(req, res, params[1]);
                }
        } else if (req.method === "DELETE") {
                // DELETE /api/orders/[id]
                if (params?.[0]) {
                        return cancelOrder(req, res, params[0]);
                }
        } else {
                throw new ApiError(405, `Method ${req.method} Not Allowed`);
        }
});
