const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		contact: {
			type: String,
			required: false
		},
		profilePic: {
			type: String,
			required: false
		}
	},
	{
		timestamps: true
	}
);

// Use the existing model if it exists, otherwise create a new one
const Users = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = Users;
