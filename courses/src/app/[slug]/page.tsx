import { notFound } from "next/navigation";
import { COURSE_CATALOG } from "@/data/courses";
import LearningPlayer from "./LearningPlayer";

interface Props {
	params: { slug: string };
}

export default function CoursePage({ params }: Props) {
	const course = COURSE_CATALOG.find((c) => c.slug === params.slug);
	if (!course) notFound();
	return <LearningPlayer course={course} />;
}

export function generateStaticParams() {
	return COURSE_CATALOG.map((c) => ({ slug: c.slug }));
}
