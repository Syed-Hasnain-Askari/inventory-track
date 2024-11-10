"use server";
import { ProductFormSchema } from "../../util/validation/product";
export const addProductAction = async (prevState, formData) => {
	console.log(formData, "===");
	console.log("Hello From addProduct User Action");
	// 1. Validate form fields
	const validatedFields = ProductFormSchema.safeParse({
		name: formData.get("name"),
		price: Number(formData.get("price")),
		stock: Number(formData.get("stock")),
		category: formData.get("category"),
		manufacture: formData.get("manufacture")
	});
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors
		};
	}
};
