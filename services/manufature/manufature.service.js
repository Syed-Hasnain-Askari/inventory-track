const Manufacture = require("../../models/manufacture");
export const getManufactureService = async () => {
	try {
		const manufactures = await Manufacture.aggregate([
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "manufacture",
					as: "result"
				}
			},
			{
				$addFields: {
					total_productCount: {
						$size: "$result"
					},
					total_stock: {
						$sum: {
							$map: {
								input: "$result",
								as: "product",
								in: "$$product.stock"
							}
						}
					}
				}
			},
			{
				$project: {
					_id: 1,
					name: 1,
					image: 1,
					location: 1,
					email: 1,
					contactName: 1,
					total_productCount: 1,
					total_stock: 1
				}
			}
		]);
		return manufactures;
	} catch (error) {
		throw new Error(error);
	}
};
