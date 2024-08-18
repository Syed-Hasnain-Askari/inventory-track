import React, { Suspense } from "react";
import Header from "../components/Header";
import { Header as ProductInventryHeader } from "../../components/ProductInventry/Header";
import { Sider } from "../../components/ProductInventry/Sider";
import Footer from "../components/Footer";
import { Products } from "../../components/ProductInventry/Products";
async function fetchData() {
	const response = await fetch("http://localhost:3000/api/products/", {
		cache: "no-store" // This makes sure the fetch does not use any cache
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data;
}

const InventoryPage = async () => {
	const data = await fetchData();
	return (
		<div className="max-w-screen-xl mx-auto">
			<ProductInventryHeader />
			<div className="grid grid-cols-12 mt-10">
				<div className="lg:col-span-3 col-span-12">
					<Sider />
				</div>
				<div className="lg:col-span-9 col-span-12">
					<Products data={data} />
				</div>
			</div>
			<Footer />
		</div>
	);
};
export default InventoryPage;
