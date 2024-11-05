import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboard/dashboardWrapper";
import { Toaster } from "../components/ui/toaster";
import SignInPage from "./login/page";
import { cookies } from "next/headers";
import { getUserDetails } from "../lib/actions/getUserDetail";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				{token ? <DashboardWrapper children={children} /> : <SignInPage />}
			</body>
		</html>
	);
}
