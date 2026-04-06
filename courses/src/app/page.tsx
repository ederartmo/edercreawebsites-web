import Link from "next/link";
import { COURSE_CATALOG } from "@/data/courses";

export default function HomePage() {
	const featured = COURSE_CATALOG[0];
	const extras = COURSE_CATALOG.slice(1);

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-14">
			<div className="max-w-5xl mx-auto">
				<p className="text-xs uppercase tracking-[0.2em] text-orange-400 font-semibold">Eder Crea Webs</p>
				<h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">Area de Cursos</h1>
				<p className="mt-4 text-zinc-300 max-w-2xl">
					Aprende diseno y desarrollo web con clases practicas. Mira el temario y las caracteristicas del curso antes de comprar.
				</p>

				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href={`/${featured.slug}`}
						className="inline-flex items-center rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-5 py-3 transition-colors"
					>
						Ver detalles
					</Link>
					<Link
						href={`/${featured.slug}`}
						className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold px-5 py-3 transition-colors"
					>
						Entrar al curso
					</Link>
				</div>
				<p className="mt-3 text-sm text-zinc-400">
					Primero revisas detalles y temario. El acceso final al reproductor se habilita al comprar con tu cuenta.
				</p>

				<section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
					<p className="text-xs text-zinc-400">Curso destacado</p>
					<h2 className="mt-1 text-xl font-semibold">{featured.title}</h2>
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
				</section>

				{extras.length > 0 && (
					<section className="mt-6 flex flex-col gap-4">
						{extras.map((course) => (
							<Link
								key={course.id}
								href={`/${course.slug}`}
								className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 p-4 sm:p-5 transition-colors"
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
							</Link>
						))}
					</section>
				)}
			</div>
		</main>
	);
}
