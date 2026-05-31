import { getLatestProduct } from "../../../controller/inventryController";
import { apiHandler, ApiError } from "../../../util/errorMiddleware";

export default apiHandler(async (req, res) => {
	if (req.method === "GET") {
		return getLatestProduct(req, res);
	} else {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}
});

