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
	const { inventryProducts } = useSelector((state) => state.inventry);
	console.log(inventryProducts, "inventryProducts====");
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
		<>
			{isLoading ? (
				<div className="col-span-12 h-96">
					<div className="flex items-center justify-center h-full">
						<Spinner />
					</div>
				</div>
			) : (
				<>
					{/* Adjusting the grid inside the Manufacture component */}
					<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{manufactures?.map((item) => (
							<ManufactureCard
								key={item?._id}
								id={item?._id}
								name={item?.name}
								email={item?.email}
								image={item?.image}
								location={item?.location}
								contactName={item?.contactName}
								phoneNumber={item?.phoneNumber}
								handleDeleteManufacture={handleDeleteManufacture}
							/>
						))}
					</div>
				</>
			)}
			{manufactures?.length === 0 && !isLoading && (
				<div className="flex items-center justify-center h-96">
					<p className="text-center text-gray-500 font-semibold">
						No results found, try adjusting your search and filters.
					</p>
				</div>
			)}
		</>
	);
};
