const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		slug: {
			type: String,
			trim: true,
			unique: true,
			sparse: true
		},
		description: {
			type: String,
			default: ""
		},
		image: {
			type: String,
			default: ""
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
);

const Category =
	mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;
