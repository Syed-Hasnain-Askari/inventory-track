"use client";
import React, { useEffect } from "react";
import ManufactureCard from "./ManufactureCard";
import { deleteManufacture } from "@/redux/feature/reducer/manufactureReducer";
import { useDispatch, useSelector } from "react-redux";
import { setManufacture } from "@/redux/feature/slice/manufactureSlice";
import Spinner from "../Spinner";

export const Manufacture = ({ data }) => {
	const dispatch = useDispatch();
	const { manufactures, isLoading } = useSelector((state) => state.manufacture);
	const handleDeleteManufacture = (id) => {
		try {
			dispatch(deleteManufacture(id));
			toast({
				title: "Success!",
				description: "Manufacture deleted successfully!"
			});
		} catch (error) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request."
			});
		}
	};
	useEffect(() => {
		if (data) {
			dispatch(setManufacture(data));
		}
	}, [dispatch, data]);
	console.log(isLoading, "isLoading");
	return (
		<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
			{isLoading ? (
				<div className="col-span-3 h-96">
					<div className="flex items-center justify-center h-full">
						<Spinner />
					</div>
				</div>
			) : (
				manufactures?.map((item) => {
					return (
						<ManufactureCard
							id={item?._id}
							name={item?.name}
							email={item?.email}
							image={item?.image}
							location={item?.location}
							contactName={item?.contactName}
							phoneNumber={item?.phoneNumber}
							handleDeleteManufacture={handleDeleteManufacture}
						/>
					);
				})
			)}
			{manufactures?.length === 0 && (
				<div className="col-span-3 h-96">
					<div className="flex items-center justify-center h-full">
						<p className="text-center text-gray-500 font-semibold">
							No results found, try adjusting your search and filters.
						</p>
					</div>
				</div>
			)}
		</section>
	);
};
