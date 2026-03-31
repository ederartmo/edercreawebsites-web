import { CheckCircle2 } from "lucide-react";

const TASKS = [
	{ id: "t1", title: "Crea tu pizarra en Canva", desc: "Abre Canva, crea un diseno en blanco y sube tu referencia como imagen o PDF." },
	{ id: "t2", title: "Replica el hero completo", desc: "Construye la seccion hero con imagen, gradiente, titulo y boton de llamada a la accion." },
	{ id: "t3", title: "Agrega enlace de WhatsApp", desc: "Selecciona un boton, pega el link de WhatsApp y verifica que funcione en vista previa." },
	{ id: "t4", title: "Publica el sitio en Canva", desc: "Cambia tu diseno a modo sitio web, elige tu URL personalizada y publicalo." },
];

export default function SubmissionPanel() {
	return (
		<div className="p-4 space-y-3">
			<p className="text-zinc-400 text-sm">Practica lo aprendido con estas tareas:</p>
			{TASKS.map((task) => (
				<div key={task.id} className="bg-zinc-800 rounded-xl p-3 flex gap-3">
					<CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
					<div>
						<p className="text-white text-sm font-medium">{task.title}</p>
						<p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{task.desc}</p>
					</div>
				</div>
			))}
		</div>
	);
}
