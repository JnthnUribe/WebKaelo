import { type Difficulty } from "@/lib/mockData";

const config: Record<Difficulty, { label: string; className: string }> = {
  facil: { label: "Fácil", className: "bg-difficulty-facil/15 text-difficulty-facil" },
  moderada: { label: "Moderada", className: "bg-difficulty-moderada/15 text-difficulty-moderada" },
  dificil: { label: "Difícil", className: "bg-difficulty-dificil/15 text-difficulty-dificil" },
  experto: { label: "Experto", className: "bg-difficulty-experto/15 text-difficulty-experto" },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = config[difficulty];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-pill text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
