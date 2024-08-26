import {
	addManufacture,
	getManufacture
} from "../../../controller/manufactureController";
export default async function handler(req, res) {
	if (req.method === "GET") {
		return getManufacture(req, res);
	} else if (req.method === "POST") {
		return addManufacture(req, res);
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
