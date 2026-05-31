"use client";

import React, { useState, useEffect } from "react";
import {
	Plus,
	LayoutGrid,
	List,
	Search,
	MoreHorizontal,
	Edit,
	Trash2,
	CheckCircle2,
	XCircle,
	Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { deleteCategory } from "../../app/actions/categoryActions";
import { useToast } from "@/components/ui/use-toast";
import CategoryForm from "./CategoryForm";

export default function CategoryList({ categories: initialCategories }) {
	const [categories, setCategories] = useState(initialCategories || []);
	const [viewMode, setViewMode] = useState("table");
	const [searchTerm, setSearchTerm] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const { toast } = useToast();

	const filteredCategories = categories.filter(
		(cat) =>
			cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddClick = () => {
		setEditingCategory(null);
		setIsFormOpen(true);
	};

	const handleEditClick = (category) => {
		setEditingCategory(category);
		setIsFormOpen(true);
	};

	const handleFormSuccess = (updatedCategory) => {
		if (editingCategory) {
			setCategories(
				categories.map((c) =>
					c._id === updatedCategory._id ? updatedCategory : c
				)
			);
		} else {
			setCategories([updatedCategory, ...categories]);
		}
	};

	const handleDelete = async (id) => {
		if (confirm("Are you sure you want to delete this category?")) {
			const result = await deleteCategory(id);
			if (result.success) {
				setCategories(categories.filter((c) => c._id !== id));
				toast({
					title: "Success",
					variant: "success",
					description: "Category deleted successfully"
				});
			} else {
				toast({
					title: "Error",
					variant: "destructive",
					description: result.message
				});
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Categories
					</h1>
					<p className="text-sm text-zinc-500">
						Manage your product categories and organization.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
						onClick={handleAddClick}
					>
						<Plus className="h-4 w-4" />
						Add Category
					</Button>
				</div>
			</div>

			{/* Filters Bar */}
			<Card className="border-zinc-200 dark:border-zinc-800">
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<div className="relative w-full md:w-96">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
							<Input
								placeholder="Search categories..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
								<Button
									variant={viewMode === "table" ? "white" : "ghost"}
									size="sm"
									className={`px-2 h-8 ${viewMode === "table" ? "bg-white dark:bg-zinc-700 shadow-sm" : ""}`}
									onClick={() => setViewMode("table")}
								>
									<List className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "grid" ? "white" : "ghost"}
									size="sm"
									className={`px-2 h-8 ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm" : ""}`}
									onClick={() => setViewMode("grid")}
								>
									<LayoutGrid className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Content */}
			{viewMode === "table" ? (
				<Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader className="bg-zinc-50 dark:bg-zinc-900">
								<TableRow>
									<TableHead className="pl-6">Category Name</TableHead>
									<TableHead>Slug</TableHead>
									<TableHead>Description</TableHead>
									<TableHead className="text-center">Status</TableHead>
									<TableHead className="text-right pr-6">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCategories.length > 0 ? (
									filteredCategories.map((cat) => (
										<TableRow
											key={cat._id}
											className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
										>
											<TableCell className="pl-6 font-medium text-zinc-900 dark:text-zinc-100">
												{cat.name}
											</TableCell>
											<TableCell className="text-zinc-500 font-mono text-xs">
												{cat.slug}
											</TableCell>
											<TableCell className="text-zinc-500 max-w-xs truncate">
												{cat.description || "-"}
											</TableCell>
											<TableCell className="text-center">
												{cat.isActive ? (
													<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
														<CheckCircle2 className="h-3 w-3" />
														Active
													</span>
												) : (
													<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
														<XCircle className="h-3 w-3" />
														Inactive
													</span>
												)}
											</TableCell>
											<TableCell className="text-right pr-6">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-40 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
													>
														<DropdownMenuLabel className="text-xs">
															Actions
														</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="cursor-pointer gap-2"
															onClick={() => handleEditClick(cat)}
														>
															<Edit className="h-4 w-4 text-zinc-400" />
															Edit Category
														</DropdownMenuItem>
														<DropdownMenuItem
															className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
															onClick={() => handleDelete(cat._id)}
														>
															<Trash2 className="h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-32 text-center text-zinc-500"
										>
											No categories found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</Card>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredCategories.map((cat) => (
						<Card
							key={cat._id}
							className="border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all group overflow-hidden bg-white dark:bg-zinc-950"
						>
							<div className="h-32 bg-gradient-to-br from-indigo-50/50 to-white dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800">
								<div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-indigo-600 font-bold text-xl border border-zinc-100 dark:border-zinc-700">
									{cat.name.charAt(0)}
								</div>
							</div>
							<CardHeader className="p-4 pb-2">
								<div className="flex items-start justify-between">
									<CardTitle className="text-lg font-bold">
										{cat.name}
									</CardTitle>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-40 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
										>
											<DropdownMenuItem
												className="cursor-pointer gap-2"
												onClick={() => handleEditClick(cat)}
											>
												<Edit className="h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
												onClick={() => handleDelete(cat._id)}
											>
												<Trash2 className="h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<CardDescription className="text-xs font-mono text-zinc-400">
									{cat.slug}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<p className="text-sm text-zinc-500 line-clamp-2 min-h-[2.5rem] mb-4">
									{cat.description || "No description provided."}
								</p>
								<div className="flex items-center justify-between mt-auto">
									<span
										className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cat.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"}`}
									>
										{cat.isActive ? "Active" : "Inactive"}
									</span>
									<span className="text-[10px] text-zinc-400">
										{new Date(cat.createdAt).toLocaleDateString()}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Category Form Modal */}
			{isFormOpen && (
				<CategoryForm
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
					category={editingCategory}
					onSuccess={handleFormSuccess}
				/>
			)}
		</div>
	);
}
