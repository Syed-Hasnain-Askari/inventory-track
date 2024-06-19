import "./globals.css";
import { Inter } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>{children}</StoreProvider>
			</body>
		</html>
	);
}
