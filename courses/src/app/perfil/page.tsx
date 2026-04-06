"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface ProfileForm {
	fullName: string;
	location: string;
	age: string;
	email: string;
	promotions: boolean;
}

export default function PerfilPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [form, setForm] = useState<ProfileForm>({
		fullName: "",
		location: "",
		age: "",
		email: "",
		promotions: false,
	});

	useEffect(() => {
		const supabase = getSupabase();
		supabase.auth.getSession().then(({ data: { session } }) => {
			const currentUser = session?.user ?? null;
			setUser(currentUser);
			if (currentUser) {
				setForm({
					fullName: (currentUser.user_metadata?.full_name as string | undefined) ?? "",
					location: (currentUser.user_metadata?.location as string | undefined) ?? "",
					age: String(currentUser.user_metadata?.age ?? ""),
					email: currentUser.email ?? "",
					promotions: Boolean(currentUser.user_metadata?.promotions ?? false),
				});
			}
			setLoading(false);
		});
	}, []);

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!user) return;
		setSaving(true);
		setMessage("");
		const supabase = getSupabase();

		const { error } = await supabase.auth.updateUser({
			data: {
				full_name: form.fullName,
				location: form.location,
				age: form.age ? Number(form.age) : null,
				promotions: form.promotions,
			},
		});

		if (error) {
			setMessage("No se pudo guardar el perfil. Intenta de nuevo.");
		} else {
			setMessage("Perfil guardado correctamente.");
		}
		setSaving(false);
	}

	if (loading) {
		return <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">Cargando...</main>;
	}

	if (!user) {
		return (
			<main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
				<div className="mx-auto max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
					<h1 className="text-2xl font-semibold">Mi perfil</h1>
					<p className="mt-2 text-zinc-400">Necesitas iniciar sesion para editar tu perfil.</p>
					<Link href="/" className="mt-4 inline-flex rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400">
						Ir a cursos
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
			<div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
				<h1 className="text-2xl font-semibold">Mi perfil</h1>
				<p className="mt-2 text-sm text-zinc-400">Completa tu informacion personal para tu cuenta de cursos.</p>

				<form onSubmit={handleSave} className="mt-6 space-y-4">
					<div>
						<label className="mb-1 block text-sm text-zinc-300">Nombre completo</label>
						<input
							type="text"
							value={form.fullName}
							onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
							className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-orange-400"
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm text-zinc-300">Ubicacion</label>
							<input
								type="text"
								value={form.location}
								onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
								className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-orange-400"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm text-zinc-300">Edad</label>
							<input
								type="number"
								min={0}
								max={120}
								value={form.age}
								onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
								className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-orange-400"
							/>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-sm text-zinc-300">Correo</label>
						<input
							type="email"
							value={form.email}
							disabled
							className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-zinc-500"
						/>
					</div>
					<label className="flex items-center gap-2 text-sm text-zinc-300">
						<input
							type="checkbox"
							checked={form.promotions}
							onChange={(e) => setForm((prev) => ({ ...prev, promotions: e.target.checked }))}
							className="h-4 w-4"
						/>
						Aceptar recibir promociones
					</label>

					<div className="flex flex-wrap gap-3 pt-2">
						<button
							type="submit"
							disabled={saving}
							className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400 disabled:opacity-60"
						>
							{saving ? "Guardando..." : "Guardar perfil"}
						</button>
						<Link href="/" className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-zinc-500">
							Volver a cursos
						</Link>
					</div>

					{message ? <p className="text-sm text-zinc-300">{message}</p> : null}
				</form>
			</div>
		</main>
	);
}
