import DataStatsOne from "../../../../components/DataStats";
import React from "react";
import { BASE_URL } from "../../../../lib/config";
import { cookies } from "next/headers";

async function fetchData() {
	const session = (await cookies()).get("session")?.value;
	const response = await fetch(`${BASE_URL}/api/stats`, {
		headers: {
			"Content-Type": "application/json",
			Cookie: `session=${session}`
		},
		credentials: "include"
	});
	console.log(response, "response");
	if (!response.ok) {
		throw new Error(`Stats request failed with ${response.status}`);
	}

	const data = await response.json();
	return data.result;
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
