import { z } from "zod";

export const CategoryFormSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters" }),
	description: z.string().optional(),
	isActive: z.boolean().default(true)
});
