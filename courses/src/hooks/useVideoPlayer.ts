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
}

export interface PlayerControls {
	togglePlay: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setPlaybackRate: (rate: number) => void;
	toggleFullscreen: () => void;
	handleMouseActivity: () => void;
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
}

export function useVideoPlayer({
	hlsUrl,
	chapters,
	courseId,
	onChapterComplete,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hlsRef = useRef<HlsType | null>(null);
	const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const completedRef = useRef<Set<string>>(new Set());

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

		let instance: HlsType | null = null;

		const setup = async () => {
			if (video.canPlayType("application/vnd.apple.mpegurl")) {
				// Safari – native HLS support
				video.src = hlsUrl;
				if (savedTime > 5) video.currentTime = savedTime;
			} else {
				const { default: Hls } = await import("hls.js");
				if (!Hls.isSupported()) return;
				instance = new Hls({ enableWorker: true });
				hlsRef.current = instance;
				instance.loadSource(hlsUrl);
				instance.attachMedia(video);
				instance.on(Hls.Events.MANIFEST_PARSED, () => {
					if (savedTime > 5) video.currentTime = savedTime;
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
		const onKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement).tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

			const video = videoRef.current;
			if (!video) return;

			switch (e.key) {
				case " ":
				case "k":
					e.preventDefault();
					video.paused ? video.play() : video.pause();
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
		v.paused ? v.play() : v.pause();
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
		togglePlay,
		seek,
		setVolume,
		toggleMute,
		setPlaybackRate,
		toggleFullscreen,
		handleMouseActivity,
	};
}
