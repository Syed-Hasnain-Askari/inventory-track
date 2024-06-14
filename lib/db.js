const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URL = process.env.MONGODB_URL || "";

const connectDB = async () => {
	if (mongoose.connections[0].readyState) {
		return; // Already connected
	}
	try {
		await mongoose.connect(URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("MongoDB connected!!");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
