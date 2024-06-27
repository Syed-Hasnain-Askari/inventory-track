"use client";
import React, { useEffect } from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
	generalSearch,
	getInvetryProducts,
	getInvetryProductsByManufacture
} from "../../redux/feature/reducer/inventryReducer";
import { getCategories } from "../../redux/feature/reducer/categoryReducer";
import Spinner from "../components/Spinner";
export default function ProductInventoryPage() {
	const dispatch = useDispatch();
	const { inventryProducts, isLoading, isSuccess } = useSelector(
		(state) => state.inventry
	);
	const { categories } = useSelector((state) => state.category);
	useEffect(() => {
		Promise.all([dispatch(getInvetryProducts()), dispatch(getCategories())]);
	}, [dispatch]);
	return (
		<RootLayout>
			<Header />
			<section className="max-w-screen-xl h-screen mx-auto mt-10">
				<div className="flex justify-between items-center">
					<h1 className="xl:text-center md:text-center max-w-lg text-xl font-bold text-gray-800 xl:text-2xl">
						Product Inventory
					</h1>
					<div className="relative w-full sm:w-auto">
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
							onChange={(e) => {
								setTimeout(() => {
									dispatch(generalSearch(e.target.value));
								}, 2000);
							}}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-none block w-full sm:w-96 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
							placeholder="Search for items"
						/>
					</div>
					<Link
						href={"/addproduct"}
						className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full sm:w-auto mt-4 sm:mt-0"
					>
						Add Product
					</Link>
				</div>

				<div className="grid grid-cols-12 gap-4 mt-10">
					<div className="lg:col-span-3 col-span-12 px-10 w-full sm:w-auto">
						<div>
							<lable className="font-semibold text-sm">Manufacture</lable>
							<Select>
								<SelectTrigger className="w-full sm:w-[200px] mt-3">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Accessories</SelectItem>
									<SelectItem value="light">Accessories</SelectItem>
									<SelectItem value="dark">Desktop-PC</SelectItem>
									<SelectItem value="system">Head Phone</SelectItem>
									<SelectItem value="system">Laptop</SelectItem>
									<SelectItem value="system">Keyboard</SelectItem>
									<SelectItem value="system">Mouse</SelectItem>
									<SelectItem value="system">Smartphone</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="mt-10">
							<lable className="font-semibold text-sm">Category</lable>
							<Select
								onValueChange={(e) => {
									dispatch(getInvetryProductsByManufacture(e));
								}}
							>
								<SelectTrigger className="w-full sm:w-[200px] mt-3">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent>
									{categories?.result?.map((category) => {
										return (
											<SelectItem value={category.name}>
												{category.name}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="col-span-9">
						<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
							{isLoading ? (
								<Spinner />
							) : (
								inventryProducts?.map((product) => {
									return (
										<ProductCard
											key={product._id}
											name={product.name}
											description={product.description}
											image={product.image}
											price={product.price}
											category={product.category}
										/>
									);
								})
							)}
						</section>
					</div>
				</div>
			</section>
			<Footer />
		</RootLayout>
	);
}
