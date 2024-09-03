import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";
import { Toaster } from "../components/ui/toaster";
import AuthProvider from "../app/NextAuthProvider";
import { getServerSession } from "next-auth";
import AuthPage from "./auth/page";
const inter = Inter({ subsets: ["latin"] });
export default async function RootLayout({ children }) {
	const session = await getServerSession();

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				{session === null ? (
					<AuthPage />
				) : (
					<AuthProvider session={session}>
						<DashboardWrapper>{children}</DashboardWrapper>
					</AuthProvider>
				)}
			</body>
		</html>
	);
}
