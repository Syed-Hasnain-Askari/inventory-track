// app/actions/productActions.js
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
	if (!contentType && response.status === 204) {
		return { success: true };
	}
	
	if (!contentType || !contentType.includes("application/json")) {
		const text = await response.text();
		console.error("Non-JSON response received:", text);
		throw new Error("Expected JSON response but received HTML/Text. This usually means a 404 or server error.");
	}

	return await response.json();
}

export async function getProducts(params = {}) {
	try {
		const queryString = new URLSearchParams(params).toString();
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = await getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/products/?${queryString}`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include",
			cache: "no-store"
		});

		return await handleResponse(response);
	} catch (error) {
		console.error("getProducts failed:", error);
		return { success: false, message: error.message, result: [] };
	}
}

export async function getProductById(id) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = await getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/products/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include",
			cache: "no-store"
		});

		return await handleResponse(response);
	} catch (error) {
		console.error("getProductById failed:", error);
		return { success: false, message: error.message };
	}
}

export async function createProduct(data) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = await getServerBaseUrl();

		const isFormData = data instanceof FormData;
		const headers = {
			Cookie: `session=${session}`
		};

		if (!isFormData) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(`${baseUrl}/api/products`, {
			method: "POST",
			headers,
			body: isFormData ? data : JSON.stringify(data),
			credentials: "include"
		});

		const result = await handleResponse(response);
		revalidatePath("/inventory");
		return { success: true, result };
	} catch (error) {
		console.error("createProduct failed:", error);
		return { success: false, message: error.message };
	}
}

export async function updateProduct(id, data) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = await getServerBaseUrl();

		const isFormData = data instanceof FormData;
		const headers = {
			Cookie: `session=${session}`
		};

		if (!isFormData) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(`${baseUrl}/api/products/${id}`, {
			method: "PATCH",
			headers,
			body: isFormData ? data : JSON.stringify(data),
			credentials: "include"
		});

		const result = await handleResponse(response);
		revalidatePath("/inventory");
		return { success: true, result };
	} catch (error) {
		console.error("updateProduct failed:", error);
		return { success: false, message: error.message };
	}
}

export async function deleteProduct(id) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;
		const baseUrl = await getServerBaseUrl();

		const response = await fetch(`${baseUrl}/api/products/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include"
		});

		await handleResponse(response);
		revalidatePath("/inventory");
		return { success: true };
	} catch (error) {
		console.error("deleteProduct failed:", error);
		return { success: false, message: error.message };
	}
}
