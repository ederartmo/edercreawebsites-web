"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, RectangleHorizontal, SquarePlay } from "lucide-react";
import type { Chapter } from "@/types";
import { formatTime, calcPercent } from "@/lib/utils";
import PauseMessage from "@/components/ui/PauseMessage";
import type { PlayerState, PlayerControls } from "@/hooks/useVideoPlayer";

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export type ViewMode = "normal" | "theater" | "fullscreen";

interface VideoPlayerProps extends PlayerState, PlayerControls {
	videoRef: React.RefObject<HTMLVideoElement>;
	containerRef: React.RefObject<HTMLDivElement>;
	chapters: Chapter[];
	pauseMessage?: string;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
}

export default function VideoPlayer({
	videoRef,
	containerRef,
	chapters,
	pauseMessage,
	isPlaying,
	currentTime,
	duration,
	volume,
	isMuted,
	isFullscreen,
	playbackRate,
	qualityOptions,
	selectedQuality,
	activeQualityLabel,
	canSelectQuality,
	isBuffering,
	bufferedEnd,
	showControls,
	viewMode,
	onViewModeChange,
	togglePlay,
	seek,
	setVolume,
	toggleMute,
	setPlaybackRate,
	setQualityLevel,
	toggleFullscreen,
	handleMouseActivity,
}: VideoPlayerProps) {
	const seekbarRef = useRef<HTMLDivElement>(null);
	const [isSeeking, setIsSeeking] = useState(false);
	const [showViewMenu, setShowViewMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const progressPercent = calcPercent(currentTime, duration);
	const bufferedPercent = calcPercent(bufferedEnd, duration);

	const handleViewModeChange = (mode: ViewMode) => {
		onViewModeChange(mode);
		setShowViewMenu(false);
	};

	const cycleViewMode = () => {
		const modes: ViewMode[] = ["normal", "theater", "fullscreen"];
		const currentIndex = modes.indexOf(viewMode);
		const nextIndex = (currentIndex + 1) % modes.length;
		handleViewModeChange(modes[nextIndex]);
	};

	const handleViewModeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e.button === 0) {
			cycleViewMode();
		}
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setShowViewMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const updateSeekFromClientX = useCallback(
		(clientX: number) => {
			if (duration === 0 || !seekbarRef.current) return;
			const rect = seekbarRef.current.getBoundingClientRect();
			const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
			seek(percent * duration);
		},
		[duration, seek],
	);

	const handleSeekPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (duration === 0) return;
		e.preventDefault();
		e.stopPropagation();
		setIsSeeking(true);
		handleMouseActivity();
		updateSeekFromClientX(e.clientX);
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const handleSeekPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isSeeking) return;
		e.preventDefault();
		updateSeekFromClientX(e.clientX);
	};

	const handleSeekPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isSeeking) return;
		e.preventDefault();
		updateSeekFromClientX(e.clientX);
		setIsSeeking(false);
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
	};

	const handlePlayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (target.closest("[data-player-control='true']")) return;
		togglePlay();
	};

	const getContainerStyle = () => {
		if (viewMode === "fullscreen") return { height: "100vh" };
		if (viewMode === "theater") return { aspectRatio: "16/9", maxHeight: "72vh" };
		return { aspectRatio: "16/9", maxHeight: "46vh" };
	};

	const containerStyle = getContainerStyle();

	return (
		<div
			ref={containerRef}
			className="relative bg-black w-full select-none"
			style={containerStyle}
			onClick={handlePlayerClick}
			onMouseMove={handleMouseActivity}
			onMouseEnter={handleMouseActivity}
		>
			{/* Video element */}
			<video
				ref={videoRef}
				className="w-full h-full object-contain"
				playsInline
			/>

			{/* Buffering spinner */}
			{isBuffering && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<Loader2 className="w-10 h-10 text-white/80 animate-spin" />
				</div>
			)}

			{/* Pause message overlay */}
			{!isPlaying && pauseMessage && (
				<PauseMessage message={pauseMessage} onDismiss={togglePlay} />
			)}

			{/* Controls overlay */}
			<div
				className={`absolute inset-0 flex flex-col justify-end pointer-events-none transition-opacity duration-300 ${
					viewMode === "fullscreen" || showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				{/* Bottom gradient */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

				{/* Chapter title – top left */}
				<div className="absolute top-3 left-3 pointer-events-none max-w-[70%]">
					<span className="text-white/90 text-xs font-medium drop-shadow-lg line-clamp-1">
						{chapters[0]?.title}
					</span>
				</div>

				{/* Centre play button (only when paused) */}
				{!isPlaying && !pauseMessage && (
					<button
						data-player-control="true"
						onClick={togglePlay}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-black/40 hover:bg-black/60 rounded-full p-4 transition-all backdrop-blur-sm"
					>
						<Play className="w-8 h-8 text-white fill-white" />
					</button>
				)}

				{/* Bottom controls */}
				<div
					data-player-control="true"
					className="pointer-events-auto relative z-10 px-3 pb-3 flex flex-col gap-1.5"
				>
					{/* Seekbar */}
					<div
						ref={seekbarRef}
						className="relative h-5 flex items-center cursor-pointer group/seek"
						onPointerDown={handleSeekPointerDown}
						onPointerMove={handleSeekPointerMove}
						onPointerUp={handleSeekPointerEnd}
						onPointerCancel={handleSeekPointerEnd}
						style={{ touchAction: "none" }}
					>
						<div className="relative w-full h-1 group-hover/seek:h-1.5 transition-all duration-150 rounded-full overflow-hidden bg-white/20">
							{/* Buffered */}
							<div
								className="absolute top-0 left-0 h-full bg-white/25 rounded-full"
								style={{ width: `${bufferedPercent}%` }}
							/>
							{/* Progress */}
							<div
								className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>

						{/* Chapter markers */}
						{chapters.slice(1).map((ch) => (
							<div
								key={ch.id}
								className="absolute top-1 bottom-1 w-px bg-black/60 pointer-events-none"
								style={{ left: `${calcPercent(ch.startSeconds, duration)}%` }}
							/>
						))}

						{/* Thumb */}
						<div
							className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 transition-opacity pointer-events-none shadow-md ${
								isSeeking ? "opacity-100 scale-110" : "opacity-0 group-hover/seek:opacity-100"
							}`}
							style={{ left: `${progressPercent}%` }}
						/>
					</div>

					{/* Button row */}
					<div className="flex items-center gap-1 text-white">
						{/* Play / Pause */}
						<button
							onClick={togglePlay}
							className="p-1.5 hover:text-orange-400 transition-colors"
							aria-label={isPlaying ? "Pausar" : "Reproducir"}
						>
							{isPlaying ? (
								<Pause className="w-5 h-5" />
							) : (
								<Play className="w-5 h-5 fill-current" />
							)}
						</button>

						{/* Volume */}
						<div className="flex items-center gap-1">
							<button
								onClick={toggleMute}
								className="p-1.5 hover:text-orange-400 transition-colors"
								aria-label={isMuted ? "Activar sonido" : "Silenciar"}
							>
								{isMuted || volume === 0 ? (
									<VolumeX className="w-5 h-5" />
								) : (
									<Volume2 className="w-5 h-5" />
								)}
							</button>
							<input
								type="range"
								min={0}
								max={1}
								step={0.05}
								value={isMuted ? 0 : volume}
								onChange={(e) => setVolume(Number(e.target.value))}
								className="w-16 h-1 cursor-pointer accent-orange-500"
								aria-label="Volumen"
							/>
						</div>

						{/* Time */}
						<span className="text-xs tabular-nums text-white/90 ml-1">
							{formatTime(currentTime)}&nbsp;/&nbsp;{formatTime(duration)}
						</span>

						<div className="flex-1" />

						{/* Playback rate */}
						<select
							value={playbackRate}
							onChange={(e) => setPlaybackRate(Number(e.target.value))}
							className="bg-transparent text-white text-xs cursor-pointer outline-none hover:text-orange-400 transition-colors"
							aria-label="Velocidad de reproduccion"
						>
							{RATES.map((r) => (
								<option key={r} value={r} className="bg-zinc-900 text-white">
									{r}x
								</option>
							))}
						</select>

						{/* Quality selector */}
						{canSelectQuality ? (
							<select
								value={selectedQuality}
								onChange={(e) => setQualityLevel(Number(e.target.value))}
								className="bg-transparent text-white text-xs cursor-pointer outline-none hover:text-orange-400 transition-colors"
								aria-label="Calidad de video"
							>
								{qualityOptions.map((option) => (
									<option key={option.value} value={option.value} className="bg-zinc-900 text-white">
										{option.label}
									</option>
								))}
							</select>
						) : (
							<span className="text-xs text-white/70">{activeQualityLabel}</span>
						)}

						{/* View mode button (left-click cycles, right-click menu) */}
						<div className="relative inline-block">
							<button
								onClick={handleViewModeClick}
								onContextMenu={(e) => {
									e.preventDefault();
									setShowViewMenu(!showViewMenu);
								}}
								className="p-1.5 hover:text-orange-400 transition-colors"
								aria-label="Cambiar tamaño de video"
							>
								{viewMode === "fullscreen" ? (
									<Minimize className="w-5 h-5" />
								) : viewMode === "theater" ? (
									<SquarePlay className="w-5 h-5" />
								) : (
									<RectangleHorizontal className="w-5 h-5" />
								)}
							</button>

							{showViewMenu && (
								<div
									ref={menuRef}
									className="absolute bottom-full right-0 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50"
									onMouseDown={(e) => e.stopPropagation()}
								>
									<button
										className={`w-full text-left px-4 py-2 text-sm transition-colors ${
											viewMode === "normal"
												? "bg-orange-500 text-black font-semibold"
												: "text-zinc-300 hover:bg-zinc-700 hover:text-white"
										}`}
										onClick={() => handleViewModeChange("normal")}
									>
										📺 Normal
									</button>
									<button
										className={`w-full text-left px-4 py-2 text-sm transition-colors ${
											viewMode === "theater"
												? "bg-orange-500 text-black font-semibold"
												: "text-zinc-300 hover:bg-zinc-700 hover:text-white"
										}`}
										onClick={() => handleViewModeChange("theater")}
									>
										🎬 Teatro
									</button>
									<button
										className={`w-full text-left px-4 py-2 text-sm transition-colors ${
											viewMode === "fullscreen"
												? "bg-orange-500 text-black font-semibold"
												: "text-zinc-300 hover:bg-zinc-700 hover:text-white"
										}`}
										onClick={() => handleViewModeChange("fullscreen")}
									>
										⛶ Pantalla completa
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Floating view mode button (always accessible, especially in fullscreen) */}
			{viewMode === "fullscreen" && (
				<button
					onClick={handleViewModeClick}
					onContextMenu={(e) => {
						e.preventDefault();
						setShowViewMenu(!showViewMenu);
					}}
					className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors z-50 pointer-events-auto shadow-lg"
					aria-label="Cambiar tamaño de video"
					title="Click izquierdo: ciclar modos | Click derecho: menú"
				>
					<Minimize className="w-5 h-5" />
				</button>
			)}
		</div>
	);
}
