import type { Chapter, ChapterTimelineItem } from "@/types";

export function formatTime(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";

	const seconds = Math.floor(totalSeconds);
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
	}

	return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function parseTimestampToSeconds(timestamp: string): number {
	const clean = timestamp.trim();
	const parts = clean.split(":").map((part) => Number.parseInt(part, 10));

	if (parts.some((part) => Number.isNaN(part) || part < 0)) {
		throw new Error(`Timestamp invalido: ${timestamp}`);
	}

	if (parts.length === 2) {
		const [minutes, seconds] = parts;
		return minutes * 60 + seconds;
	}

	if (parts.length === 3) {
		const [hours, minutes, seconds] = parts;
		return hours * 3600 + minutes * 60 + seconds;
	}

	throw new Error(`Formato de timestamp no soportado: ${timestamp}`);
}

export function buildChaptersFromTimeline(
	courseId: string,
	timeline: ChapterTimelineItem[],
	totalDurationSeconds: number
): Chapter[] {
	if (!Array.isArray(timeline) || timeline.length === 0) return [];

	const starts = timeline.map((item) => parseTimestampToSeconds(item.timestamp));

	return timeline.map((item, index) => {
		const startSeconds = starts[index];
		const nextStart = starts[index + 1] ?? totalDurationSeconds;
		const endSeconds = Math.max(startSeconds, nextStart);
		const durationSeconds = Math.max(0, endSeconds - startSeconds);

		return {
			id: `ch-${String(index + 1).padStart(2, "0")}`,
			courseId,
			order: index + 1,
			title: item.title,
			startSeconds,
			endSeconds,
			durationSeconds,
			xpReward: item.xpReward ?? 20,
			pauseMessage: item.pauseMessage
		};
	});
}

export function uuid(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
		const random = (Math.random() * 16) | 0;
		const value = char === "x" ? random : (random & 0x3) | 0x8;
		return value.toString(16);
	});
}

export function calcPercent(currentTime: number, duration: number): number {
	if (!duration || duration <= 0) return 0;
	return Math.min(100, Math.round((currentTime / duration) * 100));
}

export function getActiveChapterIndex(currentTime: number, chapters: Chapter[]): number {
	let active = 0;

	for (let i = 0; i < chapters.length; i += 1) {
		if (currentTime >= chapters[i].startSeconds) {
			active = i;
		}
	}

	return active;
}

