"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FileDown, Plus, Package, Upload, Loader2 } from "lucide-react";
import { getCategories } from "../../app/actions/categoryActions";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "../ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import { createProduct } from "../../app/actions/productActions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import GridListToggle from "../GridListToggle";

export const Header = () => {
	const { toast } = useToast();
	const [categories, setCategories] = useState([]);
	const [image, setImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock: "",
		category: "",
		description: ""
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const catRes = await getCategories();
				setCategories(catRes?.result || []);
			} catch (error) {
				console.error("Error fetching form data:", error);
			}
		};
		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Basic validation
			if (
				!formData.name ||
				!formData.price ||
				!formData.stock ||
				!formData.category
			) {
				toast({
					title: "Validation Error",
					variant: "destructive",
					description: "Please fill in all required fields."
				});
				setLoading(false);
				return;
			}

			const payload = new FormData();
			payload.append("name", formData.name);
			payload.append("price", formData.price);
			payload.append("stock", formData.stock);
			payload.append("category", formData.category);
			payload.append("description", formData.description);
			if (image) {
				payload.append("image", image);
			}

			// Call API directly to bypass Server Action 1MB limit
			const response = await fetch("/api/products", {
				method: "POST",
				body: payload
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "Success",
					variant: "success",
					description: "Product has been created successfully!"
				});
				setIsOpen(false);
				setFormData({
					name: "",
					price: "",
					stock: "",
					category: "",
					description: ""
				});
				setImage(null);
				setPreviewUrl("");
			} else {
				toast({
					title: "Error",
					variant: "destructive",
					description: result.message || "Failed to create product."
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				variant: "destructive",
				description: "An unexpected error occurred."
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					Inventory Management
				</h1>
				<p className="text-sm text-zinc-500 dark:text-zinc-400">
					Manage your product catalog, stock levels, and pricing.
				</p>
			</div>

			<div className="flex items-center gap-3">
				<GridListToggle />
				<Button
					variant="outline"
					size="sm"
					className="h-9 gap-2 shadow-sm border-zinc-200 dark:border-zinc-800"
				>
					<FileDown className="h-4 w-4" />
					<span>Export</span>
				</Button>

				<Button
					size="sm"
					className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
					onClick={() => setIsOpen(true)}
				>
					<Plus className="h-4 w-4" />
					<span>Add Product</span>
				</Button>

				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl">
						<DialogHeader className="px-6 pt-6 pb-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
							<DialogTitle className="text-xl font-semibold flex items-center gap-2">
								<Package className="h-5 w-5 text-indigo-600" />
								Add New Product
							</DialogTitle>
							<DialogDescription className="text-zinc-500 dark:text-zinc-400">
								Fill in the details below to add a new product to your
								inventory.
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 space-y-1.5">
									<Label htmlFor="name" className="text-sm font-medium">
										Product Name
									</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										placeholder="e.g. Premium Wireless Headphones"
										required
									/>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="price" className="text-sm font-medium">
										Price ($)
									</Label>
									<Input
										id="price"
										name="price"
										type="number"
										step="0.01"
										value={formData.price}
										onChange={handleInputChange}
										placeholder="0.00"
										required
									/>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="stock" className="text-sm font-medium">
										Stock Level
									</Label>
									<Input
										id="stock"
										name="stock"
										type="number"
										value={formData.stock}
										onChange={handleInputChange}
										placeholder="0"
										required
									/>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="category" className="text-sm font-medium">
										Category
									</Label>
									<Select
										value={formData.category}
										onValueChange={(v) => handleSelectChange("category", v)}
									>
										<SelectTrigger id="category">
											<SelectValue placeholder="Select Category" />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem value={category._id} key={category._id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="description" className="text-sm font-medium">
									Description
								</Label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
									placeholder="Describe the product..."
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-sm font-medium">Product Image</Label>
								<div className="flex items-center gap-4 p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
									{previewUrl ? (
										<div className="relative h-20 w-20 rounded-md overflow-hidden border border-zinc-200">
											<Image
												src={previewUrl}
												alt="Preview"
												fill
												className="object-cover"
												unoptimized
											/>
											<button
												type="button"
												onClick={() => {
													setImage(null);
													setPreviewUrl("");
												}}
												className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									) : (
										<div className="h-20 w-20 rounded-md bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
											<Upload className="h-6 w-6 text-zinc-400" />
										</div>
									)}
									<div className="flex-1">
										<Input
											type="file"
											accept="image/*"
											onChange={handleFileUpload}
											className="cursor-pointer"
										/>
										<p className="text-[10px] text-zinc-500 mt-1">
											PNG, JPG, GIF up to 5MB
										</p>
									</div>
								</div>
							</div>

							<DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsOpen(false)}
									disabled={loading}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={loading}
									className="bg-indigo-600 hover:bg-indigo-700 text-white"
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
											Creating...
										</>
									) : (
										"Create Product"
									)}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

// Internal X icon helper
const X = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
);
