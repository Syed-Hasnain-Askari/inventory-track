import React from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import { Header as ManufactureHeader } from "../../components/Manufacture/Header";
import Footer from "../components/Footer";
import { Manufacture } from "../../components/Manufacture/Manufacture";
import { Sider } from "@/components/Manufacture/Sider";
async function fetchData() {
	const response = await fetch(
		"http://localhost:3000/api/manufacture/get-manufacture",
		{
			next: { revalidate: 3600 } // This makes sure the fetch does not use any cache
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function ManufacturePage() {
	const response = await fetchData();
	return (
		<RootLayout>
			<Header />
			<section className="max-w-screen-xl mx-auto mt-10">
				<ManufactureHeader />
				<hr className="mt-5 justify-center" />
				<div className="grid grid-cols-12 gap-4 mt-10 h-1/2 lg:px-0 px-5">
					<div className="lg:col-span-3 col-span-12">
						<Sider />
					</div>
					<div className="lg:col-span-9 col-span-12 px-10 lg:px-0">
						<Manufacture data={response} />
					</div>
				</div>
			</section>
			<Footer />
		</RootLayout>
	);
}
