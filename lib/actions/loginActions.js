"use server";
import { LoginFormSchema } from "../../util/validation/form";

export const login = async (prevState, formData) => {
	console.log("Hello From Register User Action");
	// 1. Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password")
	});
	console.log(validatedFields);
};
