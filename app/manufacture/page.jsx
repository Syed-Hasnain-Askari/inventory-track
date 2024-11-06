import React from "react";
import Header from "../../components/Header";
import { Header as ManufactureHeader } from "../../components/Manufacture/Header";
import Footer from "../../components/Footer";
import { Manufacture } from "../../components/Manufacture/Manufacture";
import { Sider } from "../../components/Manufacture/Sider";
import { BASE_URL } from "../../lib/config";
import { cookies } from "next/headers";
async function fetchData() {
	try {
		const session = (await cookies()).get("session")?.value;
		const response = await fetch(`${BASE_URL}/api/manufacture`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include" // Optional: may ensure inclusion for cross-origin
		});
		const data = await response.json();
		return data.result;
	} catch (error) {
		console.error(error);
	}
}
export default async function ManufacturePage() {
	const response = await fetchData();
	// Handle the case where response is null (i.e., data fetching failed)
	if (!response) {
		return (
			<div>
				<h1>Error: Product not found or failed to load.</h1>
			</div>
		);
	}
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
