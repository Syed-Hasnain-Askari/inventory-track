"use client";

import React, { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select";
import { getInventoryProducts } from "../../redux/feature/reducer/inventryReducer";
import { getCategories } from "../../redux/feature/reducer/categoryReducer";
import { useDispatch, useSelector } from "react-redux";
import { getManufacture } from "../..//redux/feature/reducer/manufactureReducer";
export const Sider = () => {
	const dispatch = useDispatch();

	const [isManufactureOpen, setIsManufactureOpen] = useState(false);
	const { categories } = useSelector((state) => state.category);
	const { manufactureList } = useSelector((state) => state.manufacture);
	const [option, setOption] = useState({ manufacture: "", category: "" });
	useEffect(() => {
		Promise.all([dispatch(getCategories(), dispatch(getManufacture()))]);
	}, [dispatch]);
	console.log(option, "option==");
	const handleManufactureChange = (e) => {
		const newOption = { ...option, manufacture: e };
		setOption(newOption);
		// Dispatch only if manufacture is selected and category is set
		if (
			newOption.manufacture ||
			(newOption.manufacture && newOption.category)
		) {
			dispatch(getInventoryProducts(newOption));
		}
	};
	const handleCategoryChange = (e) => {
		const newOption = { ...option, category: e };
		setOption(newOption);

		// Dispatch only if category is selected and manufacture is set
		if (newOption.category || (newOption.category && newOption.manufacture)) {
			dispatch(getInventoryProducts(newOption));
		}
	};
	return (
		<React.Fragment>
			<div className="lg:col-span-3 col-span-12 w-full sm:w-auto">
				{/* Manufacture Selector */}
				<div>
					<label className="font-semibold text-sm">Manufacture</label>
					<Select
						onValueChange={handleManufactureChange}
						onOpenChange={(open) => setIsManufactureOpen(open)} // Track open state
					>
						<SelectTrigger className="w-full sm:w-[200px] mt-3">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							{manufactureList?.map((item) => (
								<SelectItem key={item?._id} value={item?._id}>
									{item?.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Category Selector */}
				<div className={`mt-10 ${isManufactureOpen ? "mt-40" : ""}`}>
					{" "}
					{/* Adjust margin based on open state */}
					<label className="font-semibold text-sm">Category</label>
					<Select onValueChange={handleCategoryChange}>
						<SelectTrigger className="w-full sm:w-[200px] mt-3">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							{categories?.result?.map((category) => (
								<SelectItem key={category._id} value={category._id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</React.Fragment>
	);
};
