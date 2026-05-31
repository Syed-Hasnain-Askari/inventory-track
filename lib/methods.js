"use server";
import { cookies } from "next/headers";
import { BASE_URL } from "./config";

export const getProducts = async () => {
	const response = await fetch(`${BASE_URL}/api/products/get-latestproduct`, {
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
	const response = await fetch(`${BASE_URL}/api/categories`, {
		cache: "no-store",
		headers: {
			Cookie: (await cookies()).toString()
		}
	});
	return await response.json();
};
