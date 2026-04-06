'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { COURSE_CATALOG } from '@/data/courses';
import CourseSalesPage from '@/components/course/CourseSalesPage';
import type { User } from '@supabase/supabase-js';

const STRIPE_LINK = 'https://buy.stripe.com/test_dRm6oG6Vr0ewd0S5Olak000';

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

	// Rutas publicas: home y catalogo siempre visibles, incluso sin login.
	if (!currentCourse || currentCourse.isFree) {
		return (
			<>
				{user && (
					<button
						onClick={handleLogout}
						className="fixed top-3 right-4 z-50 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
					>
						Cerrar sesion
					</button>
				)}
				{children}
			</>
		);
	}

	// Spinner mientras valida acceso al curso de pago
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
