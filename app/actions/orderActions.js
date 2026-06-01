"use server";

import { cookies } from "next/headers";

async function handleResponse(response) {
	if (!response.ok) {
		const errorText = await response.text();
		console.error(`API Error (${response.status}):`, errorText);
		throw new Error(`API Error ${response.status}: ${response.statusText}`);
	}

	const contentType = response.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		const text = await response.text();
		console.error("Non-JSON response received:", text);
		throw new Error(
			"Expected JSON response but received HTML/Text. This usually means a 404 or server error."
		);
	}

	return await response.json();
}

export async function getOrders(params = {}) {
	try {
		const queryString = new URLSearchParams(params).toString();
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(
			`${process.env.BASE_URL}/api/orders/?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
					Cookie: `session=${session}`
				},
				credentials: "include",
				cache: "no-store"
			}
		);

		return await handleResponse(response);
	} catch (error) {
		console.error("getOrders failed:", error);
		return { success: false, message: error.message, data: [] };
	}
}

export async function updateOrderStatus(id, status) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(
			`${process.env.BASE_URL}/api/orders/status/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Cookie: `session=${session}`
				},
				body: JSON.stringify({ status }),
				credentials: "include"
			}
		);

		return await handleResponse(response);
	} catch (error) {
		console.error("updateOrderStatus failed:", error);
		return { success: false, message: error.message };
	}
}

export async function getOrderStats() {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(
			`${process.env.BASE_URL}/api/orders/dashboard/stats`,
			{
				headers: {
					"Content-Type": "application/json",
					Cookie: `session=${session}`
				},
				credentials: "include",
				cache: "no-store"
			}
		);

		return await handleResponse(response);
	} catch (error) {
		console.error("getOrderStats failed:", error);
		return { success: false, message: error.message, data: {} };
	}
}

export async function getOrderById(id) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(`${process.env.BASE_URL}/api/orders/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include",
			cache: "no-store"
		});

		return await handleResponse(response);
	} catch (error) {
		console.error("getOrderById failed:", error);
		return { success: false, message: error.message, data: null };
	}
}

export async function updatePaymentStatus(id, paymentStatus) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(
			`${process.env.BASE_URL}/api/orders/payment/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Cookie: `session=${session}`
				},
				body: JSON.stringify({ paymentStatus }),
				credentials: "include"
			}
		);

		return await handleResponse(response);
	} catch (error) {
		console.error("updatePaymentStatus failed:", error);
		return { success: false, message: error.message };
	}
}

export async function cancelOrder(id) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("session")?.value;

		const response = await fetch(`${process.env.BASE_URL}/api/orders/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include"
		});

		return await handleResponse(response);
	} catch (error) {
		console.error("cancelOrder failed:", error);
		return { success: false, message: error.message };
	}
}
