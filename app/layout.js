import Providers from "./components/Provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
