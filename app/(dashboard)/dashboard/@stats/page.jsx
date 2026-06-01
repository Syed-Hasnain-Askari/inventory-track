import DataStatsOne from "../../../../components/DataStats";
import React from "react";
import { cookies } from "next/headers";

async function fetchData() {
	try {
		const session = (await cookies()).get("session")?.value;
		const response = await fetch(`${process.env.BASE_URL}/api/stats`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Stats request failed with ${response.status}`);
		}

		const data = await response.json();
		return data.result;
	} catch (error) {
		console.error("Failed to load dashboard stats:", error);
		return {
			totalProduct: 0,
			totalCustomers: 0,
			totalOrders: 0,
			totalRevenue: 0
		};
	}
}

export default async function Stats() {
	const data = await fetchData();
	console.log(data, "Data");
	return (
		<>
			<DataStatsOne data={data} />
		</>
	);
}
