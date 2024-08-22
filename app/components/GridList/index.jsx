import * as React from "react";
import Image from "next/image";
import Link from "next/link";
export default function GridList({ name, id, image, price, description }) {
	return (
		<React.Fragment>
			<Link
				key={id}
				href={`/productinventory/${id}/`}
				className="bg-white mt-3"
			>
				<div className="flex h-32 mb-3 shadow-lg rounded-2xl">
					<Image
						className="mr-4 rounded-lg object-cover object-center"
						alt="Image placeholder"
						width={100}
						height={100}
						loading="lazy"
						src={image}
					/>
					<div className="flex flex-col justify-between py-2 w-full">
						<h2 className="text-lg font-medium text-gray-900 dark:text-white">
							{name}
						</h2>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{description}
						</p>
						<div className="flex justify-between items-center mr-2">
							<p className="text-lg font-semibold text-gray-900 dark:text-white">
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
			</Link>
		</React.Fragment>
	);
}
