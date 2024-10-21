import React from "react";
import { Header as ProductInventryHeader } from "../../components/ProductInventry/Header";
import { Sider } from "../../components/ProductInventry/Sider";
import Footer from "../../components/Footer";
import Products from "../../components/ProductInventry/Products";
import GridListToggle from "../../components/GridListToggle";
import Pagination from "../../components/pagination/index";
import { getServerSession } from "next-auth";
async function fetchData() {
	const response = await fetch("http://localhost:3000/api/products/", {
		cache: "no-cache"
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data;
}

const InventoryPage = async () => {
	const data = await fetchData();
	console.log(
		data?.pagination?.totalProducts,
		"data?.pagination?.totalProducts"
	);
	return (
		<React.Fragment>
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12">
					<ProductInventryHeader />
				</div>
				<aside className="col-span-3">
					<Sider />
				</aside>
				<div className="col-span-9">
					<div className="flex flex-row justify-end">
						<GridListToggle />
					</div>
					<Products data={data} />
					{data?.pagination?.totalProducts <= 10 ? <></> : <Pagination />}
				</div>
			</div>
			<Footer />
		</React.Fragment>
	);
};
export default InventoryPage;
