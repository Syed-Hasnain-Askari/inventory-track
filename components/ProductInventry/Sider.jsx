"use client";

import React, { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	getInvetryProductsByCategory,
	getInvetryProductsByManufacture
} from "../../redux/feature/reducer/inventryReducer";
import { getCategories } from "../../redux/feature/reducer/categoryReducer";
import { useDispatch, useSelector } from "react-redux";
import { getManufacture } from "../..//redux/feature/reducer/manufactureReducer";
export const Sider = () => {
	const dispatch = useDispatch();
	const { categories } = useSelector((state) => state.category);
	const { manufactureList } = useSelector((state) => state.manufacture);
	useEffect(() => {
		Promise.all([dispatch(getCategories(), dispatch(getManufacture()))]);
	}, [dispatch]);
	return (
		<React.Fragment>
			<div className="lg:col-span-3 col-span-12 px-10 w-full sm:w-auto">
				<div>
					<lable className="font-semibold text-sm">Manufacture</lable>
					<Select
						onValueChange={(e) => {
							dispatch(getInvetryProductsByManufacture(e));
						}}
					>
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
					<Select
						onValueChange={(e) => {
							dispatch(getInvetryProductsByCategory(e));
						}}
					>
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
