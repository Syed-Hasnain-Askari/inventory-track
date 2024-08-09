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
import { useToast } from "@/components/ui/use-toast";
import { getCategories } from "@/lib/methods";
import { getManufacture } from "@/redux/feature/reducer/manufactureReducer";
import { useDispatch, useSelector } from "react-redux";
export default function page() {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { manufactures } = useSelector((state) => state.manufacture);
	const [categories, setCategories] = useState(null);
	const [userInput, setUserInput] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		manufacture: "",
		image:
			"https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		manufacturePrice: "",
		stock: ""
	});
	const handleChange = (key, e) => {
		setUserInput({
			...userInput,
			[key]: e.target.value
		});
	};
	const handleSelectChange = (key, e) => {
		setUserInput({
			...userInput,
			[key]: e
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
	const handleSubmit = async (e) => {
		const response = await fetch("/api/products/addproduct", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: userInput.name,
				description: userInput.description,
				price: Number(userInput.price),
				category: userInput.category,
				image: userInput.image,
				stock: Number(userInput.stock),
				manufacture: userInput.manufacture,
				manufacturePrice: Number(userInput.manufacturePrice)
			})
		});
		const result = await response.json();
		if (result) {
			toast({
				title: "Success!",
				description: "Product has been added successfully!"
			});
		}
		setUserInput({
			name: "",
			description: "",
			price: "",
			category: "",
			image: "",
			stock: "",
			manufacturePrice: ""
		});
		console.log(result);
	};
	useEffect(() => {
		dispatch(getManufacture());
	}, [dispatch]);
	console.log(userInput, "userInput");
	return (
		<RootLayout>
			<Header />
			<div className="flex items-center justify-center p-12">
				<div className="mx-auto w-full max-w-[550px]">
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
							value={userInput.name}
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
							Image
						</label>
						<input
							type="text"
							name="image"
							value={userInput.image}
							onChange={(e) => handleChange("image", e)}
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
							value={userInput.price}
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
						<Select
							onValueChange={(e) => {
								handleSelectChange("category", e);
							}}
						>
							<SelectTrigger className="w-full h-[50px] mt-3">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{categories?.result?.map((category) => {
									return (
										<SelectItem value={category._id}>
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
							Manufacture
						</label>
						<Select
							onValueChange={(e) => {
								handleSelectChange("manufacture", e);
							}}
						>
							<SelectTrigger className="w-full h-[50px] mt-3">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{manufactures?.map((item) => {
									return <SelectItem value={item._id}>{item.name}</SelectItem>;
								})}
							</SelectContent>
						</Select>
					</div>
					<div className="mb-3">
						<label
							htmlFor="guest"
							className="mb-3 block text-base font-medium text-[#07074D]"
						>
							Stock
						</label>
						<input
							type="number"
							name="stock"
							value={userInput.stock}
							onChange={(e) => handleChange("stock", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
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
							value={userInput.manufacturePrice}
							name="manufacturePrice"
							onChange={(e) => handleChange("manufacturePrice", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div>
						<button
							onClick={() => {
								handleSubmit();
							}}
							className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</RootLayout>
	);
}
