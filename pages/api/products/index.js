import {
	getAllProducts,
	createProduct
} from "../../../controller/inventryController";
import bodyParser from "body-parser";
export default async function handler(req, res) {
	// await rateLimit(req, res, async () => {
	// 	if (req.method === "GET") {
	// 		return getAllProducts(req, res);
	// 	} else if (req.method === "POST") {
	// 		return createProduct(req, res);
	// 	} else {
	// 		res.setHeader("Allow", ["GET", "POST"]);
	// 		res.status(405).end(`Method ${req.method} Not Allowed`);
	// 	}
	// });
	if (req.method === "GET") {
		return getAllProducts(req, res);
	} else if (req.method === "POST") {
		return createProduct(req, res);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
