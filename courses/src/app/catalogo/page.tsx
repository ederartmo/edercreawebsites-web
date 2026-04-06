"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { COURSE_CATALOG } from "@/data/courses";
import { getSupabase } from "@/lib/supabase";

type ViewMode = "grid" | "list";
const PAID_KEY = "cursos_paid";

export default function CatalogoPage() {
	const [view, setView] = useState<ViewMode>("grid");
	const [hasPaid, setHasPaid] = useState(false);

	useEffect(() => {
		const supabase = getSupabase();
		supabase.auth.getSession().then(({ data: { session } }) => {
			const paid = session?.user?.user_metadata?.[PAID_KEY] === true;
			setHasPaid(paid);
		});
	}, []);

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
					</div>
				</div>

				{/* ── Grid view ── */}
				{view === "grid" && (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{COURSE_CATALOG.map((course) => (
							// Estado de compra visible en cada detalle/listado
							<article key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
								<div className="aspect-video bg-zinc-800">
									<img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
								</div>
								<div className="p-4">
									<div className="mb-2">
										{course.isFree ? (
											<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Gratis</span>
										) : hasPaid ? (
											<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Comprado</span>
										) : (
											<span className="inline-flex rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">No comprado</span>
										)}
									</div>
									<h2 className="font-semibold leading-snug">{course.title}</h2>
									<p className="mt-2 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
									<div className="mt-3 flex items-center gap-2 text-sm">
										{course.isFree ? (
											<>
												<span className="text-zinc-500 line-through">$50</span>
												<span className="font-semibold text-orange-300">Video Extra Gratis</span>
											</>
										) : (
											<>
												<span className="text-zinc-500 line-through">$2000</span>
												<span className="font-semibold text-emerald-300">$1200 MXN</span>
											</>
										)}
									</div>
									<div className="mt-4 flex flex-wrap gap-2">
										<Link
											href={`/${course.slug}`}
											className="inline-flex rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
										>
											Ver detalles
										</Link>
										<Link
											href={`/${course.slug}`}
											className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2 text-sm transition-colors"
										>
											Entrar al curso
										</Link>
									</div>
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
									<div className="mb-1">
										{course.isFree ? (
											<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Gratis</span>
										) : hasPaid ? (
											<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Comprado</span>
										) : (
											<span className="inline-flex rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">No comprado</span>
										)}
									</div>
									<h2 className="font-semibold leading-snug">{course.title}</h2>
									<p className="mt-1 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
										{course.isFree ? (
											<>
												<span className="text-zinc-500 line-through">$50</span>
												<span className="font-semibold text-orange-300">Video Extra Gratis</span>
											</>
										) : (
											<>
												<span className="text-zinc-500 line-through">$2000</span>
												<span className="font-semibold text-emerald-300">$1200 MXN</span>
											</>
										)}
										{course.tags.slice(0, 3).map((tag) => (
											<span key={tag} className="text-xs bg-zinc-800 text-zinc-300 rounded-full px-2 py-0.5">{tag}</span>
										))}
									</div>
								</div>
								<div className="shrink-0 flex flex-col gap-2">
									<Link
										href={`/${course.slug}`}
										className="rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors text-center"
									>
										Ver detalles
									</Link>
									<Link
										href={`/${course.slug}`}
										className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2 text-sm transition-colors text-center"
									>
										Entrar
									</Link>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
