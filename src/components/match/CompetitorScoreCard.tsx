import { MoreHorizontal } from "lucide-react";
import type {
  Competitor,
  Corner,
  MatchScore,
  ScoringActionKind,
} from "@/domain/match";
import { ScoreCounters } from "./ScoreCounters";

interface CompetitorScoreCardProps {
  corner: Corner;
  competitor: Competitor;
  score: MatchScore;
  disabled: boolean;
  onScore: (kind: ScoringActionKind) => void;
  onOpenActions: () => void;
}

const quickActions: Array<{
  kind: ScoringActionKind;
  value: string;
  label: string;
}> = [
  { kind: "points_2", value: "+2", label: "Puntos" },
  { kind: "points_3", value: "+3", label: "Puntos" },
  { kind: "points_4", value: "+4", label: "Puntos" },
  { kind: "advantage", value: "+V", label: "Ventaja" },
  { kind: "penalty", value: "!", label: "Falta" },
];

export function CompetitorScoreCard({
  corner,
  competitor,
  score,
  disabled,
  onScore,
  onOpenActions,
}: CompetitorScoreCardProps) {
  return (
    <section className={`fighter-card fighter-card--${corner}`}>
      <header className="fighter-card__corner">
        <span>Canto {corner === "blue" ? "azul" : "rojo"} · Atleta</span>
        <span>Faixa {competitor.belt}</span>
      </header>

      <div className="fighter-card__identity">
        <div className="fighter-card__person">
          <h2>{competitor.name}</h2>
          <p>{competitor.academy || "Academia sin registrar"}</p>
        </div>
        <div className="fighter-card__points">
          <span>Puntos</span>
          <strong>{score.points}</strong>
        </div>
      </div>

      <ScoreCounters score={score} />

      <div
        className="quick-actions"
        aria-label={`Puntuar a ${competitor.name}`}
      >
        {quickActions.map((action) => (
          <button
            className={`score-button score-button--${action.kind}`}
            type="button"
            key={action.kind}
            onClick={() => onScore(action.kind)}
            disabled={disabled}
            aria-label={`${action.label} para ${competitor.name}, ${action.value}`}
          >
            <strong>{action.value}</strong>
            <span>{action.label}</span>
          </button>
        ))}
        <button
          className="score-button score-button--more"
          type="button"
          onClick={onOpenActions}
          disabled={disabled}
        >
          <MoreHorizontal aria-hidden="true" />
          <span>Acciones</span>
        </button>
      </div>
    </section>
  );
}
