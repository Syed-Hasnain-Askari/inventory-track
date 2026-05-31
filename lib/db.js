const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URL = (process.env.MONGODB_URI || process.env.MONGODB_URL || "").trim();

const connectDB = async () => {
	if (mongoose.connections[0].readyState) {
		return; // Already connected
	}

	if (!URL) {
		console.error(
			"MongoDB connection failed: missing MONGODB_URI (or legacy MONGODB_URL)."
		);
		throw new Error("Missing MongoDB connection string");
	}

	try {
		await mongoose.connect(URL);
		console.log("MongoDB connected!!");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		throw error;
	}
};

module.exports = connectDB;
