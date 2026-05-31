import Product from "../../models/products";

export const fetchProducts = async ({
	search,
	category,
	page,
	limit
}) => {
	try {
		const pageNumber = parseInt(page, 10) || 1;
		const limitNumber = parseInt(limit, 10) || 10;

		if (search) {
			const searchResult = await Product.find({
				$or: [
					{ name: { $regex: search, $options: "i" } },
					{ sku: { $regex: search, $options: "i" } },
					{ tags: { $elemMatch: { $regex: search, $options: "i" } } }
				]
			})
				.populate("category", "name")
				.sort({ createdAt: -1 })
				.lean();

			return { searchResult };
		}

		const match = {};
		if (category) match.category = category;

		const skip = (pageNumber - 1) * limitNumber;
		const totalProducts = await Product.countDocuments(match);
		const products = await Product.find(match)
			.populate("category", "name")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNumber)
			.lean();

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

export const createProductService = async (payload) => {
	try {
		const product = new Product(payload);
		return await product.save();
	} catch (error) {
		throw new Error(error.message);
	}
};

export const getProductByIdService = async (id) => {
	try {
		return await Product.findById(id)
			.populate("category", "name");
	} catch (error) {
		throw new Error(error.message);
	}
};

export const updateProductByIdService = async (id, data) => {
	try {
		return await Product.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

export const getLatestProductsServices = async () => {
	try {
		const products = await Product.aggregate([
			{
				$lookup: {
					from: "categories",
					localField: "category",
					foreignField: "_id",
					as: "categoryInfo"
				}
			},
			{ $unwind: "$categoryInfo" },
			{
				$project: {
					_id: 1,
					name: 1,
					sku: 1,
					description: 1,
					shortDescription: 1,
					price: 1,
					compareAtPrice: 1,
					image: 1,
					status: 1,
					stock: 1,
					category: "$categoryInfo.name",
					createdAt: 1,
					updatedAt: 1
				}
			},
			{ $sort: { createdAt: -1 } },
			{ $limit: 5 }
		]);

		return { products };
	} catch (error) {
		throw new Error(error.message);
	}
};
