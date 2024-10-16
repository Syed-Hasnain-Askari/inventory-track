import ProductTable from "../../../components/Table/ProductTable";
import React from "react";
async function fetchData() {
	const response = await fetch(
		"http://localhost:3000/api/products/get-latestproduct",
		{
			next: { revalidate: 120 }
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function LatestProducts() {
	const data = await fetchData();
	return (
		<React.Fragment>
			<ProductTable data={data} />
		</React.Fragment>
	);
}
