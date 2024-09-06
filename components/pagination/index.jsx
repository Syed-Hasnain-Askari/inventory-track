import React from "react";
export default function Pagination({ data }) {
	return (
		<div className="flex items-center justify-around mt-6">
			<button
				disabled={data?.pagination.prevPage === null ? true : false}
				className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 ${
					data?.pagination.prevPage === null
						? ""
						: "hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
				}`}
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
			</button>
			<div className="items-center hidden md:flex gap-x-3">
				{/* Loop over totalPages to generate pagination links */}
				{Array.from({ length: data?.pagination.totalPages }, (_, index) => (
					<button
						key={index}
						href={`?page=${index + 1}`}
						onC
						className={`px-3 py-2 w-8 text-sm rounded-lg ${
							index + 1 === data.pagination.currentPage
								? "bg-blue-500 text-white"
								: "text-blue-5 dark:bg-gray-800 bg-blue-100/60"
						}`}
					>
						{index + 1}
					</button>
				))}
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
	);
}
