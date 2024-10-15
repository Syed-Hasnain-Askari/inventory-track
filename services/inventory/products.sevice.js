import { createRedisInstance } from "../../lib/redis";
import Product from "../../models/products";
export const fetchProducts = async ({
	search,
	category,
	manufacture,
	page,
	limit
}) => {
	try {
		//const redis = createRedisInstance();
		// Convert page and limit to numbers
		const pageNumber = parseInt(page, 10) || 1;
		const limitNumber = parseInt(limit, 10) || 10;
		//const cachedProducts = await redis.get("products");
		// if (pageNumber === 1) {
		// 	const result = JSON.parse(cachedProducts);
		// 	console.log(result, "products");
		// 	return result;
		// }
		if (search) {
			const searchResult = await Product.aggregate([
				{
					$search: {
						index: "searchproducts",
						text: {
							query: search,
							path: {
								wildcard: "*"
							}
						}
					}
				}
			]);
			return {
				searchResult
			};
		} else {
			const match = {};
			if (category) match.category = category;
			if (manufacture) match.manufacture = manufacture;

			// Pagination logic: Calculate skip
			const skip = (pageNumber - 1) * limitNumber;

			// Get total number of products for pagination
			const totalProducts = await Product.countDocuments(match);
			const products = await Product.find(match)
				.sort({ createdAt: -1 })
				.skip(skip) // Skipping previous pages' items
				.limit(limitNumber) // Limiting to the number of items per page
				.exec();

			// Calculate the pagination values
			const totalPages = Math.ceil(totalProducts / limitNumber);
			const hasNextPage = pageNumber < totalPages;
			const hasPrevPage = pageNumber > 1;

			// Create the result object (products + pagination)
			const result = {
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
			// Only cache the result if currentPage === 1
			// if (pageNumber === 1) {
			// 	// Store products and pagination in Redis (serialize using JSON.stringify)
			// 	await redis.set("products", JSON.stringify(result), "EX", 180); // Cache expires in 40 seconds
			// }
			return result;
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

export const createProductService = async (
	name,
	price,
	description,
	stock,
	category,
	manufacture,
	image
) => {
	console.log(
		name,
		price,
		description,
		stock,
		category,
		manufacture,
		image,
		"===="
	);
	const redis = createRedisInstance();
	try {
		const product = new Product({
			name: name,
			price: price,
			description: description,
			stock: stock,
			category: category,
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
	console.log(id, data, "id, data");
	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, data, {
			new: true, // Return the updated document instead of the old one
			runValidators: true // Ensure the update follows the schema validation
		});
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
