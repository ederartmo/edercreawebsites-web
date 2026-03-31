interface PauseMessageProps {
	message: string;
	onDismiss: () => void;
}

export default function PauseMessage({ message, onDismiss }: PauseMessageProps) {
	return (
		<div
			className="absolute inset-0 z-10 flex items-center justify-center bg-black/65 backdrop-blur-sm cursor-pointer"
			onClick={onDismiss}
		>
			<div className="max-w-xs text-center px-6 flex flex-col items-center gap-3">
				<div className="text-3xl">⏸</div>
				<p className="text-white text-sm font-medium leading-relaxed">{message}</p>
				<span className="text-zinc-400 text-xs border border-zinc-600 rounded-full px-3 py-1">
					Haz clic para continuar
				</span>
			</div>
		</div>
	);
}
