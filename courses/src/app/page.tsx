"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { COURSE_CATALOG } from "@/data/courses";
import { getSupabase } from "@/lib/supabase";
import { resolvePurchasedSlugs } from "@/lib/courseAccess";

type ViewMode = "grid" | "list";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
	.split(",")
	.map((value) => value.trim().toLowerCase())
	.filter(Boolean);

async function checkIfAuthorized(email: string): Promise<boolean> {
	try {
		const normalizedEmail = email.trim().toLowerCase();
		if (!normalizedEmail) return false;

		if (ADMIN_EMAILS.includes(normalizedEmail)) {
			return true;
		}

		const supabase = getSupabase();

		const { data: roleData, error: roleError } = await supabase
			.from("user_roles")
			.select("id, is_admin")
			.ilike("email", normalizedEmail)
			.maybeSingle();

		if (!roleError && roleData) {
			return roleData.is_admin === true;
		}

		const { data: authorizedData, error: authorizedError } = await supabase
			.from("authorized_users")
			.select("id, is_admin")
			.ilike("email", normalizedEmail)
			.maybeSingle();

		if (!authorizedError && authorizedData) {
			return authorizedData.is_admin === true;
		}

		return false;
	} catch {
		return false;
	}
}

export default function HomePage() {
	const featured = COURSE_CATALOG[0];
	const extras = COURSE_CATALOG.slice(1);
	const [user, setUser] = useState<User | null>(null);
	const [profileName, setProfileName] = useState("");
	const [draftName, setDraftName] = useState("");
	const [isEditingName, setIsEditingName] = useState(false);
	const [savingName, setSavingName] = useState(false);
	const [nameMessage, setNameMessage] = useState("");
	const [nameSavedPulse, setNameSavedPulse] = useState(false);
	const [view, setView] = useState<ViewMode>("grid");
	const [purchasedSlugs, setPurchasedSlugs] = useState<Set<string>>(new Set());

	useEffect(() => {
		const supabase = getSupabase();

		const syncUser = async (nextUser: User | null) => {
			setUser(nextUser);
			const nextName =
				(nextUser?.user_metadata?.full_name as string | undefined) ||
				(nextUser?.user_metadata?.name as string | undefined) ||
				"";
			setProfileName(nextName);
			setDraftName(nextName);

			if (!nextUser) {
				setPurchasedSlugs(new Set());
				return;
			}

			const isAdminUser = await checkIfAuthorized(nextUser.email ?? "");
			if (isAdminUser) {
				const allPaidSlugs = new Set(
					COURSE_CATALOG.filter((course) => !course.isFree).map((course) => course.slug.toLowerCase()),
				);
				setPurchasedSlugs(allPaidSlugs);
				return;
			}

			const slugs = await resolvePurchasedSlugs(supabase, nextUser);
			setPurchasedSlugs(slugs);
		};

		supabase.auth.getSession().then(({ data: { session } }) => {
			void syncUser(session?.user ?? null);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			void syncUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	function startNameEdit() {
		setIsEditingName(true);
		setNameMessage("");
		setDraftName(profileName);
	}

	async function saveName() {
		if (!user) {
			setNameMessage("Inicia sesion para guardar tu nombre.");
			setIsEditingName(false);
			return;
		}

		const cleanName = draftName.trim();
		setSavingName(true);
		setNameMessage("");

		const { error } = await getSupabase().auth.updateUser({
			data: {
				full_name: cleanName,
			},
		});

		if (error) {
			setNameMessage("No se pudo guardar el nombre.");
		} else {
			setProfileName(cleanName);
			setNameMessage(cleanName ? "Bienvenido, que bueno que esta aqui." : "Escribe tu nombre.");
			setNameSavedPulse(true);
			window.setTimeout(() => setNameSavedPulse(false), 900);
		}

		setSavingName(false);
		setIsEditingName(false);
	}

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-14">
			<div className="max-w-5xl mx-auto">
				<div className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-500 ${nameSavedPulse ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.35)]" : "text-orange-400"}`}>
					{isEditingName ? (
						<div className="flex flex-wrap items-center gap-2">
							<span>Hola,</span>
							<input
								autoFocus
								type="text"
								value={draftName}
								onChange={(e) => setDraftName(e.target.value)}
								onBlur={saveName}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										void saveName();
									}
									if (e.key === "Escape") {
										setDraftName(profileName);
										setIsEditingName(false);
									}
								}}
								placeholder="Escribe tu nombre"
								className="w-52 rounded-md border border-orange-400/50 bg-zinc-900 px-2 py-1 text-[11px] normal-case tracking-normal text-zinc-100 outline-none focus:border-orange-300"
							/>
							{savingName ? <span className="normal-case tracking-normal text-zinc-500">Guardando...</span> : null}
						</div>
					) : (
						<button
							type="button"
							onDoubleClick={startNameEdit}
							className="cursor-text"
							title="Doble clic para editar tu nombre"
						>
							{profileName ? `Hola, ${profileName}` : "Hola, escribe tu nombre"}
						</button>
					)}
				</div>
				<h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">🎓 Area de Cursos</h1>
				<p className="mt-2 text-sm text-zinc-400">{profileName ? "Bienvenido, que bueno que esta aqui." : "Escribe tu nombre con doble clic aqui arriba."}</p>
				{nameMessage ? <p className={`mt-1 text-xs text-emerald-300 transition-opacity duration-500 ${nameSavedPulse ? "animate-pulse" : ""}`}>{nameMessage}</p> : null}
				<p className="mt-4 text-zinc-300 max-w-2xl">
					Todo en un solo lugar: revisa catalogo en cuadricula o lista, entra al detalle y accede al curso.
				</p>
				<div className="mt-8 flex items-center justify-between gap-4">
					<h2 className="text-2xl font-semibold">Catalogo de cursos</h2>
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

				{view === "grid" ? (
					<div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{COURSE_CATALOG.map((course) => {
							const isPurchased = purchasedSlugs.has(course.slug.toLowerCase());
							return (
								<article key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
									<div className="aspect-video bg-zinc-800">
										<img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
									</div>
									<div className="p-4">
										<div className="mb-2 flex items-center gap-2 flex-wrap">
											{course.isFree ? (
												<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Gratis</span>
											) : isPurchased ? (
												<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Comprado</span>
											) : (
												<span className="inline-flex rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">No comprado</span>
											)}
											{course.id === featured.id ? (
												<span className="inline-flex rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-300">Sitio web desde cero en Canva</span>
											) : null}
										</div>
										<h3 className="font-semibold leading-snug">{course.title}</h3>
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
												href={`/${course.slug}/detalle`}
												className="inline-flex rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
											>
												Ver detalles
											</Link>
											<Link
												href={`/${course.slug}`}
												className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2 text-sm transition-colors"
											>
												{course.isFree ? "VER VIDEO" : "Entrar al curso"}
											</Link>
										</div>
									</div>
								</article>
							);
						})}
					</div>
				) : (
					<div className="mt-6 flex flex-col gap-3">
						{COURSE_CATALOG.map((course) => {
							const isPurchased = purchasedSlugs.has(course.slug.toLowerCase());
							return (
								<article key={course.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-28 sm:w-40 shrink-0 rounded-lg aspect-video object-cover bg-zinc-800"
										loading="lazy"
									/>
									<div className="flex-1 min-w-0">
										<div className="mb-1 flex items-center gap-2 flex-wrap">
											{course.isFree ? (
												<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Gratis</span>
											) : isPurchased ? (
												<span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Comprado</span>
											) : (
												<span className="inline-flex rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">No comprado</span>
											)}
											{course.id === featured.id ? (
												<span className="inline-flex rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-300">Sitio web desde cero en Canva</span>
											) : null}
										</div>
										<h3 className="font-semibold leading-snug">{course.title}</h3>
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
											href={`/${course.slug}/detalle`}
											className="rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors text-center"
										>
											Ver detalles
										</Link>
										<Link
											href={`/${course.slug}`}
											className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2 text-sm transition-colors text-center"
										>
											{course.isFree ? "VER VIDEO" : "Entrar"}
										</Link>
									</div>
								</article>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
