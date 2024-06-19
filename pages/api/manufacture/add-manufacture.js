import connectDB from "../../../lib/db";
const Manufacture = require("../../../models/manufacture");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "POST") {
		try {
			if (!req.body) {
				return res.status(400).json({ message: "No data found" });
			}
			const {
				name,
				description,
				location,
				image,
				address,
				mail,
				phone,
				contactName
			} = req.body;
			const product = new Manufacture({
				name,
				description,
				location,
				image,
				address,
				mail,
				phone,
				contactName
			});
			const response = await Manufacture.save();
			return res.status(200).json({
				message: "Manufacture added successfully",
				result: response
			});
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching products", error: error.message });
		}
	} else {
		res.status(500).json({ message: "This method is not allowed" });
	}
}
