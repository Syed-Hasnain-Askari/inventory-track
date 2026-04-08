'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
	const token = (await cookies()).get("session")?.value;
	if (token) {
		try {
			(await cookies()).delete("session", { path: "/" });
			redirect("/login");
		} catch (error) {
			console.error("Error decrypting token during logout:", error);
		}
	}
}
