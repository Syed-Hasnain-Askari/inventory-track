"use server";
import User from "../../../models/users";
import connectDB from "../../../lib/db";
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
