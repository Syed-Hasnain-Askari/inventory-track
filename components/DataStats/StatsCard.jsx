import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ icon, color, title, value, description, trend }) {
	return (
		<Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
					{title}
				</CardTitle>
				<div 
					className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
					style={{ backgroundColor: color }}
				>
					{React.cloneElement(icon, { className: "h-5 w-5", size: 20 })}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					{value}
				</div>
				{description && (
					<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
						{description}
					</p>
				)}
				{trend && (
					<div className={cn(
						"mt-2 flex items-center text-xs font-medium",
						trend.isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
					)}>
						{trend.isUp ? "↑" : "↓"} {trend.value}%
						<span className="ml-1 text-zinc-400">from last month</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
