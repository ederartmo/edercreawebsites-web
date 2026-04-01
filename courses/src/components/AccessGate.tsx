'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

const STRIPE_LINK = 'https://buy.stripe.com/test_dRm6oG6Vr0ewd0S5Olak000';
const THUMBNAIL =
	'https://customer-hwj8nccxmfdfhkme.cloudflarestream.com/d4fd5bfcdc82df502201185e303e7b62/thumbnails/thumbnail.jpg';

// La clave que guardamos en user_metadata para marcar la compra
const PAID_KEY = 'cursos_paid';

type State = 'loading' | 'open' | 'login' | 'unpaid';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
	.split(',')
	.map((value) => value.trim().toLowerCase())
	.filter(Boolean);

// Función para verificar si un email es admin/autorizado
async function checkIfAuthorized(email: string): Promise<boolean> {
	try {
		const normalizedEmail = email.trim().toLowerCase();
		if (!normalizedEmail) return false;

		if (ADMIN_EMAILS.includes(normalizedEmail)) {
			return true;
		}

		const supabase = getSupabase();

		// Flujo principal: tabla user_roles (la usada para roles)
		const { data: roleData, error: roleError } = await supabase
			.from('user_roles')
			.select('id, is_admin')
			.ilike('email', normalizedEmail)
			.maybeSingle();

		if (!roleError && roleData) {
			return roleData.is_admin === true;
		}

		// Compatibilidad con instalaciones anteriores
		const { data: authorizedData, error: authorizedError } = await supabase
			.from('authorized_users')
			.select('id, is_admin')
			.ilike('email', normalizedEmail)
			.maybeSingle();

		if (!authorizedError && authorizedData) {
			return authorizedData.is_admin === true;
		}

		if (roleError && roleError.code !== 'PGRST116') {
			console.warn('No se pudo validar admin en user_roles:', roleError.message);
		}

		if (authorizedError && authorizedError.code !== 'PGRST116') {
			console.warn('No se pudo validar admin en authorized_users:', authorizedError.message);
		}

		return false;
	} catch {
		return false;
	}
}

