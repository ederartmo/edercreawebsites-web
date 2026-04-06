"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type HlsType from "hls.js";
import type { Chapter } from "@/types";
import {
	loadProgress,
	saveProgress,
	loadXP,
	addXP,
	loadCompletedChapters,
	markChapterComplete,
} from "@/lib/storage";
import { getActiveChapterIndex } from "@/lib/utils";

export interface PlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isFullscreen: boolean;
	playbackRate: number;
	isBuffering: boolean;
	bufferedEnd: number;
	showControls: boolean;
	currentChapterIndex: number;
	xp: number;
	completedChapterIds: string[];
	qualityOptions: { value: number; label: string }[];
	selectedQuality: number;
	activeQualityLabel: string;
	canSelectQuality: boolean;
	showSubtitles: boolean;
	subtitlesAvailable: boolean;
}

export interface PlayerControls {
	togglePlay: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setPlaybackRate: (rate: number) => void;
	setQualityLevel: (level: number) => void;
	toggleFullscreen: () => void;
	handleMouseActivity: () => void;
	toggleSubtitles: () => void;
}

export interface UseVideoPlayerReturn extends PlayerState, PlayerControls {
	videoRef: React.RefObject<HTMLVideoElement>;
	containerRef: React.RefObject<HTMLDivElement>;
}

interface UseVideoPlayerOptions {
	hlsUrl: string;
	chapters: Chapter[];
	courseId: string;
	onChapterComplete?: (chapter: Chapter, xpEarned: number) => void;
	subtitleUrl?: string;
}

