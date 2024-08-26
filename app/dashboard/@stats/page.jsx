import DataStatsOne from "@/components/DataStats";
import React from "react";
async function fetchData() {
	const response = await fetch("http://localhost:3000/api/stats", {
		cache: "no-cache"
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function Stats() {
	const data = await fetchData();
	return (
		<>
			<DataStatsOne data={data} />
		</>
	);
}