function GateInner({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<State>('loading');
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [signingIn, setSigningIn] = useState(false);
	const params = useSearchParams();

	useEffect(() => {
		// Solo se ejecuta en el browser; aquí es seguro inicializar Supabase
		const supabase = getSupabase();

		// Al montar: revisar sesión activa
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			const u = session?.user ?? null;
			setUser(u);

			if (!u) {
				setState('login');
				return;
			}

			// Verificar si es admin
			const isAdminUser = await checkIfAuthorized(u.email || '');
			setIsAdmin(isAdminUser);

			// Si es admin, darle acceso directo
			if (isAdminUser) {
				setState('open');
				return;
			}

			// Stripe redirigió con ?acceso=1 → marcar compra en metadata
			if (params.get('acceso') === '1') {
				await supabase.auth.updateUser({
					data: { [PAID_KEY]: true },
				});
				// Limpiar param de URL
				window.history.replaceState(null, '', window.location.pathname);
				setState('open');
				return;
			}

			// Verificar si ya pagó
			const paid = u.user_metadata?.[PAID_KEY] === true;
			setState(paid ? 'open' : 'unpaid');
		});

		// Escuchar cambios de sesión (regreso del OAuth callback)
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			const u = session?.user ?? null;
			setUser(u);
			if (!u) {
				setState('login');
				return;
			}
			checkIfAuthorized(u.email || '').then((isAdminUser) => {
				setIsAdmin(isAdminUser);
				if (isAdminUser) {
					setState('open');
					return;
				}
				const paid = u.user_metadata?.[PAID_KEY] === true;
				setState(paid ? 'open' : 'unpaid');
			});
		});

		return () => subscription.unsubscribe();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleGoogleLogin() {
		setSigningIn(true);
		await getSupabase().auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.href,
			},
		});
	}

	async function handleLogout() {
		await getSupabase().auth.signOut();
		setState('login');
		setUser(null);
	}

	// Spinner mientras carga
	if (state === 'loading') return null;

	// Acceso concedido
	if (state === 'open') {
		return (
			<>
				{/* Botón de logout discreto en esquina superior derecha */}
				<button
					onClick={handleLogout}
					className="fixed top-3 right-4 z-50 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
				>
					Cerrar sesión
				</button>
				{children}
			</>
		);
	}

	// Pantalla unificada: login o compra
	const needsLogin = state === 'login';

	return (
		<main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 py-14">
			<div className="w-full max-w-lg">
				<p className="text-xs uppercase tracking-[0.2em] text-orange-400 font-semibold text-center mb-4">
					Eder Crea Webs
				</p>

				<div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
					{/* Thumbnail */}
					<div className="aspect-video w-full overflow-hidden">
						<img
							src={THUMBNAIL}
							alt="Disena tu primer sitio web desde cero"
							className="w-full h-full object-cover"
						/>
					</div>

					<div className="p-6">
						<h1 className="text-xl font-bold leading-snug">
							Disena tu primer sitio web desde cero
						</h1>
						<p className="mt-2 text-sm text-zinc-400">
							HTML · CSS · JavaScript — sin frameworks, con identidad propia.
						</p>

						{/* Beneficios */}
						<ul className="mt-5 space-y-2 text-sm text-zinc-300">
							{[
								'+55 min de video en alta calidad',
								'Indice interactivo por capitulo',
								'Notas y progreso sincronizados con tu cuenta',
								'Acceso de por vida, sin mensualidad',
							].map((b) => (
								<li key={b} className="flex items-start gap-2">
									<span className="text-orange-400 font-bold shrink-0 mt-0.5">✓</span>
									{b}
								</li>
							))}
						</ul>

						{needsLogin ? (
							/* ---- Estado: sin sesión → iniciar sesión ---- */
							<>
								<p className="mt-6 text-center text-sm text-zinc-400">
									Inicia sesion para acceder al curso
								</p>
								<button
									onClick={handleGoogleLogin}
									disabled={signingIn}
									className="mt-3 flex items-center justify-center gap-3 w-full rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm py-3.5 transition-colors disabled:opacity-60"
								>
									{/* Logo de Google en SVG inline para no depender de assets externos */}
									<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
										<path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
										<path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
										<path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
									</svg>
									{signingIn ? 'Redirigiendo...' : 'Continuar con Google'}
								</button>
							</>
						) : (
							/* ---- Estado: sesión activa (admin o necesita compra) ---- */
							<>
								{isAdmin ? (
									/* Usuario es admin - acceso automático */
									<>
										<p className="mt-5 text-sm text-zinc-300 text-center">
											👋 Bienvenido <span className="text-white font-medium">{user?.email}</span>
										</p>
										<p className="mt-2 text-xs text-orange-400 text-center font-medium">
											✓ Acceso de administrador activado
										</p>
									</>
								) : (
									/* Usuario normal - necesita comprar */
									<>
										<p className="mt-5 text-sm text-zinc-400 text-center">
											Hola <span className="text-white font-medium">{user?.email}</span> —
											adquiere el curso para obtener acceso.
										</p>
										<a
											href={STRIPE_LINK}
											className="mt-4 flex items-center justify-center w-full rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-base py-4 transition-colors"
										>
											Comprar acceso
										</a>
										<p className="mt-2 text-center text-xs text-zinc-500">
											Pago seguro con Stripe · Acceso inmediato al completar
										</p>
										<button
											onClick={handleLogout}
											className="mt-4 w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
										>
											Usar otra cuenta
										</button>
									</>
								)}
							</>
						)}
					</div>
				</div>

				<p className="mt-5 text-center text-xs text-zinc-600">
					¿Problemas para acceder?{' '}
					<a
						href="https://wa.link/eah465"
						target="_blank"
						rel="noopener noreferrer"
						className="text-zinc-400 hover:text-white underline underline-offset-4"
					>
						Soporte por WhatsApp
					</a>
				</p>
			</div>
		</main>
	);
}

export default function AccessGate({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={null}>
			<GateInner>{children}</GateInner>
		</Suspense>
	);
}
