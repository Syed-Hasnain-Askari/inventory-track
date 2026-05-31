"use server";
import { cookies } from "next/headers";
import { getServerBaseUrl } from "./server-url";

export const getProducts = async () => {
	const baseUrl = getServerBaseUrl();
	const response = await fetch(`${baseUrl}/api/products/get-latestproduct`, {
		cache: "no-store",
		headers: {
			Cookie: (await cookies()).toString()
		}
	});
	if (!response.ok) {
		return { success: false, result: [] };
	}

	return await response.json();
};

export const getCategories = async () => {
	const baseUrl = getServerBaseUrl();
	const response = await fetch(`${baseUrl}/api/categories`, {
		cache: "no-store",
		headers: {
			Cookie: (await cookies()).toString()
		}
	});
	return await response.json();
};
