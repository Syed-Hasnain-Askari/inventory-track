import connectDB from "../../../../lib/db";
const Manufacture = require("../../../../models/manufacture");
export default async function handler(req, res) {
	await connectDB();
	if (req.method === "DELETE") {
		try {
			const { id } = req.query;
			const manufacture = await Manufacture.findByIdAndDelete(id);
			if (!manufacture) {
				return res.status(404).json({ message: "Manufacture not found" });
			}
			return res
				.status(200)
				.json({ message: "Manufacture deleted", result: manufacture });
		} catch (error) {
			res.status(500).json({ message: "Error deleting manufacture" });
		}
	} else {
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
