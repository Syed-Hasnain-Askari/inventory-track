const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Users = require("../models/users");
const connectDB = require("../lib/db");

dotenv.config();

const seedAdmin = async () => {
	try {
		await connectDB();

		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;
		const adminName = process.env.ADMIN_NAME || "Admin";

		if (!adminEmail || !adminPassword) {
			console.error(
				"Please provide ADMIN_EMAIL and ADMIN_PASSWORD in your environment file."
			);
			process.exit(1);
		}

		const existingAdmin = await Users.findOne({ email: adminEmail });

		if (existingAdmin) {
			console.log("Admin user already exists. Skipping seeding.");
		} else {
			const hashedPassword = await bcrypt.hash(adminPassword, 10);

			await Users.create({
				username: adminName,
				email: adminEmail,
				password: hashedPassword
			});

			console.log("Admin user created successfully.");
		}

		await mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error(`Error seeding admin: ${error.message}`);
		process.exit(1);
	}
};

seedAdmin();
