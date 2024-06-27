import connectDB from "../../../lib/db";
const Manufacture = require("../../../models/manufacture");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "POST") {
		try {
			if (!req.body) {
				return res.status(400).json({ message: "No data found" });
			}
			const { name, location, image, email, phoneNumber, contactName } =
				req.body;
			// Ensure all fields are present
			if (
				!name ||
				!location ||
				!image ||
				!email ||
				!phoneNumber ||
				!contactName
			) {
				return res.status(400).json({ message: "Missing fields" });
			}
			const manufacture = new Manufacture(req.body);
			const response = await manufacture.save();
			return res.json({
				message: "Manufacture added",
				result: response
			});
		} catch (error) {
			res.status(500).json({
				message: "Error is adding manufacture",
				error: error.message
			});
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
