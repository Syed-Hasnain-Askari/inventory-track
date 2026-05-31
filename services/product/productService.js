// services/productService.js
import Product from "../../models/products";
import Category from "../../models/category";
import { deleteFromCloudinary } from "../../util/fileuploader";

class ProductService {
	// Get all products with pagination and filters
	async getAllProducts(filters = {}, page = 1, limit = 10) {
		try {
			const query = {};

			// Apply filters
			if (filters.category) query.category = filters.category;
			if (filters.minPrice) query.price = { $gte: filters.minPrice };
			if (filters.maxPrice)
				query.price = { ...query.price, $lte: filters.maxPrice };
			if (filters.search) {
				query.name = { $regex: filters.search, $options: "i" };
			}
			if (filters.isActive !== undefined) query.isActive = filters.isActive;

			const skip = (page - 1) * limit;

			const products = await Product.find(query)
				.populate("category", "name")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 });

			const total = await Product.countDocuments(query);

			return {
				success: true,
				data: products,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			};
		} catch (error) {
			throw new Error(`Error fetching products: ${error.message}`);
		}
	}

	// Get single product by ID
	async getProductById(id) {
		try {
			const product = await Product.findById(id).populate("category", "name");
			if (!product) {
				throw new Error("Product not found");
			}
			return product;
		} catch (error) {
			throw new Error(`Error fetching product: ${error.message}`);
		}
	}

	// Get product by SKU
	async getProductBySKU(sku) {
		try {
			const product = await Product.findOne({ sku });
			if (!product) {
				throw new Error("Product not found");
			}
			return {
				success: true,
				data: product
			};
		} catch (error) {
			throw new Error(`Error fetching product: ${error.message}`);
		}
	}

	// Create new product
	async createProduct(productData) {
		try {
			// Check if SKU already exists
			const existingProduct = await Product.findOne({ sku: productData.sku });
			if (existingProduct) {
				throw new Error("Product with this SKU already exists");
			}

			const product = new Product(productData);
			await product.save();

			return {
				success: true,
				data: product,
				message: "Product created successfully"
			};
		} catch (error) {
			throw new Error(`Error creating product: ${error.message}`);
		}
	}

	// Update product
	async updateProduct(id, updateData) {
		try {
			// Check if SKU is being updated and if it's unique
			if (updateData.sku) {
				const existingProduct = await Product.findOne({
					sku: updateData.sku,
					_id: { $ne: id }
				});
				if (existingProduct) {
					throw new Error("Product with this SKU already exists");
				}
			}

			const product = await Product.findByIdAndUpdate(
				id,
				{ ...updateData, updatedAt: Date.now() },
				{ new: true, runValidators: true }
			);

			if (!product) {
				throw new Error("Product not found");
			}

			return {
				success: true,
				data: product,
				message: "Product updated successfully"
			};
		} catch (error) {
			throw new Error(`Error updating product: ${error.message}`);
		}
	}

	// Delete product (soft delete)
	async deleteProduct(id) {
		try {
			const product = await Product.findByIdAndUpdate(
				id,
				{ isActive: false, deletedAt: Date.now() },
				{ new: true }
			);

			if (!product) {
				throw new Error("Product not found");
			}

			return {
				success: true,
				message: "Product deleted successfully"
			};
		} catch (error) {
			throw new Error(`Error deleting product: ${error.message}`);
		}
	}

	// Hard delete product (permanent)
	async hardDeleteProduct(id) {
		try {
			// Find product to get image URLs
			const product = await Product.findById(id);
			if (!product) {
				throw new Error("Product not found");
			}

			// Delete images from Cloudinary
			if (product.images && product.images.length > 0) {
				await Promise.all(
					product.images.map((url) => deleteFromCloudinary(url))
				);
			} else if (product.image) {
				// Handle case where single image string might exist
				await deleteFromCloudinary(product.image);
			}

			// Delete from database
			await Product.findByIdAndDelete(id);

			return {
				success: true,
				message: "Product permanently deleted"
			};
		} catch (error) {
			throw new Error(`Error deleting product: ${error.message}`);
		}
	}

	// Update stock
	async updateStock(id, quantity, operation = "subtract") {
		try {
			const product = await Product.findById(id);
			if (!product) {
				throw new Error("Product not found");
			}

			let newStock;
			if (operation === "subtract") {
				newStock = product.stock - quantity;
				if (newStock < 0) {
					throw new Error("Insufficient stock");
				}
			} else {
				newStock = product.stock + quantity;
			}

			product.stock = newStock;
			await product.save();

			return {
				success: true,
				data: { stock: newStock },
				message: "Stock updated successfully"
			};
		} catch (error) {
			throw new Error(`Error updating stock: ${error.message}`);
		}
	}

	// Bulk upload products
	async bulkCreateProducts(productsData) {
		try {
			const results = {
				successful: [],
				failed: []
			};

			for (const productData of productsData) {
				try {
					const product = new Product(productData);
					await product.save();
					results.successful.push(product);
				} catch (error) {
					results.failed.push({
						data: productData,
						error: error.message
					});
				}
			}

			return {
				success: true,
				data: results,
				message: `Bulk upload completed: ${results.successful.length} successful, ${results.failed.length} failed`
			};
		} catch (error) {
			throw new Error(`Error in bulk upload: ${error.message}`);
		}
	}

	// Get low stock products
	async getLowStockProducts(threshold = 10) {
		try {
			const products = await Product.find({
				stock: { $lte: threshold },
				isActive: true
			}).sort({ stock: 1 });

			return {
				success: true,
				data: products,
				count: products.length
			};
		} catch (error) {
			throw new Error(`Error fetching low stock products: ${error.message}`);
		}
	}

	// Get products by category
	async getProductsByCategory(slug, page = 1, limit = 10) {
		try {
			const category = await Category.findOne({ slug }).select("_id");
			if (!category) {
				return {
					success: true,
					data: [],
					pagination: {
						page,
						limit,
						total: 0,
						totalPages: 0
					}
				};
			}

			const skip = (page - 1) * limit;
			const products = await Product.find({
				category: category._id,
				isActive: true
			})
				.populate("category", "name slug")
				.skip(skip)
				.limit(limit);

			const total = await Product.countDocuments({
				category: category._id,
				isActive: true
			});

			return {
				success: true,
				data: products,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			};
		} catch (error) {
			throw new Error(`Error fetching products by category: ${error.message}`);
		}
	}
}

export default new ProductService();
