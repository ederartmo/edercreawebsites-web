import "./globals.css";
import AccessGate from "@/components/AccessGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
	icons: {
		icon: "/eder_favicon.png",
		shortcut: "/eder_favicon.png",
		apple: "/eder_favicon.png",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body>
				<AccessGate>{children}</AccessGate>
			</body>
		</html>
	);
}
