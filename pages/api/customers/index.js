import {
	createCustomer,
	getCustomers
} from "../../../controller/customerController";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";

export default apiHandler(async (req, res) => {
	if (req.method === "GET") {
		return getCustomers(req, res);
	}

	if (req.method === "POST") {
		return createCustomer(req, res);
	}

	throw new ApiError(405, `Method ${req.method} Not Allowed`);
});

