"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { COURSE_CATALOG } from "@/data/courses";
import { getSupabase } from "@/lib/supabase";

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

	useEffect(() => {
		const supabase = getSupabase();

		const syncUser = (nextUser: User | null) => {
			setUser(nextUser);
			const nextName =
				(nextUser?.user_metadata?.full_name as string | undefined) ||
				(nextUser?.user_metadata?.name as string | undefined) ||
				"";
			setProfileName(nextName);
			setDraftName(nextName);
		};

		supabase.auth.getSession().then(({ data: { session } }) => {
			syncUser(session?.user ?? null);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			syncUser(session?.user ?? null);
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
					Aprende diseno y desarrollo web con clases practicas. Mira el temario y las caracteristicas del curso antes de comprar.
				</p>
				<p className="mt-3 text-sm text-zinc-400">
					Primero revisas detalles y temario. El acceso final al reproductor se habilita al comprar con tu cuenta.
				</p>

				<section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
					<p className="text-xs text-zinc-400">Curso destacado</p>
					<div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
						<img
							src={featured.thumbnail}
							alt={featured.title}
							className="w-full sm:w-40 shrink-0 rounded-lg object-cover aspect-video bg-zinc-800"
						/>
						<div className="min-w-0 flex-1">
							<span className="inline-block mb-2 text-xs font-semibold rounded-full bg-orange-500/15 text-orange-300 px-3 py-0.5">
								Sitio web desde cero en Canva
							</span>
							<h2 className="text-xl font-semibold">{featured.title}</h2>
							<p className="mt-2 text-zinc-300">{featured.subtitle}</p>
							<div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
								<span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-500 line-through">$2000 MXN</span>
								<span className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300">$1200 MXN despues de la promo</span>
							</div>
							<div className="mt-4 flex flex-wrap gap-2">
								{featured.tags.map((tag) => (
									<span key={tag} className="text-xs bg-zinc-800 text-zinc-300 rounded-full px-3 py-1">
										{tag}
									</span>
								))}
							</div>
						</div>
						<div className="sm:w-44 shrink-0 flex sm:flex-col gap-2 sm:gap-3">
							<Link
								href={`/${featured.slug}/detalle`}
								className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2.5 transition-colors"
							>
								Ver detalles
							</Link>
							<Link
								href={`/${featured.slug}`}
								className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2.5 transition-colors"
							>
								Entrar al curso
							</Link>
						</div>
					</div>
				</section>

				{extras.length > 0 && (
					<section className="mt-6 flex flex-col gap-4">
						{extras.map((course) => (
							<article
								key={course.id}
								className="group flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 p-4 sm:p-5 transition-colors"
							>
								<img
									src={course.thumbnail}
									alt={course.title}
									className="w-28 sm:w-36 shrink-0 rounded-lg object-cover aspect-video bg-zinc-800"
								/>
								<div className="flex-1 min-w-0">
									<span className="inline-block mb-2 text-xs font-semibold rounded-full bg-orange-500/15 text-orange-300 px-3 py-0.5">
										Video extra gratis
									</span>
									<h2 className="text-sm sm:text-base font-semibold leading-snug group-hover:text-orange-400 transition-colors">
										{course.title}
									</h2>
									<p className="mt-1 text-xs sm:text-sm text-zinc-400 line-clamp-2">{course.description}</p>
								</div>
								<div className="sm:w-44 shrink-0 flex sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
									<Link
										href={`/${course.slug}/detalle`}
										className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2.5 transition-colors"
									>
										Ver detalles
									</Link>
									<Link
										href={`/${course.slug}`}
										className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-4 py-2.5 transition-colors"
									>
										Entrar al curso
									</Link>
								</div>
							</article>
						))}
					</section>
				)}
			</div>
		</main>
	);
}
