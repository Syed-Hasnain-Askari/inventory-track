import { z } from "zod";
export const ProductFormSchema = z.object({
	name: z.string().min(4, { message: "Name is required" }),
	price: z.number().min(1, { message: "Price is required" }),
	stock: z.number().min(0, { message: "Stock is required" }),
	category: z.string({ message: "Category is required" }),
	sku: z.string().optional(),
	description: z.string().optional()
});

