import Link from "next/link";
import { COURSE_CATALOG } from "@/data/courses";

export default function HomePage() {
	const featured = COURSE_CATALOG[0];

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-14">
			<div className="max-w-5xl mx-auto">
				<p className="text-xs uppercase tracking-[0.2em] text-orange-400 font-semibold">Eder Crea Webs</p>
				<h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">Area de Cursos</h1>
				<p className="mt-4 text-zinc-300 max-w-2xl">
					Aprende diseno y desarrollo web con clases practicas. Accede a tu curso y continua donde te quedaste.
				</p>

				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href={`/${featured.slug}`}
						className="inline-flex items-center rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-5 py-3 transition-colors"
					>
						Entrar al curso
					</Link>
					<Link
						href="/catalogo"
						className="inline-flex items-center rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-100 px-5 py-3 transition-colors"
					>
						Ver catalogo
					</Link>
				</div>

				<section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
					<p className="text-xs text-zinc-400">Curso destacado</p>
					<h2 className="mt-1 text-xl font-semibold">{featured.title}</h2>
					<p className="mt-2 text-zinc-300">{featured.subtitle}</p>
					<div className="mt-4 flex flex-wrap gap-2">
						{featured.tags.map((tag) => (
							<span key={tag} className="text-xs bg-zinc-800 text-zinc-300 rounded-full px-3 py-1">
								{tag}
							</span>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
