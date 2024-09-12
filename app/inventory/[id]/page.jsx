import Footer from "../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";
async function fetchData(id) {
	const response = await fetch(`http://localhost:3000/api/products/${id}`, {
		cache: "force-cache" // This makes sure the fetch does not use any cache
	});
	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await response.json();
	return data.result;
}
export default async function ProductDetailPage({ params }) {
	const response = await fetchData(params.id);
	const { name, description, price, image, stock } = response;
	return (
		<div>
			<section className="text-gray-700 body-font overflow-hidden bg-white">
				<div className="container px-5 py-10 mx-auto">
					<div className="lg:w-4/5 mx-auto flex flex-wrap">
						<Image
							height={300}
							width={300}
							className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
							src={image}
							alt="Product Image"
						/>
						<div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
							<h2 className="text-sm title-font text-gray-500 tracking-widest">
								{name}
							</h2>
							<h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
								{description}
							</h1>
							<div className="flex mb-4">
								<span className="flex items-center">
									<span className="text-gray-600 text-sm title-font">
										{stock} stock available
									</span>
								</span>
							</div>
							<div className="flex">
								<span className="title-font font-medium text-2xl text-gray-900">
									${price}
								</span>
								<button className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">
									Button
								</button>
								<Link
									href={`/productinventory/edit/${params.id}`}
									className="focus:outline-none hover:bg-gray-300 rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"
								>
									<svg
										class="ml-1 w-10 h-6 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
