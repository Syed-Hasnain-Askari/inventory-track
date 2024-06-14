import React from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export default function ProductInventoryPage() {
	return (
		<RootLayout>
			<Header />
			<section className="container mt-10">
				<h1 className="xl:text-center md:text-center max-w-lg text-xl font-bold text-gray-800 xl:text-2xl">
					Product InventoryPage
				</h1>
				<div className="flex justify-center items-center">
					<div className="relative mt-1 w-full sm:w-auto">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								></path>
							</svg>
						</div>
						<input
							type="text"
							id="table-search"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-none block w-full sm:w-96 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
							placeholder="Search for items"
						/>
					</div>
				</div>
				<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					<ProductCard />
					<ProductCard />
					<ProductCard />
					<ProductCard />
				</section>
			</section>
			<Footer />
		</RootLayout>
	);
}
