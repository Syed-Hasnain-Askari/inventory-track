"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import { getInventoryProducts } from "../../redux/feature/reducer/inventryReducer";
import { getCategories } from "../../redux/feature/reducer/categoryReducer";
import { useDispatch, useSelector } from "react-redux";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "../../components/ui/card";
import { Filter, Search, X, Tag, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export const Sider = () => {
	const dispatch = useDispatch();
	const { categories } = useSelector((state) => state.category);

	const [filters, setFilters] = useState({ category: "" });
	const [isFilterActive, setIsFilterActive] = useState(false);

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	const applyFilters = useCallback(
		(newFilters) => {
			const hasActiveFilters = !!newFilters.category;
			setIsFilterActive(hasActiveFilters);

			if (hasActiveFilters) {
				dispatch(getInventoryProducts(newFilters));
			} else {
				dispatch(getInventoryProducts({}));
			}
		},
		[dispatch]
	);

	const handleCategoryChange = useCallback(
		(value) => {
			const newFilters = {
				...filters,
				category: value === "all" ? "" : value
			};
			setFilters(newFilters);
			applyFilters(newFilters);
		},
		[filters, applyFilters]
	);

	const clearAllFilters = useCallback(() => {
		const emptyFilters = { category: "" };
		setFilters(emptyFilters);
		setIsFilterActive(false);
		dispatch(getInventoryProducts({}));
	}, [dispatch]);

	const getCategoryItems = () => {
		if (!categories?.result?.length) return null;
		return categories.result
			.filter((category) => category?._id)
			.map((category) => ({
				id: String(category._id),
				name: String(category.name || "Unnamed Category")
			}));
	};

	const categoryItems = getCategoryItems();

	return (
		<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
			<CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
				<CardTitle className="flex items-center justify-between text-base font-semibold">
					<div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
						<Filter className="h-4 w-4 text-indigo-600" />
						Filters
					</div>
					{isFilterActive && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearAllFilters}
							className="h-7 px-2 text-[10px] uppercase tracking-wider font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
						>
							Clear
						</Button>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-6 space-y-6">
				{/* Category Selector */}
				<div className="space-y-2.5">
					<Label
						htmlFor="category-select"
						className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2"
					>
						<Tag className="h-3.5 w-3.5" />
						Category
					</Label>
					<Select
						value={filters.category || "all"}
						onValueChange={handleCategoryChange}
					>
						<SelectTrigger
							id="category-select"
							className="h-10 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
						>
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categoryItems?.map((item) => (
								<SelectItem key={item.id} value={item.id}>
									{item.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Quick Actions */}
				<div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
					<h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
						<Search className="h-3.5 w-3.5" />
						Quick Actions
					</h3>

					<Button
						variant="outline"
						size="sm"
						onClick={clearAllFilters}
						disabled={!isFilterActive}
						className="w-full justify-start gap-2 h-9 text-sm font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
					>
						<RotateCcw className={`h-3.5 w-3.5 ${isFilterActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
						Reset All Filters
					</Button>
				</div>

				{/* Active Filters Summary */}
				{isFilterActive && (
					<div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
						<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Active Filters</p>
						<div className="flex flex-wrap gap-1.5">
							{filters.category && (
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium border border-indigo-100 dark:border-indigo-800">
									{categoryItems?.find((c) => c.id === filters.category)?.name}
									<X className="h-2.5 w-2.5 cursor-pointer hover:text-indigo-800" onClick={() => handleCategoryChange("all")} />
								</span>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
