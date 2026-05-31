import React from "react";
import { Input } from "@/components/ui/input";

export default function Search({ handleSearchChange }) {
	return (
		<Input
			type="search"
			placeholder="Search products..."
			className="h-9 w-full bg-zinc-100/50 pl-9 dark:bg-zinc-800/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
			onChange={(e) => {
				handleSearchChange(e.target.value);
			}}
		/>
	);
}
