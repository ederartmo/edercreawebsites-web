import type { SupabaseClient, User } from "@supabase/supabase-js";
import { COURSE_CATALOG } from "@/data/courses";

export const PAID_KEY = "cursos_paid";
export const PAID_SLUGS_KEY = "cursos_paid_slugs";

function normalizeSlug(value: string): string {
	return value.trim().toLowerCase();
}

function extractMetadataSlugs(user: User): Set<string> {
	const raw = user.user_metadata?.[PAID_SLUGS_KEY];
	if (!Array.isArray(raw)) return new Set<string>();
	return new Set(raw.filter((v): v is string => typeof v === "string").map(normalizeSlug));
}

export async function fetchPurchasedSlugsFromDb(
	supabase: SupabaseClient,
	email: string,
): Promise<Set<string>> {
	const normalizedEmail = email.trim().toLowerCase();
	if (!normalizedEmail) return new Set<string>();

	const result = new Set<string>();

	const { data, error } = await supabase
		.from("course_access")
		.select("course_slug")
		.ilike("email", normalizedEmail);

	if (!error && Array.isArray(data)) {
		for (const row of data) {
			const slug = typeof row.course_slug === "string" ? normalizeSlug(row.course_slug) : "";
			if (slug) result.add(slug);
		}
	}

	return result;
}

export async function resolvePurchasedSlugs(
	supabase: SupabaseClient,
	user: User,
): Promise<Set<string>> {
	const slugs = extractMetadataSlugs(user);

	if (user.user_metadata?.[PAID_KEY] === true) {
		for (const course of COURSE_CATALOG) {
			if (!course.isFree) slugs.add(normalizeSlug(course.slug));
		}
	}

	if (user.email) {
		const dbSlugs = await fetchPurchasedSlugsFromDb(supabase, user.email);
		for (const slug of dbSlugs) slugs.add(slug);
	}

	return slugs;
}

export async function grantCourseAccess(
	supabase: SupabaseClient,
	user: User,
	courseSlug: string,
): Promise<Set<string>> {
	const nextSlugs = await resolvePurchasedSlugs(supabase, user);
	const normalizedSlug = normalizeSlug(courseSlug);
	nextSlugs.add(normalizedSlug);

	await supabase.auth.updateUser({
		data: {
			[PAID_KEY]: true,
			[PAID_SLUGS_KEY]: Array.from(nextSlugs),
		},
	});

	if (user.email) {
		await supabase.from("course_access").upsert(
			{
				email: user.email,
				course_slug: normalizedSlug,
			},
			{ onConflict: "email,course_slug" },
		);
	}

	return nextSlugs;
}

export function hasCourseAccess(
	user: User | null,
	courseSlug: string,
	isFree: boolean,
	purchasedSlugs: Set<string>,
): boolean {
	if (isFree) return true;
	if (!user) return false;
	return purchasedSlugs.has(normalizeSlug(courseSlug));
}
