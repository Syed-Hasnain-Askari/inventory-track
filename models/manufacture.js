const mongoose = require("mongoose");
const ManufactureSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		location: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: false
		},
		phoneNumber: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		contactName: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);
const Manufacture =
	mongoose.models.Manufacture ||
	mongoose.model("Manufacture", ManufactureSchema);
module.exports = Manufacture;
