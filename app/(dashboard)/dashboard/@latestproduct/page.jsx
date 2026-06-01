import ProductTable from "../../../../components/Table/ProductTable";
import React from "react";
import { cookies } from "next/headers";

async function fetchData() {
	try {
		const session = (await cookies()).get("session")?.value;

		const response = await fetch(
			`${process.env.BASE_URL}/api/products/get-latestproduct`,
			{
				next: { revalidate: 120 },
				headers: {
					"Content-Type": "application/json",
					Cookie: `session=${session}`
				},
				credentials: "include"
			}
		);

		if (!response.ok) {
			throw new Error(`Latest products request failed with ${response.status}`);
		}

		const data = await response.json();
		return data.result;
	} catch (error) {
		console.error("Failed to load latest products:", error);
		return [];
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
