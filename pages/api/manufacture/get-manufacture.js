import connectDB from "../../../lib/db";
const Manufacture = require("../../../models/manufacture");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			const manufactures = await Manufacture.find();
			return res
				.status(200)
				.json({
					message: "Manufactures fetched successfully",
					result: manufactures
				});
		} catch (error) {
			res.status(500).json({ message: "Error fetching manufactures" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
