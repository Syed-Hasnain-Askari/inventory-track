import connectDB from "../../../lib/db";
const Manufacture = require("../../../models/manufacture");
export default async function handler(req, res) {
	await connectDB();
	if (req.method == "GET") {
		try {
			if (req.query.search != "") {
				const manufacture = await Manufacture.aggregate([
					{
						$search: {
							index: "searchmanufacture",
							text: {
								query: req.query.search,
								path: {
									wildcard: "*"
								}
							}
						}
					}
				]);
				return res.status(200).json({
					message: "manufacture fetched successfully",
					result: manufacture
				});
			} else {
				const manufactures = await Manufacture.find();
				return res.status(200).json({
					message: "Manufactures fetched successfully",
					result: manufactures
				});
			}
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching products", error: error.message });
		}
	} else {
		res.status(500).json({ message: "This method is not allowed" });
	}
}
