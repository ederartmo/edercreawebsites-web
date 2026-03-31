import Link from "next/link";
import { COURSE_CATALOG } from "@/data/courses";

export default function CatalogoPage() {
	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between gap-4 mb-8">
					<h1 className="text-3xl font-bold">Catalogo</h1>
					<Link href="/" className="text-sm text-zinc-300 hover:text-white underline underline-offset-4">
						Volver al inicio
					</Link>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{COURSE_CATALOG.map((course) => (
						<article key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
							<div className="aspect-video bg-zinc-800">
								<img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
							</div>
							<div className="p-4">
								<h2 className="font-semibold leading-snug">{course.title}</h2>
								<p className="mt-2 text-sm text-zinc-400 line-clamp-2">{course.subtitle}</p>
								<Link
									href={`/${course.slug}`}
									className="mt-4 inline-flex rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
								>
									Entrar
								</Link>
							</div>
						</article>
					))}
				</div>
			</div>
		</main>
	);
}
