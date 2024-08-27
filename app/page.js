import Image from "next/image";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Table from "./components/Table";
import RootLayout from "./layout";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../components/ui/select";
import Footer from "./components/Footer";
import { getProducts } from "../lib/methods";
export default async function Page() {
	const response = await getProducts();
	console.log(response, "response");
	return (
		<>
			<Header />
			<main className="container mt-10">
				<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{response?.result?.map((item) => {
						console.log(item, "item!!!");
						return (
							<ProductCard
								key={item._id}
								name={item.name}
								description={item.description}
								image={item.image}
								price={item.price}
							/>
						);
					})}
				</section>
				<section className="mt-10">
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
								<SelectTrigger className="w-full sm:w-[300px] sm:h-[45px]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</section>
				<section className="mt-10 pb-10">
					<Table />
				</section>
				<section className="container px-4 mx-auto pb-10">
					<div className="flex flex-col">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
								<div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
									<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
										<thead className="bg-gray-50 dark:bg-gray-800">
											<tr>
												<th
													scope="col"
													className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
												>
													<div className="flex items-center gap-x-3">
														<input
															type="checkbox"
															className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
														/>
														<button className="flex items-center gap-x-2">
															<span>Company Name</span>
														</button>
													</div>
												</th>
												<th
													scope="col"
													className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
												>
													Contact
												</th>
												<th
													scope="col"
													className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
												>
													Email
												</th>
												<th
													scope="col"
													className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
												>
													Loacation
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
											<tr>
												<td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
													<div className="flex items-center gap-x-2">
														<Image
															width={32}
															height={32}
															className="object-cover w-8 h-8 rounded-full"
															src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
															alt=""
														/>
														<div>
															<h2 className="text-sm font-medium text-gray-800 dark:text-white ">
																Arthur Melo
															</h2>
															<p className="text-xs font-normal text-gray-600 dark:text-gray-400">
																authurmelo@example.com
															</p>
														</div>
													</div>
												</td>
												<td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
													Lisa Barns
												</td>
												<td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
													<div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
														<svg
															width={12}
															height={12}
															viewBox="0 0 12 12"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M10 3L4.5 8.5L2 6"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
														<h2 className="text-sm font-normal">
															hasnainaskari32@gmail.com
														</h2>
													</div>
												</td>
												<td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
													<h2 className="text-sm font-normal">Karachi</h2>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between mt-6">
						<a
							href="#"
							className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-5 h-5 rtl:-scale-x-100"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
								/>
							</svg>
							<span>previous</span>
						</a>
						<div className="items-center hidden md:flex gap-x-3">
							<a
								href="#"
								className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60"
							>
								1
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								2
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								3
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								...
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								12
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								13
							</a>
							<a
								href="#"
								className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
							>
								14
							</a>
						</div>
						<a
							href="#"
							className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
						>
							<span>Next</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-5 h-5 rtl:-scale-x-100"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
								/>
							</svg>
						</a>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
