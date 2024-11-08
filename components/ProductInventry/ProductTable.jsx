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

export function ProductsTable({ data }) {
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
				{inventryProducts?.map((product) => (
					<Product key={product._id} product={product} />
				))}
			</TableBody>
		</Table>
	);
}
