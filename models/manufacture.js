const mongoose = require("mongoose");
const ManufactureSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
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
	address: {
		type: String,
		required: true
	},
	phone: {
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
});
const Manufacture =
	mongoose.models.Manufacture ||
	mongoose.model("Manufacture", ManufactureSchema);
module.exports = Manufacture;
