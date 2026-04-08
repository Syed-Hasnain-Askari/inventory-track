import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import DashboardWrapper from "./(dashboard)/dashboard/dashboardWrapper";
import { Toaster } from "../components/ui/toaster";
import SignInPage from "./(auth)/login/page";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	// Ensure token is valid and not expired/cleared
	const isValidToken = token && token.length > 0;

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				{isValidToken ? (
					<DashboardWrapper children={children} />
				) : (
					<SignInPage />
				)}
			</body>
		</html>
	);
}
