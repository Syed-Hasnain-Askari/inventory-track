"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import ImageUploader from "../../components/imageuploader/index";
import { useToast } from "../../components//ui/use-toast";
import { getCategories } from "../../lib//methods";
import { getManufacture } from "../../redux/feature/reducer/manufactureReducer";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/feature/reducer/inventryReducer";
export default function page() {
	const dispatch = useDispatch();
	const inputRef = useRef(null);
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
		stock: "",
		image: image
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
			dispatch(addProduct(userInput));
			// Reset form input fields
			// setUserInput({
			// 	name: "",
			// 	description: "",
			// 	price: "",
			// 	category: "",
			// 	image: "",
			// 	stock: ""
			// });
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
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
		const file = event.target.files[0]; // Get the first selected file
		const reader = new FileReader(); // Create a new FileReader

		// When the file is successfully read
		reader.onload = () => {
			const base64String = reader.result.split(",")[1]; // Get the base64 string without the prefix

			// Set the base64 string to state
			setUserInput((prev) => ({
				...prev,
				image: base64String // Save the base64 string in user input state
			}));

			// Optional: You can store the file in its original form as well
			setImage(file); // Store the file if you need it in other parts of your app
		};

		// Read the file as DataURL (which encodes it in base64)
		if (file) {
			reader.readAsDataURL(file);
		}
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
		inputRef.current.focus();
	}, [dispatch]);
	console.log(userInput, "userInput");
	return (
		<>
			<Header name={"Add Product"} />
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
							ref={inputRef}
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
							value={userInput.description}
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
						<ImageUploader handleFileUpload={handleFileUpload} image={image} />
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
										<SelectItem value={category?._id}>
											{category.name}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
					<div className="mb-3">
						<label htmlFor="guest" className="mb-3 block text-base font-medium">
							Manufacture
						</label>
						<Select
							className="relative z-10"
							onValueChange={(e) => {
								handleSelectChange("manufacture", e);
							}}
						>
							<SelectTrigger className="w-full h-[50px] mt-3">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent className="absolute z-50">
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
					<div>
						<button
							onClick={() => {
								handleSubmit();
							}}
							className="text-white bg-[#4F46E5] hover:bg-[#433BCB] rounded-lg text-sm px-4 lg:px-5 py-3 lg:py-3.5 focus:outline-none font-extrabold w-full mt-3 shade mb-3 flex items-center justify-center"
						>
							{loading ? (
								<>
									<svg
										class="mr-3 h-5 w-5 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span class="font-medium"> Loading... </span>
								</>
							) : (
								<p>Submit</p>
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
