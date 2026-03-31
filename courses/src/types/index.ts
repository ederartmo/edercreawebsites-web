export type CourseLevel = "principiante" | "intermedio" | "avanzado";

export interface ChapterTimelineItem {
	title: string;
	timestamp: string;
	xpReward?: number;
	pauseMessage?: string;
}

export interface Chapter {
	id: string;
	courseId: string;
	order: number;
	title: string;
	startSeconds: number;
	endSeconds: number;
	durationSeconds: number;
	xpReward: number;
	pauseMessage?: string;
}

export interface Course {
	id: string;
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	instructor: string;
	instructorAvatar: string;
	thumbnail: string;
	videoUrl: string;
	youtubeVideoId?: string;
	subtitleUrl?: string;
	totalDurationSeconds: number;
	level: CourseLevel;
	tags: string[];
	xpTotal: number;
	publishedAt: string;
	isFree: boolean;
	ambientMusicUrl?: string;
	chapters: Chapter[];
}

