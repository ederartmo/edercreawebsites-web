import Link from "next/link";

export interface BreadcrumbItem {
	label: string;
	/** Si no hay href, se muestra como item actual (no cliqueable). */
	href?: string;
	/** Usa <a> nativo en lugar de Next Link (para links fuera del basePath). */
	external?: boolean;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav className="flex items-center gap-1 text-sm" aria-label="Ruta de navegación">
			{items.map((item, index) => (
				<span key={index} className="flex items-center gap-1">
					{index > 0 && (
						<span className="text-zinc-600 select-none mx-0.5">›</span>
					)}
					{item.href ? (
						item.external ? (
							<a
								href={item.href}
								className="text-zinc-400 hover:text-white transition-colors duration-150"
							>
								{item.label}
							</a>
						) : (
							<Link
								href={item.href}
								className="text-zinc-400 hover:text-white transition-colors duration-150"
							>
								{item.label}
							</Link>
						)
					) : (
						<span className="text-zinc-100 font-medium">{item.label}</span>
					)}
				</span>
			))}
		</nav>
	);
}
