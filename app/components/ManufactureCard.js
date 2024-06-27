import { Nanum_Myeongjo } from "next/font/google";
import Image from "next/image";
import React from "react";

export default function ManufactureCard({
	key,
	name,
	email,
	phoneNumber,
	contactName,
	location,
	image
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
				<h2 className="mb-1 text-lg font-medium dark:text-white text-gray-900">
					{name}
				</h2>
				<p className="mb-2 text-sm dark:text-gray-300 text-gray-700">
					{location}
				</p>
				<p className="mb-2 text-base dark:text-gray-300 text-gray-700">
					{email}
				</p>
				<p className="mb-2 text-base dark:text-gray-300 text-gray-700">
					{contactName}
				</p>
				<p className="mb-2 text-base dark:text-gray-300 text-gray-700">
					{phoneNumber}
				</p>
			</div>
		</div>
	);
}
