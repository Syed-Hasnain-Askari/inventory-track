"use client";

import { setIsSidebarCollapsed } from "../../redux/feature/slice/globalSlice";
import {
	Archive,
	Layout,
	LucideIcon,
	Menu,
	SlidersHorizontal,
	ShoppingBag,
	Layers,
	ChevronLeft,
	Box,
	ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }) => {
	const pathname = usePathname();
	const isActive =
		pathname === href || (pathname === "/" && href === "/dashboard");

	return (
		<Link href={href}>
			<div
				className={cn(
					"group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800",
					isActive 
						? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 font-semibold" 
						: "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
					isCollapsed ? "justify-center" : "justify-start mx-2"
				)}
			>
				<Icon className={cn(
					"h-5 w-5",
					isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
				)} />
				{!isCollapsed && (
					<span className="text-sm font-medium">
						{label}
					</span>
				)}
			</div>
		</Link>
	);
};

const Sidebar = () => {
	const dispatch = useDispatch();
	const { isSidebarCollapsed } = useSelector((state) => state.global);
	const toggleSidebar = () => {
		dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
	};

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300 dark:bg-zinc-950 dark:border-zinc-800",
				isSidebarCollapsed ? "w-[70px]" : "w-64"
			)}
		>
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className={cn(
					"flex h-16 items-center border-b px-4 dark:border-zinc-800",
					isSidebarCollapsed ? "justify-center" : "justify-between"
				)}>
					{!isSidebarCollapsed && (
						<Link href="/dashboard" className="flex items-center gap-2 font-semibold">
							<div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
								<Box className="h-5 w-5" />
							</div>
							<span className="text-lg tracking-tight">EDSTOCK</span>
						</Link>
					)}
					{isSidebarCollapsed && (
						<div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
							<Box className="h-5 w-5" />
						</div>
					)}
					{!isSidebarCollapsed && (
						<Button 
							variant="ghost" 
							size="icon" 
							onClick={toggleSidebar}
							className="h-8 w-8"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					)}
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 py-4">
					<SidebarLink
						href="/dashboard"
						icon={Layout}
						label="Dashboard"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarLink
						href="/inventory"
						icon={Archive}
						label="Inventory"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarLink
						href="/categories"
						icon={Layers}
						label="Categories"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarLink
						href="/order"
						icon={ShoppingBag}
						label="Orders"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarLink
						href="/settings"
						icon={SlidersHorizontal}
						label="Settings"
						isCollapsed={isSidebarCollapsed}
					/>
				</nav>

				{/* Footer */}
				<div className="border-t p-4 dark:border-zinc-800">
					{!isSidebarCollapsed ? (
						<div className="flex items-center gap-3">
							<div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
								<span className="text-xs font-bold">ES</span>
							</div>
							<div className="flex flex-col">
								<span className="text-xs font-medium">Edstock Admin</span>
								<span className="text-[10px] text-zinc-500">v1.0.0</span>
							</div>
						</div>
					) : (
						<div className="flex justify-center">
							<div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
								<span className="text-[10px] font-bold">ES</span>
							</div>
						</div>
					)}
				</div>
			</div>
			
			{/* Mobile Toggle Trigger (when collapsed) */}
			{isSidebarCollapsed && (
				<button 
					onClick={toggleSidebar}
					className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm dark:bg-zinc-950 dark:border-zinc-800 md:hidden"
				>
					<ChevronRight className="h-3 w-3" />
				</button>
			)}
		</aside>
	);
};

export default Sidebar;
