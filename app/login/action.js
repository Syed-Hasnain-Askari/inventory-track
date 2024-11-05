"use server";
import { LoginFormSchema } from "../../util/validation/form";
import connectDB from "../../lib/db";
import User from "../../models/users";
import bcrypt from "bcrypt";
import { createSession } from "../../lib/session";

export const loginAction = async (prevState, formData) => {
	// 1. Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password")
	});
	const errorMessage = { message: "Invalid login credentials." };
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors
		};
	}
	// Connect to the database
	await connectDB();

	// 2. Prepare data for insertion into database
	const { email, password } = validatedFields.data;
	// Find the user by email
	const user = await User.findOne({ email });
	if (!user) {
		console.log(errorMessage, "errorMessage");
		return { errors: { message: "Invalid login credentials." } };
	}
	// Compare the provided password with the stored hash
	const isValidPassword = await bcrypt.compare(password, user.password);
	// If the password does not match, return early
	if (!isValidPassword) {
		return { errors: { message: "Invalid login credentials." } };
	}
	// 4. If login successful, create a session for the user and redirect
	const userId = user._id.toString();
	await createSession(userId);
};
