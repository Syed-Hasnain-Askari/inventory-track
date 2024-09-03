"use server";
import { signIn } from "next-auth/react";
import User from "../../../models/users";
import { hash } from "bcrypt";
import connectDB from "../../../lib/db";

export const registerUserAction = async (formData) => {
	const { username, email, password } = formData;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		return { success: false, message: "User already exists" };
	}
	// Hash the password
	const hashedPassword = await hash(password, 10);
	// Insert the new user into the database
	const newUser = new User({
		username: username,
		email: email,
		password: hashedPassword
	});
	await newUser.save();
	return {
		success: true,
		message: "User registered successfully"
	};
};
export const userProfileAction = async (name, contact, id) => {
	try {
		await connectDB();
		if (!name || !contact) {
			return {
				error: true,
				message: "name and contact is required"
			};
		} else {
			const updatedUser = await User.findByIdAndUpdate(
				id, // The ID of the user document to update
				{
					username: name, // The new name to set
					contact: contact // The new contact information to set
				},
				{ new: true } // Option to return the updated document instead of the original
			);
			if (!updatedUser) {
				return {
					error: true,
					message: "User not found"
				};
			}
			console.log("Updated User:", updatedUser);
			return {
				error: false,
				message: "User has been updated successfully"
			};
		}
	} catch (error) {
		console.error("Error updating user:", error);
		return null;
	}
};
