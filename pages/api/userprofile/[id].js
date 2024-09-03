import { getUserProfileById } from "../../../controller/userProfileController";
export default async function handler(req, res) {
	const { id } = req.query;
	if (req.method === "GET") {
		return getUserProfileById(req, res, id);
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
