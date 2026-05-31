const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true
		},
		lastName: {
			type: String,
			default: "",
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			sparse: true
		},
		phoneNumber: {
			type: String,
			default: ""
		},
		status: {
			type: String,
			enum: ["active", "inactive", "blocked"],
			default: "active"
		},
		totalOrders: {
			type: Number,
			default: 0
		},
		totalSpent: {
			type: Number,
			default: 0
		},
		addresses: {
			type: [
				{
					label: { type: String, default: "default" },
					line1: { type: String, default: "" },
					line2: { type: String, default: "" },
					city: { type: String, default: "" },
					state: { type: String, default: "" },
					country: { type: String, default: "" },
					postalCode: { type: String, default: "" }
				}
			],
			default: []
		}
	},
	{
		timestamps: true
	}
);

const Customer =
	mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
