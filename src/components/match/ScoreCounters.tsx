import type { MatchScore } from "@/domain/match";

export function ScoreCounters({ score }: { score: MatchScore }) {
  return (
    <div className="score-counters" aria-label="Desempates y faltas">
      <div className="score-counter score-counter--advantage">
        <span>Ventajas</span>
        <strong>{score.advantages}</strong>
      </div>
      <div className="score-counter score-counter--penalty">
        <span>Faltas</span>
        <strong>{score.penalties}</strong>
      </div>
    </div>
  );
}
