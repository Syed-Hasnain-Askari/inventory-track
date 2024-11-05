"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { getInventoryProducts } from "../../redux/feature/reducer/inventryReducer";
import { Bell, Search } from "lucide-react";
export const Header = () => {
	const dispatch = useDispatch();
	const handleSearchChange = useDebouncedCallback((value) => {
		const search = value;
		dispatch(getInventoryProducts({ search }));
	}, 2000);
	return (
		<React.Fragment>
			<div className="flex sm:flex-col lg:flex-row justify-between items-center">
				<h1 className="xl:text-center md:text-center max-w-lg text-xl font-bold text-gray-800 xl:text-2xl">
					Product Inventory
				</h1>
				<div className="relative">
					<input
						id="table-search"
						type="search"
						placeholder="Start type to search groups & products"
						className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
						onChange={(e) => {
							handleSearchChange(e.target.value);
						}}
					/>

					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-non">
						<Search className="text-gray-500" size={20} />
					</div>
				</div>
				{/* <Link
					href={"/addproduct"}
					className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full sm:w-auto mt-4 sm:mt-0"
				>
					Add Product
				</Link> */}
			</div>
		</React.Fragment>
	);
};
