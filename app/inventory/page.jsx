import React, { Suspense } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../../components/ui/card";
import { ProductsTable } from "../../components/ProductInventry/ProductTable";
import Pagination from "../../components/pagination/index";
import Spinner from "../../components/Spinner";
import InventoryLayout from "./InventoryLayout";
import { BASE_URL } from "../../lib/config";
import { cookies } from "next/headers";

async function fetchData() {
	const session = (await cookies()).get("session")?.value;
	const response = await fetch(`${BASE_URL}/api/products/`, {
		headers: {
			"Content-Type": "application/json",
			Cookie: `session=${session}`
		},
		credentials: "include"
	});
	const data = await response.json();
	return data;
}
const InventoryPage = async () => {
	const data = await fetchData();
	return (
		<InventoryLayout>
			<Card>
				<CardHeader>
					<CardTitle>Products</CardTitle>
					<CardDescription>
						Manage your products and view their sales performance.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductsTable data={data} />
				</CardContent>
			</Card>
			{data?.pagination?.totalProducts > 10 && <Pagination />}
		</InventoryLayout>
	);
};

export default InventoryPage;
