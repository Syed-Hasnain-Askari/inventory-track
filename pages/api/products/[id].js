import {
	deleteProductById,
	getProductById,
	updateProductById
} from "../../../controller/inventryController";
export default async function handler(req, res) {
	const { id } = req.query;
	if (req.method === "GET") {
		return getProductById(req, res, id);
	} else if (req.method === "PATCH") {
		return updateProductById(req, res, id);
	} else if (req.method === "DELETE") {
		return deleteProductById(req, res, id);
	} else {
		res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
