import React from "react";
import Header from "../../components/Header";
import { Header as ManufactureHeader } from "../../components/Manufacture/Header";
import Footer from "../../components/Footer";
import { Manufacture } from "../../components/Manufacture/Manufacture";
import { Sider } from "../../components/Manufacture/Sider";
async function fetchData() {
	const response = await fetch("http://localhost:3000/api/manufacture", {
		next: { revalidate: 120 }
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function ManufacturePage() {
	const response = await fetchData();
	return (
		<React.Fragment>
			<Header />
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-12">
					<ManufactureHeader />
				</div>
				<aside className="col-span-3">
					<Sider />
				</aside>
				<div className="col-span-9">
					<Manufacture data={response} />
				</div>
			</div>
			<Footer />
		</React.Fragment>
	);
}
