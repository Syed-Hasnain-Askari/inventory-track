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
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState("");
	const { manufactures } = useSelector((state) => state.manufacture);
	const [categories, setCategories] = useState(null);
	const [userInput, setUserInput] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		manufacture: "",
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
	const handleSubmit = async (e) => {
		setLoading(true);
		try {
			// Create a FormData object and append the image file
			const formData = new FormData();
			for (const file of image) {
				formData.append("file", file);
			}
			formData.append("upload_preset", "my-uploads");

			// Upload the image to Cloudinary
			const cloudinaryResponse = await fetch(
				"https://api.cloudinary.com/v1_1/hasnainaskari32/image/upload",
				{
					method: "POST",
					body: formData
				}
			);

			// Check if the Cloudinary upload was successful
			if (!cloudinaryResponse.ok) {
				throw new Error("Failed to upload image to Cloudinary");
			}

			const cloudinaryResult = await cloudinaryResponse.json();
			const imageUrl = cloudinaryResult.secure_url;

			// Send the product data to the backend with the Cloudinary image URL
			const productResponse = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					...userInput,
					image: imageUrl
				})
			});

			// Check if the product was successfully added
			if (!productResponse.ok) {
				throw new Error("Failed to add product");
			}

			const productResult = await productResponse.json();

			// Display success toast notification
			toast({
				title: "Success!",
				description: "Product has been added successfully!"
			});

			// Reset form input fields
			setUserInput({
				name: "",
				description: "",
				price: "",
				category: "",
				image: "",
				stock: "",
				manufacturePrice: ""
			});
		} catch (error) {
			console.error("Error:", error);
			// Display error toast notification
			toast({
				title: "Error!",
				description: error.message,
				status: "error"
			});
		} finally {
			setLoading(false);
		}
	};
	const handleFileUpload = (event) => {
		setImage(event.target.files);
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
	useEffect(() => {
		dispatch(getManufacture());
	}, [dispatch]);
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
						<div className="max-w-2xl mx-auto">
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="dropzone-file"
									className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg
											className="w-10 h-10 mb-3 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											/>
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Click to upload</span> or
											drag and drop
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											SVG, PNG, JPG or GIF (MAX. 800x400px)
										</p>
									</div>
									<input
										id="dropzone-file"
										type="file"
										className="hidden"
										name="file"
										onChange={handleFileUpload}
									/>
								</label>
							</div>
						</div>
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
							{loading ? "loading" : "Submit"}
						</button>
					</div>
				</div>
			</div>
		</RootLayout>
	);
}
