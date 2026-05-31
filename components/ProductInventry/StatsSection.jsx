"use client";

import React from "react";
import { Package, DollarSign, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

export const StatsSection = ({ data }) => {
	console.log(data, "Data stats");
	const { pagination } = useSelector((state) => state.inventry);

	const products = data || [];

	const totalProducts = pagination?.totalProducts || products.length;
	const totalValue = products.reduce(
		(acc, curr) => acc + Number(curr.price) * Number(curr.stock),
		0
	);
	const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
	const outOfStock = products.filter((p) => p.stock === 0).length;

	const stats = [
		{
			title: "Total Products",
			value: totalProducts,
			icon: <Package className="h-5 w-5 text-indigo-600" />,
			description: "Items in your catalog",
			color: "bg-indigo-50 dark:bg-indigo-900/20"
		},
		{
			title: "Inventory Value",
			value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
			description: "Total value of stock",
			color: "bg-emerald-50 dark:bg-emerald-900/20"
		},
		{
			title: "Low Stock",
			value: lowStock,
			icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
			description: "Items needing restock",
			color: "bg-amber-50 dark:bg-amber-900/20"
		},
		{
			title: "Out of Stock",
			value: outOfStock,
			icon: <XCircle className="h-5 w-5 text-red-600" />,
			description: "Currently unavailable",
			color: "bg-red-50 dark:bg-red-900/20"
		}
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
			{stats.map((stat, index) => (
				<Card
					key={index}
					className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
				>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
									{stat.title}
								</p>
								<h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">
									{stat.value}
								</h3>
								<p className="text-[10px] text-zinc-400 mt-1 font-medium">
									{stat.description}
								</p>
							</div>
							<div
								className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}
							>
								{stat.icon}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
