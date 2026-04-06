import { notFound } from "next/navigation";
import { COURSE_CATALOG } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

interface Props {
	params: { slug: string };
}

export default function CourseDetailPage({ params }: Props) {
	const course = COURSE_CATALOG.find((c) => c.slug === params.slug);
	if (!course) notFound();
	return <CourseDetailClient course={course} />;
}

export function generateStaticParams() {
	return COURSE_CATALOG.map((c) => ({ slug: c.slug }));
}
