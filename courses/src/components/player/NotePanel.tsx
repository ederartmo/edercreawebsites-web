"use client";

import { useState } from "react";
import { Trash2, Clock, PlusCircle } from "lucide-react";
import type { Note } from "@/lib/storage";
import { formatTime } from "@/lib/utils";

interface NotePanelProps {
	notes: Note[];
	currentTime: number;
	onAddNote: (timestamp: number, text: string) => void;
	onDeleteNote: (noteId: string) => void;
	onSeekToNote: (timestamp: number) => void;
}

export default function NotePanel({
	notes,
	currentTime,
	onAddNote,
	onDeleteNote,
	onSeekToNote,
}: NotePanelProps) {
	const [text, setText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;
		onAddNote(currentTime, text.trim());
		setText("");
	};

	return (
		<div className="flex flex-col h-full">
			<form onSubmit={handleSubmit} className="p-3 border-b border-zinc-800 flex gap-2 items-center shrink-0">
				<input
					type="text"
					placeholder={`Nota en ${formatTime(currentTime)}...`}
					value={text}
					onChange={(e) => setText(e.target.value)}
					maxLength={500}
					className="flex-1 bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
				/>
				<button
					type="submit"
					disabled={!text.trim()}
					className="shrink-0 text-orange-500 hover:text-orange-400 disabled:text-zinc-600 transition-colors p-1.5"
					aria-label="Agregar nota"
				>
					<PlusCircle className="w-5 h-5" />
				</button>
			</form>

			<div className="flex-1 overflow-y-auto divide-y divide-zinc-800">
				{notes.length === 0 ? (
					<div className="py-10 text-center">
						<p className="text-zinc-500 text-sm">Sin notas aun.</p>
						<p className="text-zinc-600 text-xs mt-1">
							Escribe y guarda notas en cualquier momento del video.
						</p>
					</div>
				) : (
					notes.map((note) => (
						<div key={note.id} className="px-3 py-2.5 flex gap-3 group hover:bg-zinc-800/50">
							<button
								onClick={() => onSeekToNote(note.timestamp)}
								className="shrink-0 flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-mono mt-0.5"
							>
								<Clock className="w-3 h-3" />
								{formatTime(note.timestamp)}
							</button>
							<p className="flex-1 text-zinc-300 text-sm leading-relaxed">{note.text}</p>
							<button
								onClick={() => onDeleteNote(note.id)}
								className="shrink-0 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
