"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import ChatBotBubble from "../../../components/BubbleChatBot";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children, username }) => {
	const { isDarkMode, isSidebarCollapsed } = useSelector(
		(state) => state.global
	);
	return (
		<div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
			<Sidebar />
			<div
				className={cn(
					"flex flex-1 flex-col transition-all duration-300",
					isSidebarCollapsed ? "pl-[70px]" : "pl-64"
				)}
			>
				<Navbar username={username} />
				<main className="flex-1 overflow-y-auto p-6 lg:p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{children}
					</div>
				</main>
				<ChatBotBubble />
			</div>
		</div>
	);
};
export default DashboardLayout;
