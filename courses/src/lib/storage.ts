export interface Note {
	id: string;
	courseId: string;
	timestamp: number;
	text: string;
	createdAt: string;
}

const KEYS = {
	progress: "ec_progress",
	xp: "ec_xp",
	completedChapters: "ec_completed",
	notes: "ec_notes",
} as const;

function readJSON<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function writeJSON<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// storage unavailable (private mode, quota exceeded, etc.)
	}
}

// ── Progress ──────────────────────────────────────────────────────────────────

export function loadProgress(courseId: string): number {
	return readJSON<Record<string, number>>(KEYS.progress, {})[courseId] ?? 0;
}

export function saveProgress(courseId: string, currentTime: number): void {
	const record = readJSON<Record<string, number>>(KEYS.progress, {});
	record[courseId] = currentTime;
	writeJSON(KEYS.progress, record);
}

// ── XP ────────────────────────────────────────────────────────────────────────

export function loadXP(courseId: string): number {
	return readJSON<Record<string, number>>(KEYS.xp, {})[courseId] ?? 0;
}

export function addXP(courseId: string, amount: number): number {
	const record = readJSON<Record<string, number>>(KEYS.xp, {});
	const next = (record[courseId] ?? 0) + amount;
	record[courseId] = next;
	writeJSON(KEYS.xp, record);
	return next;
}

// ── Completed chapters ────────────────────────────────────────────────────────

export function loadCompletedChapters(courseId: string): string[] {
	return readJSON<Record<string, string[]>>(KEYS.completedChapters, {})[courseId] ?? [];
}

/** Returns true if the chapter was newly marked (false if already done). */
export function markChapterComplete(courseId: string, chapterId: string): boolean {
	const record = readJSON<Record<string, string[]>>(KEYS.completedChapters, {});
	const list = record[courseId] ?? [];
	if (list.includes(chapterId)) return false;
	record[courseId] = [...list, chapterId];
	writeJSON(KEYS.completedChapters, record);
	return true;
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export function loadNotes(courseId: string): Note[] {
	return readJSON<Record<string, Note[]>>(KEYS.notes, {})[courseId] ?? [];
}

export function addNote(courseId: string, timestamp: number, text: string): Note {
	const record = readJSON<Record<string, Note[]>>(KEYS.notes, {});
	const list = record[courseId] ?? [];
	const note: Note = {
		id: `note-${Date.now()}`,
		courseId,
		timestamp,
		text: text.trim(),
		createdAt: new Date().toISOString(),
	};
	record[courseId] = [...list, note].sort((a, b) => a.timestamp - b.timestamp);
	writeJSON(KEYS.notes, record);
	return note;
}

export function deleteNote(courseId: string, noteId: string): void {
	const record = readJSON<Record<string, Note[]>>(KEYS.notes, {});
	const list = record[courseId] ?? [];
	record[courseId] = list.filter((n) => n.id !== noteId);
	writeJSON(KEYS.notes, record);
}
