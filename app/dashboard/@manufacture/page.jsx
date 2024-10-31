import TableOne from "../../../components/TableOne";
import React from "react";
import { BASE_URL } from "../../../lib/config";
async function fetchData() {
	try {
		const response = await fetch(`${BASE_URL}/api/manufacture/`);
		const data = await response.json();
		return data.result;
	} catch (error) {
		throw new Error(error);
	}
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
