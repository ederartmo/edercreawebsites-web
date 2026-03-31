"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";

interface XPToastProps {
	xp: number;
	chapterTitle: string;
	visible: boolean;
	onHide: () => void;
}

export default function XPToast({ xp, chapterTitle, visible, onHide }: XPToastProps) {
	useEffect(() => {
		if (!visible) return;
		const t = setTimeout(onHide, 3200);
		return () => clearTimeout(t);
	}, [visible, onHide]);

	if (!visible) return null;

	return (
		<div className="fixed bottom-6 right-6 z-50">
			<div className="bg-zinc-900 border border-orange-500/40 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3">
				<div className="bg-orange-500/20 rounded-full p-2 shrink-0">
					<Star className="w-4 h-4 text-orange-400 fill-orange-400" />
				</div>
				<div className="min-w-0">
					<p className="text-white text-sm font-bold">+{xp} XP</p>
					<p className="text-zinc-400 text-xs truncate max-w-[180px]">{chapterTitle}</p>
				</div>
			</div>
		</div>
	);
}
