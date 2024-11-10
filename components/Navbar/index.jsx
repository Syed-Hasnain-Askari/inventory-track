"use client";

import {
	setIsDarkMode,
	setIsSidebarCollapsed
} from "../../redux/feature/slice/globalSlice";
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserMenu from "../../app/components/UserMenu";
import Notification from "../../components/notification";
import { logout } from "../../lib/actions/logoutAction";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getInventoryProducts } from "../../redux/feature/reducer/inventryReducer";
import Search from "../search";
const Navbar = ({ user }) => {
	console.log(user, "user details");
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
		<div className="sticky top-5 z-50 flex justify-between items-center w-full mb-7">
			{/* LEFT SIDE */}
			<div className="flex justify-between items-center gap-5">
				<button
					className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
					onClick={toggleSidebar}
				>
					<Menu className="w-4 h-4" />
				</button>

				<Search handleSearchChange={handleSearchChange} />
			</div>

			{/* RIGHT SIDE */}
			<div className="flex justify-between items-center gap-5">
				<div className="hidden md:flex justify-between items-center gap-5">
					<div>
						<button onClick={toggleDarkMode}>
							{isDarkMode ? (
								<Sun className="cursor-pointer text-gray-500" size={24} />
							) : (
								<Moon className="cursor-pointer text-gray-500" size={24} />
							)}
						</button>
					</div>
					<div className="relative">
						<button onClick={handleNotification}>
							<Bell className="cursor-pointer text-gray-500" size={24} />
						</button>
						<span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
							3
						</span>
						{isNotification ? <Notification /> : ""}
					</div>

					<hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
					<div className="flex items-center gap-3 cursor-pointer">
						<div class="relative ml-3">
							<div>
								<button
									type="button"
									class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
									id="user-menu-button"
									aria-expanded="false"
									aria-haspopup="true"
									onClick={handleToggle}
								>
									<span class="absolute -inset-1.5"></span>
									<span class="sr-only">Open user menu</span>
									<img
										class="h-8 w-8 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</button>
							</div>
							{toggle ? (
								<UserMenu loading={loading} handleSignOut={handleSignOut} />
							) : (
								""
							)}
						</div>
						<span className="font-semibold">{user?.username}</span>
					</div>
				</div>
				<Link href="/settings">
					<Settings className="cursor-pointer text-gray-500" size={24} />
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
