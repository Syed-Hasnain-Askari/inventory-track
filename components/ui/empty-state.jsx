import React from "react";
import { AlertTriangle, ShoppingBag, Plus } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

export function EmptyState({
	title,
	description,
	icon = ShoppingBag,
	actionText = "Get Started",
	actionLink = "/inventory/add-product",
	className = ""
}) {
	return (
		<div className={`${className} text-center py-12`}>
			<div className="flex items-center justify-center mb-6">
				{/* <icon className="h-10 w-10 text-gray-400" /> */}
			</div>
			<h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
				{title}
			</h2>
			<p className="mb-6 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
				{description}
			</p>
			<Link href={actionLink}>
				<Button variant="default" className="w-full max-w-xs">
					{actionText}
				</Button>
			</Link>
		</div>
	);
}

export function InventoryEmptyState() {
	return (
		<EmptyState
			title="No Products Found"
			description="Your inventory appears to be empty. Add your first product to get started."
			icon={ShoppingBag}
			actionText="Add First Product"
			actionLink="/inventory/add-product"
		/>
	);
}

export function FilterEmptyState() {
	return (
		<EmptyState
			title="No Products Match Your Filters"
			description="Try adjusting your search or filter criteria to find products."
			icon={AlertTriangle}
			actionText="Clear Filters"
			actionLink="/inventory"
		/>
	);
}
