import "./globals.css";
import AccessGate from "@/components/AccessGate";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body>
				<AccessGate>{children}</AccessGate>
			</body>
		</html>
	);
}
