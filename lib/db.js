const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function normalizeMongoUri(value) {
	if (!value) {
		return "";
	}

	return value.trim().replace(/^["']|["']$/g, "");
}

const URL = normalizeMongoUri(
	process.env.MONGODB_URI || process.env.MONGODB_URL || ""
);

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

	if (!/^mongodb(\+srv)?:\/\//i.test(URL)) {
		console.error(
			"MongoDB connection failed: invalid URI scheme. Expected mongodb:// or mongodb+srv://"
		);
		throw new Error(
			"Invalid MongoDB URI scheme. Use mongodb:// or mongodb+srv://"
		);
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
