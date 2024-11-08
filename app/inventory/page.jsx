import React, { Suspense, use } from "react";
import { Header as ProductInventryHeader } from "../../components/ProductInventry/Header";
import { Sider } from "../../components/ProductInventry/Sider";
import Footer from "../../components/Footer";
import Products from "../../components/ProductInventry/Products";
import GridListToggle from "../../components/GridListToggle";
import Pagination from "../../components/pagination/index";
import { BASE_URL } from "../../lib/config";
import { cookies } from "next/headers";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../../components/ui/card";
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	Table
} from "../../components/ui/table";
import { Product } from "./product";
import { ProductsTable } from "../../components/ProductInventry/ProductTable";
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
		<React.Fragment>
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12">
					<ProductInventryHeader />
				</div>
				{/* <aside className="col-span-3">
					<Sider />
				</aside> */}
				<div className="col-span-12">
					{/* <div className="flex flex-row justify-end">
						<GridListToggle />
					</div> */}
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
					{/* <Products data={data} /> */}
					{data?.pagination?.totalProducts <= 10 ? <></> : <Pagination />}
				</div>
			</div>
			<Footer />
		</React.Fragment>
	);
};
export default InventoryPage;
