"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/feature/slice/inventrySlice";
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	Table
} from "../ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";
import { useRouter } from "next/navigation";
import { Product } from "../../app/inventory/product";
import { useToast } from "../../components/ui/use-toast";
import { deleteProductById } from "../../redux/feature/reducer/inventryReducer";

export function ProductsTable({ data }) {
	const { toast } = useToast();
	const { categories } = useSelector((state) => state.category);
	const { manufactureList } = useSelector((state) => state.manufacture);

	const dispatch = useDispatch();
	const { inventryProducts, isLoading, isError } = useSelector(
		(state) => state.inventry
	);
	let router = useRouter();
	let productsPerPage = 5;

	function prevPage() {
		router.back();
	}

	function nextPage() {
		router.push(`/?offset=${offset}`, { scroll: false });
	}
	const handleDeleteProduct = (id) => {
		try {
			dispatch(deleteProductById(id));
			toast({
				title: "Success!",
				description: "Product deleted successfully!"
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
			dispatch(getProducts(data));
		}
	}, [dispatch, data]);
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="hidden w-[100px] sm:table-cell">
						<span className="sr-only">Image</span>
					</TableHead>
					<TableHead>Name</TableHead>
					<TableHead className="hidden md:table-cell">Price</TableHead>
					<TableHead className="hidden md:table-cell">Stock</TableHead>
					<TableHead className="hidden md:table-cell">Created at</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{inventryProducts?.length === 0 ? (
					// Show "No products found" when the list is empty
					<div className="flex justify-center items-center h-full">
						<p className="text-center text-gray-500 font-semibold">
							No products found
						</p>
					</div>
				) : (
					// Render products when there are items in the list
					inventryProducts?.map((product) => (
						<Product
							id={product._id}
							product={product}
							handleDeleteProduct={handleDeleteProduct}
						/>
					))
				)}
			</TableBody>
		</Table>
	);
}
