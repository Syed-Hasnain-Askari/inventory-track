const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		stock: {
			type: Number,
			required: true
		},
		manufacturePrice: {
			type: Number,
			required: true
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true
		},
		image: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);
const Product =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);
module.exports = Product;
