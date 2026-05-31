"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Package, Upload, Loader2, Save, ArrowLeft } from "lucide-react";
import { getCategories } from "../../app/actions/categoryActions";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../../components/ui/select";
import { updateProduct } from "../../app/actions/productActions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card";

export default function ProductEditForm({ product }) {
	console.log(product, "edit product");
	const router = useRouter();
	const { toast } = useToast();
	const [categories, setCategories] = useState([]);
	const [image, setImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(product?.images?.[0] || product?.image || "");
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: product?.name || "",
		price: product?.price || "",
		stock: product?.stock || "",
		category: product?.category?._id || product?.category || "",
		description: product?.description || "",
		sku: product?.sku || ""
	});

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name || "",
				price: product.price || "",
				stock: product.stock || "",
				category: product.category?._id || product.category || "",
				description: product.description || "",
				sku: product.sku || ""
			});
			setPreviewUrl(product.images?.[0] || product.image || "");
		}
	}, [product]);

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
		const fetchCategoriesData = async () => {
			try {
				const response = await getCategories();
				setCategories(response?.result || []);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategoriesData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const payload = new FormData();
			payload.append("name", formData.name);
			payload.append("price", formData.price);
			payload.append("stock", formData.stock);
			payload.append("category", formData.category);
			payload.append("description", formData.description);
			payload.append("sku", formData.sku);
			if (image) {
				payload.append("image", image);
			}

			// Call API directly to bypass Server Action 1MB limit
			const response = await fetch(`/api/products/${product._id}`, {
				method: "PATCH",
				body: payload
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "Success",
					variant: "success",
					description: "Product has been updated successfully!"
				});
				router.push("/inventory");
				router.refresh();
			} else {
				toast({
					title: "Error",
					variant: "destructive",
					description: result.message || "Failed to update product."
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
		<div className="max-w-4xl mx-auto py-8 px-4">
			<div className="mb-6">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/inventory" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Inventory
					</Link>
				</Button>
				<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
					Edit Product
				</h1>
				<p className="text-zinc-500">
					Update the information for "{product?.name}"
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<div className="md:col-span-2 space-y-6">
					<Card className="border-zinc-200 dark:border-zinc-800">
						<CardHeader>
							<CardTitle className="text-lg">Product Details</CardTitle>
							<CardDescription>
								Primary information about the product.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Product Name</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
									<Input
										id="sku"
										name="sku"
										value={formData.sku}
										onChange={handleInputChange}
										placeholder="e.g. PRD-12345"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="price">Price ($)</Label>
									<Input
										id="price"
										name="price"
										type="number"
										step="0.01"
										value={formData.price}
										onChange={handleInputChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={5}
									className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="border-zinc-200 dark:border-zinc-800">
						<CardHeader>
							<CardTitle className="text-lg">
								Inventory & Organization
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="stock">Current Stock</Label>
								<Input
									id="stock"
									name="stock"
									type="number"
									value={formData.stock}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
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
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card className="border-zinc-200 dark:border-zinc-800">
						<CardHeader>
							<CardTitle className="text-lg">Product Image</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="aspect-square relative rounded-lg overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
								{previewUrl ? (
									<img
										src={previewUrl}
										alt="Preview"
										className="h-full w-full object-cover"
									/>
								) : (
									<Upload className="h-10 w-10 text-zinc-400" />
								)}
							</div>
							<Input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="cursor-pointer"
							/>
							<p className="text-xs text-zinc-500 text-center">
								Replace the existing image.
							</p>
						</CardContent>
					</Card>

					<Card className="border-zinc-200 dark:border-zinc-800">
						<CardHeader>
							<CardTitle className="text-lg">Publish</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col gap-2">
								<Button
									type="submit"
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
											Saving...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" /> Save Changes
										</>
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full"
									asChild
								>
									<Link href="/inventory">Cancel</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</form>
		</div>
	);
}
