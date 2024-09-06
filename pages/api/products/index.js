import {
	getAllProducts,
	createProduct
} from "../../../controller/inventryController";
export default async function handler(req, res) {
	if (req.method === "GET") {
		return getAllProducts(req, res);
	} else if (req.method === "POST") {
		return createProduct(req, res);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
