import TableOne from "../../../components/TableOne";
import React from "react";
async function fetchData() {
	const response = await fetch("http://localhost:3000/api/manufacture/", {
		cache: "no-cache"
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function Manufacture() {
	const data = await fetchData();
	console.log(data, "Data");
	return (
		<React.Fragment>
			<TableOne data={data} />
		</React.Fragment>
	);
}
