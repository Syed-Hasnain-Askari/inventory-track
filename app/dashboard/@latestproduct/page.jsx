import ProductTable from "../../../components/Table/ProductTable";
import React from "react";
import { BASE_URL } from "../../../lib/config";
async function fetchData() {
	try {
		const response = await fetch(`${BASE_URL}/api/products/get-latestproduct`, {
			next: { revalidate: 120 }
		});
		const data = await response.json();
		return data.result;
	} catch (error) {
		console.log(error, "error");
	}
}
export default async function LatestProducts() {
	const data = await fetchData();
	return (
		<React.Fragment>
			<ProductTable data={data} />
		</React.Fragment>
	);
}
