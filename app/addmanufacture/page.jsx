"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "../../components/ui/use-toast";
import Label from "../components/Label";
import { addManufacture } from "../../redux/feature/reducer/manufactureReducer";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccess } from "../../redux/feature/slice/manufactureSlice";
export default function AddManufacturePage() {
	const { isSuccess } = useSelector((state) => state.manufacture);
	const { toast } = useToast();
	const dispatch = useDispatch();
	const [image, setImage] = useState("");
	const [loading, setLoading] = useState("");
	const [userInput, setUserInput] = useState({
		name: "",
		image: "",
		location: "",
		contactName: "",
		email: "",
		phoneNumber: ""
	});
	const handleChange = (key, e) => {
		setUserInput({
			...userInput,
			[key]: e.target.value
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
				console.log(cloudinaryResponse, "cloudinaryResponse");

				throw new Error("Failed to upload image to Cloudinary");
			}
			const cloudinaryResult = await cloudinaryResponse.json();
			const imageUrl = cloudinaryResult?.secure_url;
			if (imageUrl != "") {
				let payload = {
					...userInput,
					image: imageUrl
				};
				dispatch(addManufacture(payload));
				setLoading(false);
				toast({
					title: "Success!",
					description: "Manufacture has been added successfully!"
				});
				setUserInput({
					name: "",
					image: "",
					location: "",
					contactName: "",
					phoneNumber: "",
					email: ""
				});
			}
		} catch (error) {
			setLoading(false);
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request."
			});
		} finally {
			setLoading(false);
		}
	};
	const handleFileUpload = (event) => {
		setImage(event.target.files);
	};
	useEffect(() => {
		if (isSuccess) {
			clearSuccess();
			toast({
				title: "Success!",
				description: "Manufacture added successfully!"
			});
			setUserInput({
				name: "",
				image: "",
				location: "",
				contactName: "",
				email: "",
				phoneNumber: ""
			});
		}
	}, [isSuccess]);

	return (
		<React.Fragment>
			<div className="flex items-center justify-center p-12">
				<div className="mx-auto w-full max-w-[550px]">
					<div className="mb-3">
						<Label text={"Name"} />
						<input
							type="text"
							name="name"
							value={userInput.name}
							onChange={(e) => handleChange("name", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Image"} />
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
											{image
												? image[0]?.name
												: "SVG, PNG, JPG or GIF (MAX. 800x400px)"}
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
						<Label text={"Location"} />
						<input
							type="text"
							name="location"
							value={userInput.location}
							onChange={(e) => handleChange("location", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Contact Name"} />
						<input
							type="text"
							name="contactName"
							value={userInput.contactName}
							onChange={(e) => handleChange("contactName", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Email"} />
						<input
							type="email"
							name="email"
							value={userInput.email}
							onChange={(e) => handleChange("email", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Phone Number"} />
						<input
							type="text"
							name="phoneNumber"
							value={userInput.phoneNumber}
							onChange={(e) => handleChange("phoneNumber", e)}
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
		</React.Fragment>
	);
}
