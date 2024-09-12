import { getLatestProduct } from "../../../controller/inventryController";
export default async function handler(req, res) {
	if (req.method === "GET") {
		return getLatestProduct(req, res);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
