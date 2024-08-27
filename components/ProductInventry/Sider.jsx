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
				<div>
					<lable className="font-semibold text-sm">Manufacture</lable>
					<Select onValueChange={handleManufactureChange}>
						<SelectTrigger className="w-full sm:w-[200px] mt-3">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							{manufactureList?.map((item) => {
								return <SelectItem value={item?.name}>{item?.name}</SelectItem>;
							})}
						</SelectContent>
					</Select>
				</div>
				<div className="mt-10">
					<lable className="font-semibold text-sm">Category</lable>
					<Select onValueChange={handleCategoryChange}>
						<SelectTrigger className="w-full sm:w-[200px] mt-3">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							{categories?.result?.map((category) => {
								return (
									<SelectItem value={category.name}>{category.name}</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
		</React.Fragment>
	);
};
