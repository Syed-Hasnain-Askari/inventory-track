import React from "react";
import { Search as SearchIcon } from "lucide-react";
export default function Search({ handleSearchChange }) {
	return (
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
				<SearchIcon className="text-gray-500" size={20} />
			</div>
		</div>
	);
}
