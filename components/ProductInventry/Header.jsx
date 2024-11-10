"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { File, PlusCircle } from "lucide-react";
import { getManufacture } from "../../redux/feature/reducer/manufactureReducer";
import { getCategories } from "../../lib//methods";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import ImageUploader from "../imageuploader";
import { addProductAction } from "../../lib/actions/addProduct";
export const Header = () => {
	const dispatch = useDispatch();
	const { manufactures } = useSelector((state) => state.manufacture);
	const [categories, setCategories] = useState(null);
	const [image, setImage] = useState("");
	const [userInput, setUserInput] = useState({
		name: "",
		price: "",
		category: "",
		manufacture: "",
		stock: "",
		image: image
	});
	const INITIAL_STATE = {
		data: null
	};
	const [formState, formAction, pending] = React.useActionState(
		addProductAction,
		INITIAL_STATE
	);
	console.log(formState, "formState=====");
	const handleSelectChange = (key, e) => {
		setUserInput({
			...userInput,
			[key]: e
		});
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
	}, [dispatch]);
	return (
		<React.Fragment>
			<div className="flex sm:flex-col lg:flex-row justify-between items-center">
				{/* <h1 className="xl:text-center md:text-center max-w-lg text-xl font-bold text-gray-800 xl:text-2xl">
					Product Inventory
				</h1> */}
				<div className="ml-auto flex items-center gap-2">
					<Button size="sm" variant="outline" className="h-8 gap-1 bg-black">
						<File className="h-3.5 w-3.5 text-white" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
							Export
						</span>
					</Button>
					<Button size="sm" className="h-8 gap-1">
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1 bg-black"
									>
										<PlusCircle className="h-3.5 w-3.5 text-white" />
										<span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
											Add Product
										</span>
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px] w-[425px] h-[425px] rounded-lg shadow-lg bg-white overflow-y-auto">
									<DialogHeader>
										<DialogTitle>Add Product</DialogTitle>
									</DialogHeader>

									<form action={formAction} method="POST">
										<div>
											<label className="block text-sm font-medium leading-6 text-gray-900">
												Name
											</label>
											<input
												id="name"
												type="text"
												name="name"
												className="pl-3 py-2 w-full border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
											/>
											{formState?.errors?.name && (
												<p className="text-sm text-red-500">
													{formState.errors.name}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="price"
												className="block text-sm font-medium leading-6 text-gray-900"
											>
												Price
											</label>
											<input
												id="price"
												type="number"
												name="price"
												className="pl-3 py-2 w-full border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
											/>
											{formState?.errors?.price && (
												<p className="text-sm text-red-500">
													{formState.errors.price}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor="stock"
												className="block text-sm font-medium leading-6 text-gray-900"
											>
												Stock
											</label>
											<input
												id="stock"
												type="number"
												name="stock"
												className="pl-3 py-2 w-full border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
											/>
											{formState?.errors?.stock && (
												<p className="text-sm text-red-500">
													{formState.errors.stock}
												</p>
											)}
										</div>

										<div className="mb-3">
											<label
												htmlFor="image"
												className="mb-3 block text-base font-medium text-[#07074D]"
											>
												Image
											</label>
											<ImageUploader
												handleFileUpload={handleFileUpload}
												image={image}
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
												name="category"
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
											<label
												htmlFor="guest"
												className="mb-3 block text-base font-medium"
											>
												Manufacture
											</label>
											<Select
												name="manufacture"
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
														return (
															<SelectItem value={item._id}>
																{item.name}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</div>

										<DialogFooter>
											<button
												type="submit"
												disabled={pending}
												className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
											>
												{pending ? (
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
													"Submit"
												)}
											</button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</span>
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};
