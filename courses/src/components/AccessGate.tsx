'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { COURSE_CATALOG } from '@/data/courses';
import CourseSalesPage from '@/components/course/CourseSalesPage';
import { grantCourseAccess, hasCourseAccess, resolvePurchasedSlugs } from '@/lib/courseAccess';
import type { User } from '@supabase/supabase-js';

const STRIPE_LINK = 'https://buy.stripe.com/test_dRm6oG6Vr0ewd0S5Olak000';

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
	const [menuOpen, setMenuOpen] = useState(false);
	const [theme, setTheme] = useState<'dark' | 'light'>('dark');
	const [avatarLoadError, setAvatarLoadError] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const params = useSearchParams();
	const normalizedPath = (() => {
		const withoutBasePath = pathname.replace(/^\/cursos(?=\/|$)/, '') || '/';
		if (withoutBasePath !== '/' && withoutBasePath.endsWith('/')) {
			return withoutBasePath.slice(0, -1);
		}
		return withoutBasePath;
	})();
	const currentCourse = COURSE_CATALOG.find((course) => normalizedPath === `/${course.slug}`) ?? null;
	const avatarUrl =
		(user?.user_metadata?.avatar_url as string | undefined) ||
		(user?.user_metadata?.picture as string | undefined) ||
		(user?.user_metadata?.photo_url as string | undefined);
	const displayName =
		(user?.user_metadata?.full_name as string | undefined) ||
		(user?.user_metadata?.name as string | undefined) ||
		user?.email ||
		'Cuenta';

	useEffect(() => {
		const savedTheme = window.localStorage.getItem('cursos_theme');
		const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
		setTheme(initialTheme);
		document.documentElement.classList.toggle('theme-light', initialTheme === 'light');
	}, []);

	useEffect(() => {
		const onClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, []);

	useEffect(() => {
		setAvatarLoadError(false);
	}, [avatarUrl]);

	useEffect(() => {
		const supabase = getSupabase();

		const evaluateAccess = async (u: User | null) => {
			setUser(u);
			if (!u) {
				const autoLoginRequested = params.get('login') === '1';
				if (autoLoginRequested && window.sessionStorage.getItem('cursos_auto_login') !== '1') {
					window.sessionStorage.setItem('cursos_auto_login', '1');
					setSigningIn(true);
					await getSupabase().auth.signInWithOAuth({
						provider: 'google',
						options: {
							redirectTo: `${window.location.origin}/cursos/`,
						},
					});
					return;
				}
				if (!autoLoginRequested) {
					window.sessionStorage.removeItem('cursos_auto_login');
				}
				setState('login');
				return;
			}

			window.sessionStorage.removeItem('cursos_auto_login');

			const isAdminUser = await checkIfAuthorized(u.email || '');
			setIsAdmin(isAdminUser);
			if (isAdminUser) {
				setState('open');
				return;
			}

			let slugs = await resolvePurchasedSlugs(supabase, u);

			if (params.get('acceso') === '1' && currentCourse) {
				slugs = await grantCourseAccess(supabase, u, currentCourse.slug);
				window.history.replaceState(null, '', window.location.pathname);
			}

			if (!currentCourse) {
				setState('open');
				return;
			}

			const canOpen = hasCourseAccess(u, currentCourse.slug, currentCourse.isFree, slugs);
			setState(canOpen ? 'open' : 'unpaid');
		};

		supabase.auth.getSession().then(({ data: { session } }) => {
			void evaluateAccess(session?.user ?? null);
		});

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			void evaluateAccess(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCourse?.slug, params]);

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
		setMenuOpen(false);
	}

	function handleThemeToggle() {
		const nextTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(nextTheme);
		document.documentElement.classList.toggle('theme-light', nextTheme === 'light');
		window.localStorage.setItem('cursos_theme', nextTheme);
		setMenuOpen(false);
	}

	function UserMenu() {
		if (!user) return null;

		return (
			<div ref={menuRef} className="fixed top-3 right-4 z-50">
				<button
					onClick={() => setMenuOpen((open) => !open)}
					className="h-10 w-10 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 shadow-lg"
					aria-label="Abrir menu de usuario"
				>
					{avatarUrl && !avatarLoadError ? (
						<img
							src={avatarUrl}
							alt={displayName}
							referrerPolicy="no-referrer"
							onError={() => setAvatarLoadError(true)}
							className="h-full w-full object-cover"
						/>
					) : (
						<span className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-200">
							{displayName.slice(0, 1).toUpperCase()}
						</span>
					)}
				</button>

				{menuOpen && (
					<div className="mt-2 w-56 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-sm shadow-2xl">
						<div className="border-b border-zinc-800 px-3 py-2 text-xs text-zinc-400">
							Sesion activa: <span className="text-zinc-200">{user.email}</span>
						</div>
						<Link
							href="/perfil"
							onClick={() => setMenuOpen(false)}
							className="block px-3 py-2 text-zinc-200 hover:bg-zinc-800"
						>
							Mi perfil
						</Link>
						{isAdmin && (
							<Link
								href="/admin"
								onClick={() => setMenuOpen(false)}
								className="block px-3 py-2 text-zinc-200 hover:bg-zinc-800"
							>
								Panel admin
							</Link>
						)}
						<button
							onClick={handleThemeToggle}
							className="block w-full px-3 py-2 text-left text-zinc-200 hover:bg-zinc-800"
						>
							Estilo: {theme === 'dark' ? 'Dark mode' : 'White mode'}
						</button>
						<Link
							href="/"
							onClick={() => setMenuOpen(false)}
							className="block px-3 py-2 text-zinc-200 hover:bg-zinc-800"
						>
							Cursos
						</Link>
						<Link
							href="/"
							onClick={() => setMenuOpen(false)}
							className="block px-3 py-2 text-zinc-200 hover:bg-zinc-800"
						>
							Inicio
						</Link>
						<button
							onClick={handleLogout}
							className="block w-full border-t border-zinc-800 px-3 py-2 text-left text-rose-300 hover:bg-zinc-800"
						>
							Cerrar sesion
						</button>
					</div>
				)}
			</div>
		);
	}

	if (state === 'loading') return null;

	// Rutas publicas y cursos gratis: visibles para todos.
	if (!currentCourse || currentCourse.isFree) {
		return (
			<>
				<UserMenu />
				{children}
			</>
		);
		}

	// Acceso concedido
	if (state === 'open') {
		return (
			<>
				<UserMenu />
				{children}
			</>
		);
	}

	// Pantalla unificada: login o compra
	const needsLogin = state === 'login';

	return (
		<CourseSalesPage
			course={currentCourse}
			stripeLink={STRIPE_LINK}
			needsLogin={needsLogin}
			signingIn={signingIn}
			userEmail={user?.email}
			onGoogleLogin={handleGoogleLogin}
			onLogout={handleLogout}
		/>
	);
}

export default function AccessGate({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={null}>
			<GateInner>{children}</GateInner>
		</Suspense>
	);
}
