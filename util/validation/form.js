import { z } from "zod";

// Define the file size limit and accepted file types as constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const signUp = z.object({
	username: z
		.string({ message: "Name is required" })
		.min(3, "Name should be at least 3 characters"),
	email: z.string({ message: "Email is required" }).email(),
	password: z.string({ message: "Password is required" })
});
