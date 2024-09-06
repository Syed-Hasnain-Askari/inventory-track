import Product from "../../models/products";
export const fetchProducts = async ({ category, manufacture, page, limit }) => {
	try {
		const match = {};
		if (category) match.category = category;
		if (manufacture) match.manufacture = manufacture;

		// Convert page and limit to numbers
		const pageNumber = parseInt(page, 10) || 1;
		const limitNumber = parseInt(limit, 10) || 10;

		// Pagination logic: Calculate skip
		const skip = (pageNumber - 1) * limitNumber;

		// Get total number of products for pagination
		const totalProducts = await Product.countDocuments();

		const products = await Product.aggregate([
			{
				$lookup: {
					from: "categories",
					localField: "category",
					foreignField: "_id",
					as: "categoryInfo"
				}
			},
			{
				$unwind: "$categoryInfo"
			},
			{
				$lookup: {
					from: "manufactures",
					localField: "manufacture",
					foreignField: "_id",
					as: "manufactureInfo"
				}
			},
			{
				$unwind: "$manufactureInfo"
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					price: 1,
					image: 1,
					stock: 1,
					manufacturePrice: 1,
					category: "$categoryInfo.name",
					manufacture: "$manufactureInfo.name",
					createdAt: 1,
					updatedAt: 1
				}
			},
			{
				$match: match
			}
		])
			.sort({ createdAt: -1 })
			.skip(skip) // Skipping previous pages' items
			.limit(limitNumber) // Limiting to the number of items per page
			.exec();

		// Calculate the pagination values
		const totalPages = Math.ceil(totalProducts / limitNumber);
		const hasNextPage = pageNumber < totalPages;
		const hasPrevPage = pageNumber > 1;

		return {
			products,
			pagination: {
				totalProducts,
				currentPage: pageNumber,
				totalPages,
				hasNextPage,
				hasPrevPage,
				nextPage: hasNextPage ? pageNumber + 1 : null,
				prevPage: hasPrevPage ? pageNumber - 1 : null
			}
		};
	} catch (error) {
		throw new Error(error.message);
	}
};
