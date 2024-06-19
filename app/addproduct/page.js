"use client";
import React, { useState, useEffect } from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { getCategories } from "@/lib/methods";
export default function page() {
	const [categories, setCategories] = useState(null);
	const [userInput, setUserInput] = useState({
		name: "",
		description: "",
		price: "",
		type: "",
		manufacturePrice: ""
	});
	const handleChange = (key, e) => {
		setUserInput({
			...userInput,
			[key]: e.target.value
		});
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getCategories();
				setCategories(response);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchData();
	}, []);
	console.log(userInput);
	console.log(categories);
	return (
		<RootLayout>
			<Header />
			<div className="flex items-center justify-center p-12">
				<div className="mx-auto w-full max-w-[550px]">
					<form action="https://formbold.com/s/FORM_ID" method="POST">
						<div className="mb-3">
							<label
								htmlFor="guest"
								className="mb-3 block text-base font-medium text-[#07074D]"
							>
								Name
							</label>
							<input
								type="text"
								name="name"
								onChange={(e) => handleChange("name", e)}
								className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="guest"
								className="mb-3 block text-base font-medium text-[#07074D]"
							>
								Description
							</label>
							<textarea
								name="description"
								onChange={(e) => handleChange("description", e)}
								className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="guest"
								className="mb-3 block text-base font-medium text-[#07074D]"
							>
								Price
							</label>
							<input
								type="number"
								name="price"
								onChange={(e) => handleChange("price", e)}
								className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="guest"
								className="mb-3 block text-base font-medium text-[#07074D]"
							>
								Type
							</label>
							<Select>
								<SelectTrigger className="w-full h-[50px] mt-3">
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
						<div className="mb-3">
							<label
								htmlFor="guest"
								className="mb-3 block text-base font-medium text-[#07074D]"
							>
								Manufacture Price
							</label>
							<input
								type="number"
								name="manufacturePrice"
								onChange={(e) => handleChange("manufacturePrice", e)}
								className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
							/>
						</div>
						<div>
							<button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</RootLayout>
	);
}
