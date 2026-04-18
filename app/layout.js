import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import DashboardWrapper from "./(dashboard)/dashboard/dashboardWrapper";
import { Toaster } from "../components/ui/toaster";
import SignInPage from "./(auth)/login/page";
import SessionAutoLogout from "../components/SessionAutoLogout";
import { verifyToken } from "./lib/session";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const sessionState = token ? await verifyToken(token) : { isAuth: false };
	const isValidToken = sessionState.isAuth;

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				<SessionAutoLogout isAuthenticated={isValidToken} />
				{isValidToken ? (
					<DashboardWrapper children={children} />
				) : (
					<SignInPage />
				)}
			</body>
		</html>
	);
}
