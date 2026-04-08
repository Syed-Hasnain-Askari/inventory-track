"use server";
import { cookies } from "next/headers";
export const getProducts = async () => {
	const response = await fetch(
		"http://localhost:3000/api/products/getproduct",
		{
			cache: "no-store",
			headers: {
				Cookie: cookies().toString()
			}
		}
	);
	return await response.json();
};
export const getCategories = async () => {
	const response = await fetch("http://localhost:3000/api/getcategories", {
		cache: "no-store",
		headers: {
			Cookie: cookies().toString()
		}
	});
	return await response.json();
};
