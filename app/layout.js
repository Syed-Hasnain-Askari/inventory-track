// app/layout.js
import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";
import { Toaster } from "../components/ui/toaster";
import AuthPage from "./auth/page";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value;

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				{token ? <DashboardWrapper children={children} /> : <AuthPage />}
			</body>
		</html>
	);
}
