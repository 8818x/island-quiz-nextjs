import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import SessionWrapper from "@/components/SessionWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-primary"
});

export const metadata: Metadata = {
	title: "Island Quiz",
	description: "Island Quiz"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans antialiased`}>
				<SessionWrapper>
					<NavbarWrapper />
					{children}
					<Toaster position="top-right" />
				</SessionWrapper>
			</body>
		</html>
	);
}
