"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getServerBaseUrl } from "../../lib/server-url";

async function handleResponse(response) {
	if (!response.ok) {
		const errorText = await response.text();
		console.error(`API Error (${response.status}):`, errorText);
		throw new Error(`API Error ${response.status}: ${response.statusText}`);
	}

	const contentType = response.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		throw new Error("Expected JSON response but received HTML/Text.");
	}

	return await response.json();
}

export async function getCategories() {
	try {
		const baseUrl = getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/categories`, {
			headers: {
				"Content-Type": "application/json"
			},
			cache: "no-store"
		});

		return await handleResponse(response);
	} catch (error) {
		console.error("getCategories failed:", error);
		return { success: false, message: error.message, result: [] };
	}
}

export async function createCategory(data) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/categories`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			body: JSON.stringify(data),
			credentials: "include"
		});

		const result = await handleResponse(response);
		revalidatePath("/categories");
		return result;
	} catch (error) {
		console.error("createCategory failed:", error);
		return { success: false, message: error.message };
	}
}

export async function updateCategory(id, data) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/categories/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			body: JSON.stringify(data),
			credentials: "include"
		});

		const result = await handleResponse(response);
		revalidatePath("/categories");
		return result;
	} catch (error) {
		console.error("updateCategory failed:", error);
		return { success: false, message: error.message };
	}
}

export async function deleteCategory(id) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/categories/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include"
		});

		const result = await handleResponse(response);
		revalidatePath("/categories");
		return result;
	} catch (error) {
		console.error("deleteCategory failed:", error);
		return { success: false, message: error.message };
	}
}
