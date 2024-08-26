"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useSelector } from "react-redux";
import Providers from "./components/Provider";

const DashboardLayout = ({ children }) => {
	const { isDarkMode, isSidebarCollapsed } = useSelector(
		(state) => state.global
	);
	return (
		<div
			// className={`${
			// 	isDarkMode ? "dark" : "light"
			// } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
			className={`flex bg-gray-50 text-gray-900 w-full min-h-screen`}
		>
			<Sidebar />
			<main
				className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
					isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
				}`}
			>
				<Navbar />
				{children}
			</main>
		</div>
	);
};

const DashboardWrapper = ({ children }) => {
	return (
		<Providers>
			<DashboardLayout>{children}</DashboardLayout>
		</Providers>
	);
};

export default DashboardWrapper;
