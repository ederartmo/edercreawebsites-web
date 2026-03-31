"use client";

import { Check } from "lucide-react";
import type { Chapter } from "@/types";
import { formatTime } from "@/lib/utils";

interface ChapterSidebarProps {
	chapters: Chapter[];
	currentChapterIndex: number;
	currentTime: number;
	completedChapterIds: string[];
	xp: number;
	totalXP: number;
	onSeek: (time: number) => void;
}

export default function ChapterSidebar({
	chapters,
	currentChapterIndex,
	currentTime,
	completedChapterIds,
	xp,
	totalXP,
	onSeek,
}: ChapterSidebarProps) {
	return (
		<div className="flex flex-col h-full bg-zinc-900">
			{/* Header */}
			<div className="px-4 py-3 border-b border-zinc-800 shrink-0">
				<h2 className="text-sm font-semibold text-white">Contenido del curso</h2>
				<p className="text-xs text-zinc-400 mt-0.5">
					{completedChapterIds.length}/{chapters.length} completados&nbsp;·&nbsp;
					<span className="text-orange-400 font-medium">{xp}/{totalXP} XP</span>
				</p>
			</div>

			{/* Chapter list */}
			<div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
				{chapters.map((chapter, idx) => {
					const isActive = idx === currentChapterIndex;
					const isCompleted = completedChapterIds.includes(chapter.id);

					// Progress % within this chapter (for the left border indicator)
					const progressPct =
						isActive && chapter.durationSeconds > 0
							? Math.min(
									100,
									Math.max(
										0,
										((currentTime - chapter.startSeconds) / chapter.durationSeconds) * 100
									)
							  )
							: isCompleted
							? 100
							: 0;

					return (
						<button
							key={chapter.id}
							onClick={() => onSeek(chapter.startSeconds)}
							className={`w-full text-left px-3 py-2.5 flex gap-3 items-start transition-colors relative focus:outline-none ${
								isActive
									? "bg-orange-500/10"
									: "hover:bg-zinc-800/70"
							}`}
						>
							{/* Left progress bar */}
							<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-700 overflow-hidden">
								<div
									className="absolute top-0 left-0 w-full bg-orange-500 transition-none"
									style={{ height: `${progressPct}%` }}
								/>
							</div>

							{/* Status icon */}
							<div
								className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
									isCompleted
										? "bg-orange-500 text-white"
										: isActive
										? "border-2 border-orange-500 text-orange-400"
										: "border border-zinc-600 text-zinc-500"
								}`}
							>
								{isCompleted ? (
									<Check className="w-3 h-3 stroke-[3]" />
								) : (
									<span>{chapter.order}</span>
								)}
							</div>

							{/* Text */}
							<div className="flex-1 min-w-0">
								<p
									className={`text-xs leading-snug font-medium ${
										isActive ? "text-white" : isCompleted ? "text-zinc-300" : "text-zinc-400"
									}`}
								>
									{chapter.title}
								</p>
								<div className="flex items-center gap-2 mt-0.5">
									<span className="text-[10px] text-zinc-500 tabular-nums">
										{formatTime(chapter.startSeconds)}
									</span>
									<span className="text-[10px] text-orange-400 font-semibold">
										+{chapter.xpReward} XP
									</span>
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
