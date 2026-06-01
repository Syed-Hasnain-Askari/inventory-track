const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
	try {
		if (mongoose.connections[0].readyState) {
			return;
		}

		if (!process.env.MONGODB_URI) {
			throw new Error("Missing MONGODB_URI");
		}

		await mongoose.connect(process.env.MONGODB_URI);

		console.log("MongoDB connected!!");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		throw error;
	}
};

module.exports = connectDB;
