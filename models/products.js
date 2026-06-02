const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	discountPrice: { type: Number },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
	image: [{ type: String }],
	stock: { type: Number, required: true, default: 0 },
	sku: { type: String, unique: true },
	rating: { type: Number, default: 0 },
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

const Product =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
