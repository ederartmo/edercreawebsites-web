"use client";

import { useState, useCallback, useEffect } from "react";
import type { Course, Chapter } from "@/types";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { loadNotes, addNote as storageAddNote, deleteNote as storageDeleteNote } from "@/lib/storage";
import type { Note } from "@/lib/storage";
import VideoPlayer, { type ViewMode } from "@/components/player/VideoPlayer";
import ChapterSidebar from "@/components/player/ChapterSidebar";
import NotePanel from "@/components/player/NotePanel";
import SubmissionPanel from "@/components/player/SubmissionPanel";
import XPBar from "@/components/ui/XPBar";
import XPToast from "@/components/ui/XPToast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BookOpen, ClipboardList, Menu, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Tab = "notas" | "tareas";

interface LearningPlayerProps {
	course: Course;
}

export default function LearningPlayer({ course }: LearningPlayerProps) {
	const [activeTab, setActiveTab] = useState<Tab>("notas");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [viewMode, setViewMode] = useState<ViewMode>("normal");
	const [notes, setNotes] = useState<Note[]>(() => loadNotes(course.id));
	const [xpToast, setXpToast] = useState<{ xp: number; title: string } | null>(null);

	const handleChapterComplete = useCallback((chapter: Chapter, xpEarned: number) => {
		setXpToast({ xp: xpEarned, title: chapter.title });
	}, []);

	const player = useVideoPlayer({
		hlsUrl: course.videoUrl,
		chapters: course.chapters,
		courseId: course.id,
		onChapterComplete: handleChapterComplete,
		subtitleUrl: course.subtitleUrl,
	});

	const currentChapter = course.chapters[player.currentChapterIndex];
	const pauseMessage = !player.isPlaying ? currentChapter?.pauseMessage : undefined;

	// Registrar visualización una sola vez al abrir el reproductor
	useEffect(() => {
		const supabase = getSupabase();
		supabase.auth.getSession().then(({ data: { session } }) => {
			void supabase.from("video_views").insert({
				course_slug: course.slug,
				user_id: session?.user?.id ?? null,
			});
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [course.slug]);

	const handleAddNote = useCallback(
		(timestamp: number, text: string) => {
			const note = storageAddNote(course.id, timestamp, text);
			setNotes((prev) => [...prev, note].sort((a, b) => a.timestamp - b.timestamp));
		},
		[course.id]
	);

	const handleDeleteNote = useCallback(
		(noteId: string) => {
			storageDeleteNote(course.id, noteId);
			setNotes((prev) => prev.filter((n) => n.id !== noteId));
		},
		[course.id]
	);

	return (
		<div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
			{/* Top header */}
			<header className="shrink-0 px-4 py-2 border-b border-zinc-800 flex items-center gap-3">
				<Breadcrumb items={[
					{ label: "inicio", href: "/", external: true },
					{ label: "cursos", href: "/" },
					{ label: course.title },
				]} />
				<div className="flex-1 min-w-0" />
				{/* Mobile sidebar toggle */}
				<button
					onClick={() => setSidebarOpen((v) => !v)}
					className="md:hidden p-1.5 text-zinc-400 hover:text-white"
					aria-label="Indice del curso"
				>
					{sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
				</button>
			</header>

			{/* XP progress bar */}
			<XPBar
				currentXP={player.xp}
				totalXP={course.xpTotal}
				completedCount={player.completedChapterIds.length}
				totalChapters={course.chapters.length}
			/>

			{/* Main body */}
			<div className="flex flex-1 min-h-0 overflow-hidden relative">
				{/* Left: video + bottom tabs */}
				<div className="flex-1 flex flex-col min-w-0">
					{/* Video */}
					<VideoPlayer
						videoRef={player.videoRef}
						containerRef={player.containerRef}
						chapters={course.chapters}
						pauseMessage={pauseMessage}
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						isPlaying={player.isPlaying}
						currentTime={player.currentTime}
						duration={player.duration}
						volume={player.volume}
						isMuted={player.isMuted}
						isFullscreen={player.isFullscreen}
						playbackRate={player.playbackRate}
						qualityOptions={player.qualityOptions}
						selectedQuality={player.selectedQuality}
						activeQualityLabel={player.activeQualityLabel}
						canSelectQuality={player.canSelectQuality}
						isBuffering={player.isBuffering}
						bufferedEnd={player.bufferedEnd}
						showControls={player.showControls}
						currentChapterIndex={player.currentChapterIndex}
						xp={player.xp}
						completedChapterIds={player.completedChapterIds}
						togglePlay={player.togglePlay}
						seek={player.seek}
						setVolume={player.setVolume}
						toggleMute={player.toggleMute}
						setPlaybackRate={player.setPlaybackRate}
						setQualityLevel={player.setQualityLevel}
						toggleFullscreen={player.toggleFullscreen}
						handleMouseActivity={player.handleMouseActivity}
					toggleSubtitles={player.toggleSubtitles}
					showSubtitles={player.showSubtitles}
					subtitlesAvailable={player.subtitlesAvailable}
					subtitleUrl={course.subtitleUrl}
				/>

				{/* Tab navigation */}
					<div className="flex border-b border-zinc-800 shrink-0 bg-zinc-950">
						{(["notas", "tareas"] as Tab[]).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
									activeTab === tab
										? "border-orange-500 text-white"
										: "border-transparent text-zinc-400 hover:text-white"
								}`}
							>
								{tab === "notas" ? (
									<><BookOpen className="w-4 h-4" /> Notas</>
								) : (
									<><ClipboardList className="w-4 h-4" /> Tareas</>
								)}
							</button>
						))}
					</div>

					{/* Tab content */}
					<div className="flex-1 overflow-y-auto min-h-0 bg-zinc-950">
						{activeTab === "notas" ? (
							<NotePanel
								notes={notes}
								currentTime={player.currentTime}
								onAddNote={handleAddNote}
								onDeleteNote={handleDeleteNote}
								onSeekToNote={player.seek}
							/>
						) : (
							<SubmissionPanel />
						)}
					</div>
				</div>

				{/* Right: chapter sidebar — hidden in theater/fullscreen modes on desktop */}
				<aside
					className={`w-72 xl:w-80 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900
						md:relative
						${viewMode === "theater" || viewMode === "fullscreen" ? "md:hidden" : "md:flex"}
						${sidebarOpen ? "absolute inset-y-0 right-0 z-20 flex" : "hidden"}`}
				>
					<ChapterSidebar
						chapters={course.chapters}
						currentChapterIndex={player.currentChapterIndex}
						currentTime={player.currentTime}
						completedChapterIds={player.completedChapterIds}
						xp={player.xp}
						totalXP={course.xpTotal}
						onSeek={(t) => { player.seek(t); setSidebarOpen(false); }}
					/>
				</aside>
			</div>

			{/* XP Toast */}
			<XPToast
				xp={xpToast?.xp ?? 0}
				chapterTitle={xpToast?.title ?? ""}
				visible={xpToast !== null}
				onHide={() => setXpToast(null)}
			/>
		</div>
	);
}
