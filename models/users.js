const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	role: {
		type: String,
		enum: ["admin", "staff", "customer"],
		default: "customer"
	},
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now }
});

const Users = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = Users;
