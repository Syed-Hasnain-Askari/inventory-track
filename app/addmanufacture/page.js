"use client";
import React, { useState, useEffect } from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import { useToast } from "@/components/ui/use-toast";
import Label from "../components/Label";
import { addManufacture } from "@/redux/feature/reducer/manufactureReducer";
import { useDispatch, useSelector } from "react-redux";
export default function AddManufacturePage() {
	const { isSuccess } = useSelector((state) => state.manufacture);
	const { toast } = useToast();
	const dispatch = useDispatch();
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
	const handleSubmit = (e) => {
		try {
			dispatch(addManufacture(userInput));
		} catch (error) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request."
			});
		}
	};
	useEffect(() => {
		if (isSuccess) {
			toast({
				title: "Success!",
				description: "Manufacture added successfully!"
			});
		}
	}, [isSuccess]);
	return (
		<RootLayout>
			<Header />
			<div className="flex items-center justify-center p-12">
				<div className="mx-auto w-full max-w-[550px]">
					<div className="mb-3">
						<Label text={"Name"} />
						<input
							type="text"
							name="name"
							onChange={(e) => handleChange("name", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Image"} />
						<input
							type="text"
							name="image"
							onChange={(e) => handleChange("image", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Location"} />
						<input
							type="text"
							name="location"
							onChange={(e) => handleChange("location", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Contact Name"} />
						<input
							type="text"
							name="contactName"
							onChange={(e) => handleChange("contactName", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Email"} />
						<input
							type="email"
							name="email"
							onChange={(e) => handleChange("email", e)}
							className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
						/>
					</div>
					<div className="mb-3">
						<Label text={"Phone Number"} />
						<input
							type="text"
							name="phoneNumber"
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
		</RootLayout>
	);
}
