import { Nanum_Myeongjo } from "next/font/google";
import Image from "next/image";
import React from "react";

export default function ProductCard({
	key,
	name,
	description,
	image,
	price,
	category
}) {
	return (
		<div
			key={key}
			className="cursor-pointer shadow-xl mx-auto w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 duration-300 hover:scale-105 hover:shadow-lg"
		>
			<Image
				height={300}
				width={300}
				className="w-full object-cover object-center"
				src={image}
				alt="Product Image"
			/>
			<div className="p-4">
				<h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
					{name}
				</h2>
				<p className="mb-2 text-base dark:text-gray-300 text-gray-700">
					{category}
				</p>
				<div className="flex justify-between items-center">
					<p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
						${price}
					</p>

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
						<h2 className="text-sm font-normal">In Stock</h2>
					</div>
				</div>
			</div>
		</div>
	);
}
