import Product from "../../models/products";
export const fetchProducts = async ({
	search,
	category,
	manufacture,
	page,
	limit
}) => {
	try {
		if (search) {
			console.log(search, "search");
			const searchResult = await Product.aggregate([
				{
					$search: {
						index: "searchproducts",
						text: {
							query: `name:${search}`,
							path: {
								wildcard: "*"
							}
						}
					}
				}
			]);
			console.log(searchResult, "products");
			return {
				searchResult
			};
		} else {
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
			const products = await Product.find()
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
		}
	} catch (error) {
		throw new Error(error.message);
	}
};
export const createProductService = async ({
	name,
	price,
	description,
	stock,
	category,
	manufacturePrice,
	manufacture,
	image
}) => {
	try {
		const product = new Product({
			name: name,
			price: price,
			description: description,
			stock: stock,
			category: category,
			manufacturePrice: manufacturePrice,
			manufacture: manufacture,
			image: image
		});
		const response = await product.save();
		return response;
	} catch (error) {
		throw new Error(error.message);
	}
};
export const getProductByIdService = async (id) => {
	console.log(id, "id===");
	try {
		const product = await Product.findById(id);
		return product;
	} catch (error) {
		throw new Error(error.message);
	}
};
export const updateProductByIdService = async (id, data) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			JSON.parse(data),
			{
				new: true, // Return the updated document instead of the old one
				runValidators: true // Ensure the update follows the schema validation
			}
		);

		const response = await updatedProduct.save();
		return response;
	} catch (error) {
		console.log(error);
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
				$sort: { createdAt: -1 }
			},
			{
				$limit: 5
			}
		]);
		return { products };
	} catch (error) {
		console.log(error);
	}
};
