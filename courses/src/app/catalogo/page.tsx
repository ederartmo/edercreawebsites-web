"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { COURSE_CATALOG } from "@/data/courses";

type ViewMode = "grid" | "list";

export default function CatalogoPage() {
	const [view, setView] = useState<ViewMode>("grid");

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between gap-4 mb-8">
					<h1 className="text-3xl font-bold">Catalogo</h1>

					<div className="flex items-center gap-3">
						{/* Toggle grid / list */}
						<div className="flex items-center rounded-lg border border-zinc-700 overflow-hidden">
							<button
								onClick={() => setView("grid")}
								className={`p-2 transition-colors ${view === "grid" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
								aria-label="Vista cuadricula"
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
							<button
								onClick={() => setView("list")}
								className={`p-2 transition-colors ${view === "list" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
								aria-label="Vista lista"
							>
								<List className="w-4 h-4" />
							</button>
						</div>

						<Link href="/" className="text-sm text-zinc-300 hover:text-white underline underline-offset-4">
							Volver al inicio
						</Link>
					</div>
				</div>

				{/* ── Grid view ── */}
				{view === "grid" && (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{COURSE_CATALOG.map((course) => (
							<article key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
								<div className="aspect-video bg-zinc-800">
									<img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
								</div>
								<div className="p-4">
									<h2 className="font-semibold leading-snug">{course.title}</h2>
									<p className="mt-2 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
									<div className="mt-3 flex items-center gap-2 text-sm">
										<span className="text-zinc-500 line-through">$2000</span>
										<span className="font-semibold text-emerald-300">$1200 MXN</span>
									</div>
									<Link
										href={`/${course.slug}`}
										className="mt-4 inline-flex rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
									>
										Ver detalles
									</Link>
								</div>
							</article>
						))}
					</div>
				)}

				{/* ── List view ── */}
				{view === "list" && (
					<div className="flex flex-col gap-3">
						{COURSE_CATALOG.map((course) => (
							<article key={course.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
								<img
									src={course.thumbnail}
									alt={course.title}
									className="w-28 sm:w-40 shrink-0 rounded-lg aspect-video object-cover bg-zinc-800"
									loading="lazy"
								/>
								<div className="flex-1 min-w-0">
									<h2 className="font-semibold leading-snug">{course.title}</h2>
									<p className="mt-1 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
										<span className="text-zinc-500 line-through">$2000</span>
										<span className="font-semibold text-emerald-300">$1200 MXN</span>
										{course.tags.slice(0, 3).map((tag) => (
											<span key={tag} className="text-xs bg-zinc-800 text-zinc-300 rounded-full px-2 py-0.5">{tag}</span>
										))}
									</div>
								</div>
								<Link
									href={`/${course.slug}`}
									className="shrink-0 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
								>
									Ver
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
