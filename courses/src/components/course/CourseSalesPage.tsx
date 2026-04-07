'use client';

import { BookOpen, ChevronDown, Clock3, Layers3, PlayCircle, Star, Trophy, Video } from 'lucide-react';
import type { Course, Chapter } from '@/types';
import { formatTime } from '@/lib/utils';

interface CourseSalesPageProps {
	course: Course;
	stripeLink: string;
	needsLogin: boolean;
	signingIn: boolean;
	userEmail?: string;
	onGoogleLogin: () => void;
	onLogout: () => void;
}

interface ChapterGroup {
	title: string;
	chapters: Chapter[];
	totalDurationSeconds: number;
}

function formatPublishedDate(date: string): string {
	try {
		return new Intl.DateTimeFormat('es-MX', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date));
	} catch {
		return date;
	}
}

function buildGroups(chapters: Chapter[]): ChapterGroup[] {
	const groups: ChapterGroup[] = [];
	const groupSize = 12;

	for (let index = 0; index < chapters.length; index += groupSize) {
		const groupChapters = chapters.slice(index, index + groupSize);
		groups.push({
			title: `Modulo ${groups.length + 1}`,
			chapters: groupChapters,
			totalDurationSeconds: groupChapters.reduce((sum, chapter) => sum + chapter.durationSeconds, 0),
		});
	}

	return groups;
}

