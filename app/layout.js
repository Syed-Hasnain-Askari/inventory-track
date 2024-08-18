import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				<DashboardWrapper>{children}</DashboardWrapper>
			</body>
		</html>
	);
}
