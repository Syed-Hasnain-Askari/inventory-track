"use server";
import { ProductFormSchema } from "../../util/validation/product";
import Product from "../../models/products";
import { revalidatePath } from "next/cache";

export const addProductAction = async (prevState, formData) => {
	console.log("Received form data:", formData);

	// Step 1: Validate form fields using zod schema
	const validatedFields = ProductFormSchema.safeParse({
		name: formData.get("name"),
		price: Number(formData.get("price")),
		stock: Number(formData.get("stock")),
		category: formData.get("category"),
		manufacture: formData.get("manufacture")
	});

	// Step 2: Handle validation errors
	if (!validatedFields.success) {
		console.log(
			"Validation errors:",
			validatedFields.error.flatten().fieldErrors
		);
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors // Send back field-specific errors
		};
	}

	// Step 3: Extract validated data
	const { name, price, stock, category, manufacture } = validatedFields.data;

	try {
		// Step 4: Save the validated product data to the database
		const product = await Product.create({
			name,
			price,
			stock,
			category,
			manufacture
		});
		console.log("Product saved successfully:", product);
		revalidatePath("/inventory");
		// Step 5: Return success response with product data
		return {
			success: true,
			data: product // Optionally include created product data in response
		};
	} catch (error) {
		console.error("Database error:", error);

		// Step 6: Handle and return any database or server errors
		return {
			success: false,
			errors: { general: "Failed to save product. Please try again later." }
		};
	}
};
