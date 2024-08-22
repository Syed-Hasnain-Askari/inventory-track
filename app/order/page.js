import React from "react";
import RootLayout from "../layout";
import Header from "../components/Header";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import Table from "../components/Table";
import Footer from "../components/Footer";
import { getProducts } from "../../lib/methods";
export default async function OrderPage() {
	const response = await getProducts();
	return (
		<React.Fragment>
			<Header />
			<div className="container mt-10">
				<div className="flex flex-col sm:flex-row items-center justify-center">
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
					<div className="px-10 w-full sm:w-auto">
						<Select>
							<SelectTrigger className="w-full sm:w-[200px]">
								<SelectValue placeholder="Theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
								<SelectItem value="system">System</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<button
						className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full sm:w-auto mt-4 sm:mt-0"
						data-ripple-light="true"
					>
						Button
					</button>
				</div>
				<div className="mt-20 pb-20">
					<Table />
				</div>
			</div>
			<Footer />
		</React.Fragment>
	);
}
