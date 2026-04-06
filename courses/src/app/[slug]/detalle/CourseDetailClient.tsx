"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import CourseSalesPage from "@/components/course/CourseSalesPage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getSupabase } from "@/lib/supabase";
import { hasCourseAccess, resolvePurchasedSlugs } from "@/lib/courseAccess";
import type { Course } from "@/types";

const STRIPE_LINK = "https://buy.stripe.com/test_dRm6oG6Vr0ewd0S5Olak000";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
	.split(",")
	.map((v) => v.trim().toLowerCase())
	.filter(Boolean);

async function checkIfAuthorized(email: string): Promise<boolean> {
	try {
		const normalizedEmail = email.trim().toLowerCase();
		if (!normalizedEmail) return false;
		if (ADMIN_EMAILS.includes(normalizedEmail)) return true;
		const { getSupabase: _gs } = await import("@/lib/supabase");
		const supabase = _gs();
		const { data: roleData } = await supabase
			.from("user_roles")
			.select("is_admin")
			.ilike("email", normalizedEmail)
			.maybeSingle();
		if (roleData?.is_admin === true) return true;
		const { data: authData } = await supabase
			.from("authorized_users")
			.select("is_admin")
			.ilike("email", normalizedEmail)
			.maybeSingle();
		return authData?.is_admin === true;
	} catch {
		return false;
	}
}

interface Props {
	course: Course;
}

export default function CourseDetailClient({ course }: Props) {
	const [user, setUser] = useState<User | null>(null);
	const [needsLogin, setNeedsLogin] = useState(true);
	const [hasAccess, setHasAccess] = useState(false);
	const [signingIn, setSigningIn] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = getSupabase();

		const evaluate = async (nextUser: User | null) => {
			setUser(nextUser);

			if (!nextUser) {
				setNeedsLogin(true);
				setHasAccess(false);
				setLoading(false);
				return;
			}

			const isAdmin = await checkIfAuthorized(nextUser.email ?? "");
			if (isAdmin) {
				setNeedsLogin(false);
				setHasAccess(true);
				setLoading(false);
				return;
			}
			const slugs = await resolvePurchasedSlugs(supabase, nextUser);
			const canOpen = hasCourseAccess(nextUser, course.slug, course.isFree, slugs);
			setNeedsLogin(false);
			setHasAccess(canOpen);
			setLoading(false);
		};

		supabase.auth.getSession().then(({ data: { session } }) => {
			void evaluate(session?.user ?? null);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			void evaluate(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [course.isFree, course.slug]);

	async function handleGoogleLogin() {
		setSigningIn(true);
		await getSupabase().auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: window.location.href,
			},
		});
	}

	async function handleLogout() {
		await getSupabase().auth.signOut();
		setUser(null);
		setNeedsLogin(true);
		setHasAccess(false);
	}

	if (loading) return null;

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-4 py-3">
				<Breadcrumb items={[
					{ label: "inicio", href: "/", external: true },
					{ label: "cursos", href: "/" },
					{ label: course.title },
				]} />
			</header>
			<CourseSalesPage
				course={course}
				stripeLink={STRIPE_LINK}
				needsLogin={needsLogin}
				hasAccess={hasAccess}
				playerHref={`/${course.slug}/`}
				signingIn={signingIn}
				userEmail={user?.email}
				onGoogleLogin={handleGoogleLogin}
				onLogout={handleLogout}
			/>
		</>
	);
}
