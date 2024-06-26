"use client";
import React, { useEffect } from "react";
import RootLayout from "../layout";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
	getManufacture,
	deleteManufacture
} from "../../redux/feature/reducer/manufactureReducer";
import ManufactureCard from "../components/ManufactureCard";
import { useToast } from "@/components/ui/use-toast";
import { clearSuccess } from "@/redux/feature/slice/manufactureSlice";
import Spinner from "../components/Spinner";
export default function ManufacturePage() {
	const { toast } = useToast();
	const dispatch = useDispatch();
	const { manufactures, isLoading, isSuccess } = useSelector(
		(state) => state.manufacture
	);
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
		dispatch(getManufacture());
	}, []);
	useEffect(() => {
		if (isSuccess) {
			toast({
				title: "Success!",
				description: "Manufacture deleted successfully!"
			});
			clearSuccess();
		}
	}, [isSuccess]);
	console.log(manufactures, "manufactures");
	console.log(isSuccess, "isSuccess");
	return (
		<RootLayout>
			<Header />
			<section className="max-w-screen-xl max-h-screen mx-auto mt-10">
				<div className="flex justify-between items-center">
					<h1 className="xl:text-center md:text-center max-w-lg text-xl font-bold text-gray-800 xl:text-2xl">
						Manufactures
					</h1>
					<div className="relative w-full sm:w-auto">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								></path>
							</svg>
						</div>
						<input
							type="text"
							id="table-search"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-none block w-full sm:w-96 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
							placeholder="Search for items"
						/>
					</div>
					<div>
						<Link
							href={"/addmanufacture"}
							className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full sm:w-auto mt-4 sm:mt-0"
						>
							Add Manufacture
						</Link>
					</div>
				</div>
				<hr className="mt-5 justify-center" />
				<div className="grid grid-cols-12 gap-4 mt-10 h-1/2">
					<div className="lg:col-span-3 col-span-12 px-10 w-full sm:w-auto">
						<div>
							<lable className="font-semibold text-sm">Manufacture</lable>
							<Select>
								<SelectTrigger className="w-full sm:w-[200px] mt-3">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Accessories</SelectItem>
									<SelectItem value="light">Accessories</SelectItem>
									<SelectItem value="dark">Desktop-PC</SelectItem>
									<SelectItem value="system">Head Phone</SelectItem>
									<SelectItem value="system">Laptop</SelectItem>
									<SelectItem value="system">Keyboard</SelectItem>
									<SelectItem value="system">Mouse</SelectItem>
									<SelectItem value="system">Smartphone</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="col-span-9 px-10 lg:px-0">
						<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
							{isLoading ? (
								<Spinner />
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
						</section>
					</div>
				</div>
			</section>

			<Footer />
		</RootLayout>
	);
}
