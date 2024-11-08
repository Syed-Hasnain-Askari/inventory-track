import DataStatsOne from "../../../components/DataStats";
import React from "react";
import { BASE_URL } from "../../../lib/config";
import { cookies } from "next/headers";
async function fetchData() {
	const res = await cookies();
	const getCookies = res.get("session")?.value;
	try {
		const response = await fetch(`${BASE_URL}/api/stats`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${getCookies}`
			},
			credentials: "include"
		});
		const data = await response.json();
		return data.result;
	} catch (error) {
		throw new Error(error);
	}
}
export default async function Stats() {
	const data = await fetchData();
	return (
		<>
			<DataStatsOne data={data} />
		</>
	);
}
