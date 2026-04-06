"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COURSE_CATALOG } from "@/data/courses";
import { getSupabase } from "@/lib/supabase";
import { resolvePurchasedSlugs } from "@/lib/courseAccess";

type AccessState = {
	isLoggedIn: boolean;
	purchasedSlugs: Set<string>;
	userEmail?: string;
};

export default function MisCursosPage() {
	const [access, setAccess] = useState<AccessState>({ isLoggedIn: false, purchasedSlugs: new Set() });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = getSupabase();
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			const user = session?.user;
			if (!user) {
				setAccess({ isLoggedIn: false, purchasedSlugs: new Set() });
				setLoading(false);
				return;
			}

			const purchasedSlugs = await resolvePurchasedSlugs(supabase, user);
			setAccess({ isLoggedIn: true, purchasedSlugs, userEmail: user.email });
			setLoading(false);
		});
	}, []);

	if (loading) {
		return <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">Cargando tus cursos...</main>;
	}

	const availableCourses = COURSE_CATALOG.filter(
		(course) => course.isFree || access.purchasedSlugs.has(course.slug.toLowerCase()),
	);

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
			<div className="mx-auto max-w-6xl">
				<h1 className="text-3xl font-bold">Mis cursos</h1>
				<p className="mt-2 text-zinc-400">
					{access.isLoggedIn
						? `Sesion activa con ${access.userEmail ?? "tu cuenta"}`
						: "Inicia sesion para ver los cursos comprados en tu cuenta."}
				</p>

				{!access.isLoggedIn ? (
					<div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
						<p className="text-zinc-300">Aun no has iniciado sesion.</p>
						<Link href="/" className="mt-3 inline-flex rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400">
							Ir a /cursos
						</Link>
					</div>
				) : availableCourses.length === 0 ? (
					<div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
						<p className="text-zinc-300">Aun no tienes cursos de pago activos.</p>
						<Link href="/catalogo" className="mt-3 inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-zinc-500">
							Explorar catalogo
						</Link>
					</div>
				) : (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{availableCourses.map((course) => (
							<article key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
								<img src={course.thumbnail} alt={course.title} className="aspect-video w-full object-cover" />
								<div className="p-4">
									<div className="mb-2 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
										{course.isFree ? "Gratis" : "Comprado"}
									</div>
									<h2 className="font-semibold leading-snug">{course.title}</h2>
									<p className="mt-1 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
									<div className="mt-4 flex gap-2">
										<Link href={`/${course.slug}`} className="inline-flex rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400">
											Abrir curso
										</Link>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
