import { LoginFormSchema } from "../../util/validation/form";

export async function login(state, formData) {
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
}
