interface XPBarProps {
	currentXP: number;
	totalXP: number;
	completedCount: number;
	totalChapters: number;
}

export default function XPBar({ currentXP, totalXP, completedCount, totalChapters }: XPBarProps) {
	const pct = totalXP > 0 ? Math.min(100, (currentXP / totalXP) * 100) : 0;

	return (
		<div className="shrink-0 bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-4">
			<span className="text-xs font-bold text-orange-400 tabular-nums shrink-0">
				{currentXP} / {totalXP} XP
			</span>
			<div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className="text-xs text-zinc-400 tabular-nums shrink-0">
				{completedCount}/{totalChapters} clases
			</span>
		</div>
	);
}
