import { apiHandler } from "../util/errorMiddleware";

export default apiHandler(async (req, res) => {
	return res.success(null, "Hello, world! asdsdsdsd");
});

