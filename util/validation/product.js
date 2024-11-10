import { z } from "zod";
export const ProductFormSchema = z.object({
	name: z.string().min(4, { message: "Name is required" }),
	price: z.number().min(2, { message: "Price is required" }),
	stock: z.number().min(2, { message: "Stock is required" })
});
