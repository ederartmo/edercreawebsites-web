"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { COURSE_CATALOG } from "@/data/courses";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
	.split(",")
	.map((v) => v.trim().toLowerCase())
	.filter(Boolean);

async function checkIfAdmin(email: string): Promise<boolean> {
	const normalizedEmail = email.trim().toLowerCase();
	if (!normalizedEmail) return false;
	if (ADMIN_EMAILS.includes(normalizedEmail)) return true;

	const supabase = getSupabase();

	const { data: roleData } = await supabase
		.from("user_roles")
		.select("is_admin")
		.ilike("email", normalizedEmail)
		.maybeSingle();
	if (roleData) return roleData.is_admin === true;

	const { data: authData } = await supabase
		.from("authorized_users")
		.select("is_admin")
		.ilike("email", normalizedEmail)
		.maybeSingle();
	if (authData) return authData.is_admin === true;

	return false;
}

interface ViewCount {
	course_slug: string;
	count: number;
}

export default function AdminPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [unauthorized, setUnauthorized] = useState(false);
	const [viewCounts, setViewCounts] = useState<ViewCount[]>([]);
	const [fetchError, setFetchError] = useState<string | null>(null);

	useEffect(() => {
		const run = async () => {
			const supabase = getSupabase();
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user) {
				setUnauthorized(true);
				setLoading(false);
				return;
			}

			const isAdmin = await checkIfAdmin(session.user.email ?? "");
			if (!isAdmin) {
				setUnauthorized(true);
				setLoading(false);
				return;
			}

			setUser(session.user);

			const { data, error } = await supabase
				.from("video_views")
				.select("course_slug");

			if (error) {
				setFetchError(error.message);
				setLoading(false);
				return;
			}

			const counts: Record<string, number> = {};
			for (const row of data ?? []) {
				counts[row.course_slug] = (counts[row.course_slug] ?? 0) + 1;
			}

			setViewCounts(
				Object.entries(counts)
					.map(([course_slug, count]) => ({ course_slug, count }))
					.sort((a, b) => b.count - a.count),
			);
			setLoading(false);
		};

		void run();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
				<span className="text-zinc-400 text-sm">Cargando...</span>
			</div>
		);
	}

	if (unauthorized) {
		return (
			<div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
				<p className="text-zinc-400 text-sm">Acceso restringido</p>
				<Link href="/" className="text-blue-400 text-sm hover:underline">
					Volver al inicio
				</Link>
			</div>
		);
	}

	const totalViews = viewCounts.reduce((sum, v) => sum + v.count, 0);

	return (
		<div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="mb-8 flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-white">Panel de administración</h1>
						<p className="text-sm text-zinc-500 mt-1">Visualizaciones de video</p>
					</div>
					<div className="text-right">
						<p className="text-xs text-zinc-500">Sesión activa</p>
						<p className="text-sm text-zinc-300">{user?.email}</p>
					</div>
				</div>

				{/* Summary card */}
				<div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex items-center justify-between">
					<span className="text-sm text-zinc-400">Total de reproducciones</span>
					<span className="text-3xl font-bold text-white">{totalViews}</span>
				</div>

				{fetchError && (
					<div className="mb-4 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
						Error al cargar datos: {fetchError}
					</div>
				)}

				{/* Table */}
				<div className="overflow-hidden rounded-xl border border-zinc-800">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-zinc-800 bg-zinc-900 text-left">
								<th className="px-4 py-3 text-zinc-400 font-medium">Curso</th>
								<th className="px-4 py-3 text-zinc-400 font-medium text-right">
									Visualizaciones
								</th>
							</tr>
						</thead>
						<tbody>
							{COURSE_CATALOG.map((course) => {
								const entry = viewCounts.find((v) => v.course_slug === course.slug);
								const count = entry?.count ?? 0;
								return (
									<tr
										key={course.slug}
										className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors"
									>
										<td className="px-4 py-4">
											<div className="font-medium text-zinc-100">{course.title}</div>
											<div className="text-xs text-zinc-500 mt-0.5">{course.slug}</div>
										</td>
										<td className="px-4 py-4 text-right">
											<span className="text-2xl font-bold text-white">{count}</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="mt-6 flex items-center justify-between">
					<p className="text-xs text-zinc-600">
						Cada apertura del reproductor cuenta como una visualización.
					</p>
					<Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
						← Volver
					</Link>
				</div>
			</div>
		</div>
	);
}
