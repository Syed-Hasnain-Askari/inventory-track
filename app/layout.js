"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";
import { useState } from "react";
import { Toaster } from "../components/ui/toaster";
import SignInPage from "./auth/signin/page";
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
	const [authenticated, setAuthenticated] = useState(false);
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				{authenticated ? (
					<DashboardWrapper>{children}</DashboardWrapper>
				) : (
					<SignInPage />
				)}
			</body>
		</html>
	);
}
