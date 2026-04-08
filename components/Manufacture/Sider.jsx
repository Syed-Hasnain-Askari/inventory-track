"use client";
import React, { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
	getManufacture,
	deleteManufacture,
	getManufactureByName
} from "../../redux/feature/reducer/manufactureReducer";
import { Label } from "@radix-ui/react-dropdown-menu";
export const Sider = () => {
	const { manufactureList, isLoading, isSuccess } = useSelector(
		(state) => state.manufacture
	);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getManufacture());
	}, []);
	return (
		<div className="grid grid-cols-12">
			<div className="lg:col-span-3 col-span-12 w-full sm:w-auto">
				<div>
					<Label className="font-semibold text-sm">Manufacture</Label>
					<Select
						onValueChange={(e) => {
							dispatch(getManufactureByName(e));
						}}
					>
						<SelectTrigger className="w-full sm:w-[200px] mt-3">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							{manufactureList?.map((item, index) => {
								return (
									<SelectItem key={item.id} value={item?.name}>
										{item?.name}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};
