"use server";
import { LoginFormSchema } from "../../util/validation/form";

export const loginAction = async (prevState, formData) => {
	console.log("Hello From Register User Action");
	// 1. Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password")
	});
	console.log(validatedFields, "validatedFields");
	const errorMessage = { message: "Invalid login credentials." };

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors
		};
	}
};
