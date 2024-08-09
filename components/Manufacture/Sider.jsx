"use client";
import React, { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
	getManufacture,
	deleteManufacture,
	getManufactureByName
} from "../../redux/feature/reducer/manufactureReducer";
export const Sider = () => {
	const { manufactureList, isLoading, isSuccess } = useSelector(
		(state) => state.manufacture
	);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getManufacture());
	}, []);
	return (
		<React.Fragment>
			<div className="lg:col-span-3 col-span-12 w-full sm:w-auto">
				<div>
					<lable className="font-semibold text-sm">Manufacture</lable>
					<Select
						onValueChange={(e) => {
							dispatch(getManufactureByName(e));
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
			</div>
		</React.Fragment>
	);
};
