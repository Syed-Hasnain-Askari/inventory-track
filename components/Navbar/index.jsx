"use client";

import {
	setIsDarkMode,
	setIsSidebarCollapsed
} from "../../redux/feature/slice/globalSlice";
import { Bell, Menu, Moon, Settings, Sun, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserMenu from "../../app/components/UserMenu";
import Notification from "../../components/notification";
import { logout } from "@/lib/actions/logoutAction";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getInventoryProducts } from "../../redux/feature/reducer/inventryReducer";
import Search from "../search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = ({ username }) => {
	const router = useRouter();
	const [toggle, setToggle] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isNotification, setIsNotification] = useState(false);
	const handleToggle = () => {
		setToggle(!toggle);
		setIsNotification(false);
	};
	const handleNotification = () => {
		setToggle(false);
		setIsNotification(!isNotification);
	};
	const dispatch = useDispatch();
	const { isDarkMode, isSidebarCollapsed } = useSelector(
		(state) => state.global
	);

	const toggleSidebar = () => {
		dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
	};
	const toggleDarkMode = () => {
		dispatch(setIsDarkMode(!isDarkMode));
	};
	const handleSignOut = async () => {
		await logout();
	};
	const handleSearchChange = useDebouncedCallback((value) => {
		const search = value;
		dispatch(getInventoryProducts({ search }));
	}, 2000);

	return (
		<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:bg-zinc-950/80 dark:border-zinc-800">
			{/* LEFT SIDE */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={toggleSidebar}
				>
					<Menu className="h-5 w-5" />
				</Button>

				<div className="relative w-full max-w-md">
					<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
					<Search handleSearchChange={handleSearchChange} />
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1 sm:gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleDarkMode}
						className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						{isDarkMode ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</Button>
					
					<div className="relative">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNotification}
							className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							<Bell className="h-5 w-5" />
							<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-zinc-950"></span>
						</Button>
						{isNotification && <Notification />}
					</div>

					<Button
						variant="ghost"
						size="icon"
						asChild
						className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						<Link href="/settings">
							<Settings className="h-5 w-5" />
						</Link>
					</Button>

					<div className="mx-2 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

					<div className="relative">
						<button
							onClick={handleToggle}
							className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
						>
							<div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800">
								<img
									className="h-full w-full object-cover"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="User"
								/>
							</div>
							<span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 md:block">
								{username}
							</span>
						</button>
						{toggle && (
							<UserMenu loading={loading} handleSignOut={handleSignOut} />
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
