"use client";

import { setIsGrid } from "../../redux/feature/slice/globalSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "../ui/button";

export default function GridListToggle() {
	const dispatch = useDispatch();
	const { isGrid } = useSelector((state) => state.global);

	return (
		<div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
			<Button
				variant={isGrid ? "white" : "ghost"}
				size="sm"
				className={`h-7 px-3 gap-2 text-xs font-bold transition-all ${
					isGrid 
						? "bg-white dark:bg-zinc-950 shadow-sm text-indigo-600" 
						: "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
				}`}
				onClick={() => !isGrid && dispatch(setIsGrid(true))}
			>
				<LayoutGrid className="h-3.5 w-3.5" />
				<span className="hidden sm:inline">Grid</span>
			</Button>
			<Button
				variant={!isGrid ? "white" : "ghost"}
				size="sm"
				className={`h-7 px-3 gap-2 text-xs font-bold transition-all ${
					!isGrid 
						? "bg-white dark:bg-zinc-950 shadow-sm text-indigo-600" 
						: "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
				}`}
				onClick={() => isGrid && dispatch(setIsGrid(false))}
			>
				<List className="h-3.5 w-3.5" />
				<span className="hidden sm:inline">Table</span>
			</Button>
		</div>
	);
}
