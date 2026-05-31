"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/feature/slice/inventrySlice";
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	Table
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/inventory/product";
import { useToast } from "@/components/ui/use-toast";
import { deleteProductById } from "@/redux/feature/reducer/inventryReducer";
import { SkeletonTable } from "@/components/ui/skeleton";
import { FilterEmptyState } from "@/components/ui/empty-state";
import { deleteProduct } from "@/app/actions/productActions";
import { RefreshCw, Package } from "lucide-react";

export function ProductsTable() {
	const { toast } = useToast();
	const dispatch = useDispatch();
	const { inventryProducts, isLoading, pagination } = useSelector(
		(state) => state.inventry
	);
	console.log(inventryProducts, "inventryProducts");
	const handleDeleteProduct = async (id) => {
		try {
			const result = await deleteProduct(id);
			if (result.success) {
				toast({
					title: "Success!",
					variant: "success",
					description: "Product deleted successfully!"
				});
				dispatch(deleteProductById(id));
			} else {
				toast({
					title: "Error!",
					variant: "destructive",
					description: result.message || "Failed to delete product."
				});
			}
		} catch (error) {
			toast({
				title: "Error!",
				description: "There was a problem deleting the product.",
				variant: "destructive"
			});
		}
	};

	if (isLoading) {
		return (
			<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-bold flex items-center gap-2">
						<Package className="h-5 w-5 text-indigo-600" />
						Product Catalog
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SkeletonTable rows={5} />
				</CardContent>
			</Card>
		);
	}

	if (inventryProducts?.length === 0) {
		return (
			<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
				<CardHeader className="pb-4 text-center">
					<CardTitle className="text-lg font-bold">Product Catalog</CardTitle>
					<CardDescription>
						No products found matching your current filters.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center py-12">
					<FilterEmptyState />
					<Button
						variant="outline"
						size="sm"
						className="mt-6 gap-2"
						onClick={() => (window.location.href = window.location.pathname)}
					>
						<RefreshCw className="h-4 w-4" />
						Clear All Filters
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
				<div>
					<CardTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
						<Package className="h-5 w-5 text-indigo-600" />
						Product Catalog
					</CardTitle>
					<CardDescription className="text-sm text-zinc-500 mt-1">
						Displaying {inventryProducts?.length} products in your inventory.
					</CardDescription>
				</div>
				<div className="mt-4 sm:mt-0">
					<Button
						variant="ghost"
						size="sm"
						className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 gap-2"
						onClick={() => {
							const params = new URLSearchParams(window.location.search);
							params.delete("search");
							params.delete("category");
							window.location.search = params.toString();
						}}
					>
						<RefreshCw className="h-3.5 w-3.5" />
						Reset View
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<Table className="w-full">
						<TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
							<TableRow className="hover:bg-transparent">
								<TableHead className="w-[80px] pl-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
									Image
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Product Name
								</TableHead>
								<TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									SKU
								</TableHead>
								<TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Category
								</TableHead>
								<TableHead className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Price
								</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Stock
								</TableHead>
								<TableHead className="hidden md:table-cell text-center text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Status
								</TableHead>
								<TableHead className="hidden lg:table-cell text-center text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">
									Last Updated
								</TableHead>
								<TableHead className="w-[100px] pr-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
							{inventryProducts?.map((product) => (
								<Product
									key={product._id}
									id={product._id}
									product={product}
									handleDeleteProduct={handleDeleteProduct}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between items-center py-4 px-6 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800">
				<p className="text-xs font-medium text-zinc-500">
					Showing{" "}
					<span className="text-zinc-900 dark:text-zinc-200">
						{inventryProducts?.length}
					</span>{" "}
					of{" "}
					<span className="text-zinc-900 dark:text-zinc-200">
						{pagination?.totalProducts || 0}
					</span>{" "}
					products
				</p>
			</CardFooter>
		</Card>
	);
}