export default function CourseSalesPage({
	course,
	stripeLink,
	needsLogin,
	signingIn,
	userEmail,
	onGoogleLogin,
	onLogout,
}: CourseSalesPageProps) {
	const groups = buildGroups(course.chapters);
	const featuredChapters = course.chapters.slice(0, 5);
	const accessPanel = (
		<>
			<div className="overflow-hidden rounded-[28px] border border-emerald-500/20 bg-zinc-950/90 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm">
				<div className="p-5">
					<p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300">Acceso al curso</p>
					<h3 className="mt-3 text-xl font-semibold text-white">Diseña y vende mejor tu trabajo web</h3>
					<p className="mt-2 text-sm leading-6 text-zinc-400">
						Revisa el temario y las caracteristicas del curso antes de comprar. Cuando quieras, puedes activar tu acceso completo.
					</p>

					<div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
						<p className="text-xs text-zinc-500">Precio promocional</p>
						<div className="mt-2 flex items-end gap-3">
							<span className="text-lg text-zinc-500 line-through">$2000</span>
							<p className="text-4xl font-semibold text-white">$1200</p>
						</div>
						<p className="mt-1 text-xs text-emerald-300">Precio real: $1200 MXN despues de la promo</p>
						<p className="mt-1 text-xs text-zinc-500">Acceso de por vida</p>
					</div>

					<div className="mt-5 space-y-3">
						{needsLogin ? (
							<button
								onClick={onGoogleLogin}
								disabled={signingIn}
								className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:opacity-60"
							>
								<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
									<path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
									<path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
									<path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
									<path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
								</svg>
								{signingIn ? 'Redirigiendo...' : 'Entrar con Google para ver el curso'}
							</button>
						) : (
							<>
								<a
									href={stripeLink}
									className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
								>
									Comprar acceso ahora
								</a>
								<button
									onClick={onLogout}
									className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
								>
									Usar otra cuenta
								</button>
							</>
						)}
					</div>

					{userEmail ? (
						<p className="mt-4 text-xs leading-5 text-zinc-500">
							Sesion activa con <span className="font-medium text-zinc-300">{userEmail}</span>
						</p>
					) : null}

					<div className="mt-6 space-y-3 border-t border-white/8 pt-5 text-sm text-zinc-300">
						<div className="flex items-start gap-3">
							<span className="mt-0.5 text-emerald-300">✓</span>
							<span>Indice completo por capitulo y avance guardado</span>
						</div>
						<div className="flex items-start gap-3">
							<span className="mt-0.5 text-emerald-300">✓</span>
							<span>Video HD, notas personales y tareas dentro del reproductor</span>
						</div>
						<div className="flex items-start gap-3">
							<span className="mt-0.5 text-emerald-300">✓</span>
							<span>Acceso de por vida sin mensualidades</span>
						</div>
					</div>
				</div>
			</div>

			<p className="mt-4 text-center text-xs text-zinc-600">
				Necesitas ayuda para comprar o entrar?{' '}
				<a
					href="https://wa.link/eah465"
					target="_blank"
					rel="noopener noreferrer"
					className="text-zinc-400 underline underline-offset-4 hover:text-white"
				>
					Soporte por WhatsApp
				</a>
			</p>
		</>
	);

	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#09090b_42%,_#111827_100%)] text-white">
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
					<div className="space-y-8">
						<section className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/70 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
							<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
								<div className="p-6 sm:p-8 lg:p-10">
									<div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
										<span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
											Curso premium
										</span>
										<span>Publicado el {formatPublishedDate(course.publishedAt)}</span>
										<span>{course.level}</span>
									</div>

									<h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
										{course.title}
									</h1>
									<p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
										{course.description}
									</p>

									<div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-200">
										<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
											<Clock3 className="h-4 w-4 text-orange-400" />
											{formatTime(course.totalDurationSeconds)} de contenido
										</div>
										<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
											<Layers3 className="h-4 w-4 text-orange-400" />
											{course.chapters.length} lecciones
										</div>
										<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
											<Star className="h-4 w-4 fill-orange-400 text-orange-400" />
											Indice por capitulo
										</div>
										<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
											<Trophy className="h-4 w-4 text-orange-400" />
											{course.xpTotal} XP totales
										</div>
									</div>

									<div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
										{featuredChapters.map((chapter) => (
											<div
												key={chapter.id}
												className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
											>
												<p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
													Capitulo {chapter.order}
												</p>
												<p className="mt-2 text-sm font-medium leading-6 text-zinc-100">
													{chapter.title}
												</p>
												<p className="mt-3 text-xs text-zinc-400">
													Empieza en {formatTime(chapter.startSeconds)}
												</p>
											</div>
										))}
									</div>
								</div>

								<div className="border-t border-white/10 bg-gradient-to-b from-orange-500/15 to-transparent p-6 lg:border-l lg:border-t-0 lg:p-5">
									<div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="aspect-video w-full object-cover"
										/>
									</div>
									<div className="mt-5 space-y-3 text-sm text-zinc-300">
										<div className="flex items-center gap-2">
											<Video className="h-4 w-4 text-orange-400" />
											Video principal del curso
										</div>
										<div className="flex items-center gap-2">
											<BookOpen className="h-4 w-4 text-orange-400" />
											Notas y avance guardado
										</div>
										<div className="flex items-center gap-2">
											<PlayCircle className="h-4 w-4 text-orange-400" />
											Acceso inmediato despues del pago
										</div>
									</div>
								</div>
							</div>
						</section>

						<section className="lg:hidden">
							{accessPanel}
						</section>

						<section className="rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 sm:p-7">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
								<div>
									<p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300">Indice del curso</p>
									<h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
										Asi se ve el contenido antes de comprar
									</h2>
									<p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
										Una vista completa de lo que incluye el curso: capitulos ordenados, tiempos de inicio y una estructura mucho mas clara para venderlo.
									</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
									<span className="text-white font-semibold">{groups.length}</span> modulos
									<span className="mx-2 text-zinc-600">/</span>
									<span className="text-white font-semibold">{course.chapters.length}</span> clases
								</div>
							</div>

							<div className="mt-6 space-y-4">
								{groups.map((group, groupIndex) => (
									<details
										key={group.title}
										open={groupIndex === 0}
										className="group overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-zinc-900 to-zinc-950"
									>
										<summary className="flex cursor-pointer list-none flex-col gap-3 bg-white/[0.02] px-5 py-4 marker:content-none sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
											<div>
												<p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{group.title}</p>
												<h3 className="mt-1 text-lg font-semibold text-white">
													Bloque {groupIndex + 1} del recorrido
												</h3>
											</div>
											<div className="flex items-center justify-between gap-3 sm:justify-end">
												<div className="flex flex-wrap gap-2 text-xs text-zinc-400">
													<span className="rounded-full bg-white/[0.04] px-3 py-1.5">
														{group.chapters.length} clases
													</span>
													<span className="rounded-full bg-white/[0.04] px-3 py-1.5">
														{formatTime(group.totalDurationSeconds)}
													</span>
												</div>
												<span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-transform duration-200 group-open:rotate-180">
													<ChevronDown className="h-5 w-5" />
												</span>
											</div>
										</summary>

										<div className="divide-y divide-white/6 border-t border-white/6">
											{group.chapters.map((chapter) => (
												<div
													key={chapter.id}
													className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-4 py-3.5 sm:px-5"
												>
													<div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-zinc-300">
														{chapter.order}
													</div>
													<div>
														<p className="text-sm font-medium leading-6 text-zinc-100">
															{chapter.title}
														</p>
														<p className="mt-1 text-xs text-zinc-500">
															Inicio {formatTime(chapter.startSeconds)}
														</p>
													</div>
													<div className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-300">
														+{chapter.xpReward} XP
													</div>
												</div>
											))}
										</div>
									</details>
								))}
							</div>
						</section>
					</div>

					<aside className="hidden lg:sticky lg:top-6 lg:block">
						{accessPanel}
					</aside>
				</div>
			</div>
		</main>
	);
}