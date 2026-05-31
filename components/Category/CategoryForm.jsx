"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormSchema } from "../../util/validation/category";
import {
	createCategory,
	updateCategory
} from "../../app/actions/categoryActions";
import { useToast } from "@/components/ui/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function CategoryForm({
	open,
	onOpenChange,
	category = null,
	onSuccess
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(CategoryFormSchema),
		defaultValues: {
			name: category?.name || "",
			description: category?.description || "",
			isActive: category ? category.isActive : true
		}
	});

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			let result;
			if (category) {
				result = await updateCategory(category._id, data);
			} else {
				result = await createCategory(data);
			}

			if (result.success) {
				toast({
					title: "Success",
					variant: "success",
					description: result.message,
				});
				onSuccess(result.result);
				onOpenChange(false);
				form.reset();
			} else {
				toast({
					title: "Error",
					variant: "destructive",
					description: result.message
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				variant: "destructive",
				description: "Something went wrong. Please try again."
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
				<DialogHeader>
					<DialogTitle>
						{category ? "Edit Category" : "Add New Category"}
					</DialogTitle>
					<DialogDescription>
						{category
							? "Modify the details of your category below."
							: "Enter the details for your new category."}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Category Name</Label>
						<Input
							id="name"
							placeholder="e.g. Electronics, Clothing"
							{...form.register("name")}
							className={form.formState.errors.name ? "border-red-500" : ""}
						/>
						{form.formState.errors.name && (
							<p className="text-xs text-red-500">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							placeholder="Short description of the category"
							{...form.register("description")}
						/>
					</div>
					<div className="flex items-center space-x-2 pt-2">
						<input
							type="checkbox"
							id="isActive"
							className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
							{...form.register("isActive")}
						/>
						<Label
							htmlFor="isActive"
							className="text-sm font-medium leading-none"
						>
							Is Active
						</Label>
					</div>
					<DialogFooter className="pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
							disabled={loading}
						>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{category ? "Update Category" : "Create Category"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
