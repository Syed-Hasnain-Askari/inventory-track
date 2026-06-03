const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	orderNumber: {
		type: String,
		unique: true
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null
	},

	customer: {
		firstName: {
			type: String,
			required: true,
			trim: true
		},
		lastName: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		phone: {
			type: String,
			required: true,
			trim: true
		}
	},

	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true
			},
			quantity: {
				type: Number,
				required: true,
				min: 1
			},
			price: {
				type: Number,
				required: true,
				min: 0
			},
			image: {
				type: String
			}
		}
	],

	total: {
		type: Number,
		required: true,
		min: 0
	},

	status: {
		type: String,
		enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
		default: "pending"
	},

	shippingAddress: {
		street: {
			type: String,
			required: true,
			trim: true
		},
		city: {
			type: String,
			required: true,
			trim: true
		},
		state: {
			type: String,
			required: true,
			trim: true
		},
		zipCode: {
			type: String,
			required: true,
			trim: true
		},
		country: {
			type: String,
			required: true,
			trim: true
		}
	},

	paymentMethod: {
		type: String,
		enum: ["cash_on_delivery"],
		default: "cash_on_delivery"
	},

	paymentStatus: {
		type: String,
		enum: ["pending", "paid", "failed"],
		default: "pending"
	},

	createAccount: {
		type: Boolean,
		default: false
	},

	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
