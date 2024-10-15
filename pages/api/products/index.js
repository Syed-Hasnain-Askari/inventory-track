import {
	getAllProducts,
	createProduct
} from "../../../controller/inventryController";
import { rateLimit } from "../../../lib/ratelimit";
import bodyParser from "body-parser";

// Custom middleware to parse JSON bodies with a larger limit
const parseBody = bodyParser.json({ limit: "50mb" });

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