export function useVideoPlayer({
	hlsUrl,
	chapters,
	courseId,
	subtitleUrl,
	onChapterComplete,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hlsRef = useRef<HlsType | null>(null);
	const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const completedRef = useRef<Set<string>>(new Set());
	const selectedQualityRef = useRef(-1);

	// Keep latest copies in refs to avoid stale closures in event handlers
	const chaptersRef = useRef(chapters);
	const courseIdRef = useRef(courseId);
	const onChapterCompleteRef = useRef(onChapterComplete);
	useEffect(() => { chaptersRef.current = chapters; }, [chapters]);
	useEffect(() => { courseIdRef.current = courseId; }, [courseId]);
	useEffect(() => { onChapterCompleteRef.current = onChapterComplete; }, [onChapterComplete]);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolumeState] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [playbackRate, setPlaybackRateState] = useState(1);
	const [isBuffering, setIsBuffering] = useState(false);
	const [bufferedEnd, setBufferedEnd] = useState(0);
	const [showControls, setShowControls] = useState(true);
	const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
	const [xp, setXp] = useState(0);
	const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);
	const [qualityOptions, setQualityOptions] = useState<{ value: number; label: string }[]>([
		{ value: -1, label: "Auto" },
	]);
	const [selectedQuality, setSelectedQuality] = useState(-1);
	const [activeQualityLabel, setActiveQualityLabel] = useState("Auto");
	const [canSelectQuality, setCanSelectQuality] = useState(false);
	const [showSubtitles, setShowSubtitles] = useState(false);
	const [subtitlesAvailable, setSubtitlesAvailable] = useState(false);

	const isMobileDevice = useCallback(() => {
		if (typeof window === "undefined") return false;
		const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
		const smallViewport = window.matchMedia("(max-width: 768px)").matches;
		return mobileUA || smallViewport;
	}, []);

	// ── HLS initialization ─────────────────────────────────────────────────────
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Restore persisted data
		const savedTime = loadProgress(courseId);
		const savedXP = loadXP(courseId);
		const savedCompleted = loadCompletedChapters(courseId);
		setXp(savedXP);
		setCompletedChapterIds(savedCompleted);
		completedRef.current = new Set(savedCompleted);

		// Check if subtitles are available
		if (subtitleUrl) {
			setSubtitlesAvailable(true);
		}

		let instance: HlsType | null = null;

		const setup = async () => {
			if (video.canPlayType("application/vnd.apple.mpegurl")) {
				// Safari – native HLS support
				video.src = hlsUrl;
				if (savedTime > 5) video.currentTime = savedTime;
				setCanSelectQuality(false);
				setQualityOptions([{ value: -1, label: "Auto" }]);
				setSelectedQuality(-1);
				selectedQualityRef.current = -1;
				setActiveQualityLabel("Auto (nativo)");
			} else {
				const { default: Hls } = await import("hls.js");
				if (!Hls.isSupported()) return;
				instance = new Hls({
					enableWorker: true,
					// Buffer mas amplio para reducir micro-cortes y cambios frecuentes de nivel.
					maxBufferLength: 45,
					maxMaxBufferLength: 90,
					backBufferLength: 30,
					// ABR mas estable y conservador para evitar oscilaciones bruscas.
					abrBandWidthFactor: 0.8,
					abrBandWidthUpFactor: 0.6,
					abrEwmaFastVoD: 4,
					abrEwmaSlowVoD: 12,
					capLevelToPlayerSize: true,
					abrMaxWithRealBitrate: true,
				});
				hlsRef.current = instance;
				instance.loadSource(hlsUrl);
				instance.attachMedia(video);
				instance.on(Hls.Events.MANIFEST_PARSED, () => {
					if (savedTime > 5) video.currentTime = savedTime;

					const levelMap = new Map<number, { value: number; label: string }>();
					instance?.levels.forEach((level, index) => {
						const height = level.height ?? 0;
						const bitrateKbps = Math.round((level.bitrate ?? 0) / 1000);
						const label = height > 0 ? `${height}p${bitrateKbps > 0 ? ` (${bitrateKbps} kbps)` : ""}` : `Nivel ${index + 1}`;
						const existing = levelMap.get(height);
						if (!existing || (level.bitrate ?? 0) > (instance?.levels[existing.value]?.bitrate ?? 0)) {
							levelMap.set(height, { value: index, label });
						}
					});

					const manualOptions = Array.from(levelMap.values()).sort((a, b) => {
						const aHeight = instance?.levels[a.value]?.height ?? 0;
						const bHeight = instance?.levels[b.value]?.height ?? 0;
						return bHeight - aHeight;
					});

					setCanSelectQuality(manualOptions.length > 0);
					setQualityOptions([{ value: -1, label: "Auto" }, ...manualOptions]);

					const preferAuto = isMobileDevice();
					if (preferAuto || manualOptions.length === 0) {
						setSelectedQuality(-1);
						selectedQualityRef.current = -1;
						instance!.currentLevel = -1;
						instance!.nextLevel = -1;
						setActiveQualityLabel("Auto");
						return;
					}

					const target1080 = manualOptions.find((opt) => (instance?.levels[opt.value]?.height ?? 0) === 1080);
					const desktopDefault = target1080 ?? manualOptions[0];
					setSelectedQuality(desktopDefault.value);
					selectedQualityRef.current = desktopDefault.value;
					instance!.currentLevel = desktopDefault.value;
					instance!.nextLevel = desktopDefault.value;
					const height = instance?.levels[desktopDefault.value]?.height;
					setActiveQualityLabel(height ? `${height}p` : desktopDefault.label);
				});
				instance.on(Hls.Events.LEVEL_SWITCHED, (_event: unknown, data: { level: number }) => {
					const levelIndex = data.level;
					const level = instance?.levels[levelIndex];
					if (!level) return;
					const label = level.height ? `${level.height}p` : `Nivel ${levelIndex + 1}`;
					setActiveQualityLabel(selectedQualityRef.current === -1 ? `${label} (Auto)` : label);
				});
				instance.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean }) => {
					if (data.fatal) instance?.destroy();
				});
			}
		};

		setup();
		return () => {
			instance?.destroy();
			hlsRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hlsUrl]);

	// ── Video DOM event listeners ───────────────────────────────────────────────
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const onPlay = () => setIsPlaying(true);

		const onPause = () => {
			setIsPlaying(false);
			setShowControls(true);
			saveProgress(courseIdRef.current, video.currentTime);
		};

		const onTimeUpdate = () => {
			const t = video.currentTime;
			setCurrentTime(t);

			if (video.buffered.length > 0) {
				setBufferedEnd(video.buffered.end(video.buffered.length - 1));
			}

			const chs = chaptersRef.current;
			const idx = getActiveChapterIndex(t, chs);
			setCurrentChapterIndex(idx);

			// Award XP when we enter the next chapter (previous one is done)
			if (idx > 0) {
				const prev = chs[idx - 1];
				if (!completedRef.current.has(prev.id)) {
					const isNew = markChapterComplete(courseIdRef.current, prev.id);
					if (isNew) {
						const newXP = addXP(courseIdRef.current, prev.xpReward);
						completedRef.current.add(prev.id);
						setCompletedChapterIds((arr) => [...arr, prev.id]);
						setXp(newXP);
						onChapterCompleteRef.current?.(prev, prev.xpReward);
					}
				}
			}
		};

		const onDurationChange = () => setDuration(video.duration);
		const onWaiting = () => setIsBuffering(true);
		const onCanPlay = () => setIsBuffering(false);
		const onVolumeChange = () => {
			setVolumeState(video.volume);
			setIsMuted(video.muted);
		};
		const onRateChange = () => setPlaybackRateState(video.playbackRate);

		const onEnded = () => {
			setIsPlaying(false);
			setShowControls(true);
			const chs = chaptersRef.current;
			const last = chs[chs.length - 1];
			if (last && !completedRef.current.has(last.id)) {
				const isNew = markChapterComplete(courseIdRef.current, last.id);
				if (isNew) {
					const newXP = addXP(courseIdRef.current, last.xpReward);
					completedRef.current.add(last.id);
					setCompletedChapterIds((arr) => [...arr, last.id]);
					setXp(newXP);
					onChapterCompleteRef.current?.(last, last.xpReward);
				}
			}
		};

		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("timeupdate", onTimeUpdate);
		video.addEventListener("durationchange", onDurationChange);
		video.addEventListener("waiting", onWaiting);
		video.addEventListener("canplay", onCanPlay);
		video.addEventListener("volumechange", onVolumeChange);
		video.addEventListener("ratechange", onRateChange);
		video.addEventListener("ended", onEnded);

		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("timeupdate", onTimeUpdate);
			video.removeEventListener("durationchange", onDurationChange);
			video.removeEventListener("waiting", onWaiting);
			video.removeEventListener("canplay", onCanPlay);
			video.removeEventListener("volumechange", onVolumeChange);
			video.removeEventListener("ratechange", onRateChange);
			video.removeEventListener("ended", onEnded);
		};
	}, []);

	// ── Auto-save progress ─────────────────────────────────────────────────────
	useEffect(() => {
		if (!isPlaying) return;
		const timer = setInterval(() => {
			if (videoRef.current) saveProgress(courseId, videoRef.current.currentTime);
		}, 10_000);
		return () => clearInterval(timer);
	}, [isPlaying, courseId]);

	// ── Fullscreen change ──────────────────────────────────────────────────────
	useEffect(() => {
		const handler = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener("fullscreenchange", handler);
		return () => document.removeEventListener("fullscreenchange", handler);
	}, []);

	// ── Keyboard shortcuts ─────────────────────────────────────────────────────
	useEffect(() => {
		const restartIfEnded = (video: HTMLVideoElement) => {
			const videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
			if (videoDuration > 0 && video.currentTime >= videoDuration - 0.25) {
				video.currentTime = 0;
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement).tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

			const video = videoRef.current;
			if (!video) return;

			switch (e.key) {
				case " ":
				case "k":
					e.preventDefault();
					if (video.paused) {
						restartIfEnded(video);
						void video.play();
					} else {
						video.pause();
					}
					break;
				case "ArrowLeft":
					e.preventDefault();
					video.currentTime = Math.max(0, video.currentTime - 10);
					break;
				case "ArrowRight":
					e.preventDefault();
					video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
					break;
				case "ArrowUp":
					e.preventDefault();
					video.volume = Math.min(1, video.volume + 0.1);
					break;
				case "ArrowDown":
					e.preventDefault();
					video.volume = Math.max(0, video.volume - 0.1);
					break;
				case "m":
				case "M":
					video.muted = !video.muted;
					break;
				case "f":
				case "F":
					if (!document.fullscreenElement) {
						containerRef.current?.requestFullscreen();
					} else {
						document.exitFullscreen();
					}
					break;
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	// ── Controls ───────────────────────────────────────────────────────────────
	const togglePlay = useCallback(() => {
		const v = videoRef.current;
		if (!v) return;

		if (v.paused) {
			const videoDuration = Number.isFinite(v.duration) ? v.duration : 0;
			if (videoDuration > 0 && v.currentTime >= videoDuration - 0.25) {
				v.currentTime = 0;
			}
			void v.play();
			return;
		}

		v.pause();
	}, []);

	const seek = useCallback((time: number) => {
		const v = videoRef.current;
		if (!v) return;
		const t = Math.max(0, Math.min(v.duration || 0, time));
		v.currentTime = t;
		setCurrentTime(t);
	}, []);

	const setVolume = useCallback((vol: number) => {
		const v = videoRef.current;
		if (!v) return;
		const clamped = Math.max(0, Math.min(1, vol));
		v.volume = clamped;
		v.muted = clamped === 0;
	}, []);

	const toggleMute = useCallback(() => {
		const v = videoRef.current;
		if (v) v.muted = !v.muted;
	}, []);

	const setPlaybackRate = useCallback((rate: number) => {
		const v = videoRef.current;
		if (v) v.playbackRate = rate;
	}, []);

	const setQualityLevel = useCallback((level: number) => {
		const hls = hlsRef.current;
		setSelectedQuality(level);
		selectedQualityRef.current = level;

		if (!hls) {
			setActiveQualityLabel(level === -1 ? "Auto" : "Manual");
			return;
		}

		if (level === -1) {
			hls.currentLevel = -1;
			hls.nextLevel = -1;
			setActiveQualityLabel("Auto");
			return;
		}

		hls.currentLevel = level;
		hls.nextLevel = level;
		const target = hls.levels[level];
		const manualLabel = target?.height ? `${target.height}p` : `Nivel ${level + 1}`;
		setActiveQualityLabel(manualLabel);
	}, []);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			containerRef.current?.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	}, []);

	const handleMouseActivity = useCallback(() => {
		setShowControls(true);
		if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
		controlsTimerRef.current = setTimeout(() => {
			if (!videoRef.current?.paused) setShowControls(false);
		}, 3000);
	}, []);

	const toggleSubtitles = useCallback(() => {
		setShowSubtitles((prev) => !prev);
	}, []);

	return {
		videoRef,
		containerRef,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		isFullscreen,
		playbackRate,
		isBuffering,
		bufferedEnd,
		showControls,
		currentChapterIndex,
		xp,
		completedChapterIds,
		qualityOptions,
		selectedQuality,
		activeQualityLabel,
		canSelectQuality,
		togglePlay,
		seek,
		setVolume,
		toggleMute,
		setPlaybackRate,
		setQualityLevel,
		toggleFullscreen,
		handleMouseActivity,
		toggleSubtitles,
		showSubtitles,
		subtitlesAvailable,
	};
}
