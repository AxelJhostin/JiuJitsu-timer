import React from "react";
import { Flag, X } from "lucide-react";
import {
  compareScores,
  finishMethodLabels,
  oppositeCorner,
  type Corner,
  type FinishMethod,
  type MatchResult,
  type MatchState,
} from "@/domain/match";

interface FinishMatchDialogProps {
  match: MatchState;
  disqualifiedCorner?: Corner | null;
  onClose: () => void;
  onConfirm: (result: MatchResult) => void;
}

const methods: FinishMethod[] = [
  "points",
  "submission",
  "disqualification",
  "retirement",
  "injury",
  "referee_decision",
];

export function FinishMatchDialog({
  match,
  disqualifiedCorner,
  onClose,
  onConfirm,
}: FinishMatchDialogProps) {
  const suggested = compareScores(match.blueScore, match.redScore);
  const [method, setMethod] = React.useState<FinishMethod>(
    disqualifiedCorner ? "disqualification" : "points",
  );
  const [winner, setWinner] = React.useState<Corner | null>(
    disqualifiedCorner ? oppositeCorner(disqualifiedCorner) : suggested,
  );

  React.useEffect(() => {
    if (method === "points") setWinner(suggested);
  }, [method, suggested]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="finish-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <p className="eyebrow">Confirmación requerida</p>
            <h2 id="finish-title">Finalizar combate</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="final-score-preview">
          <div className="final-score-preview__blue">
            <span>{match.blue.name}</span>
            <strong>{match.blueScore.points}</strong>
            <small>
              {match.blueScore.advantages}V · {match.blueScore.penalties}P
            </small>
          </div>
          <span className="final-score-preview__dash">—</span>
          <div className="final-score-preview__red">
            <span>{match.red.name}</span>
            <strong>{match.redScore.points}</strong>
            <small>
              {match.redScore.advantages}V · {match.redScore.penalties}P
            </small>
          </div>
        </div>

        <fieldset className="choice-fieldset">
          <legend>Método de victoria</legend>
          <div className="method-grid">
            {methods.map((value) => (
              <button
                type="button"
                key={value}
                className="method-option"
                aria-pressed={method === value}
                onClick={() => setMethod(value)}
              >
                {finishMethodLabels[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="choice-fieldset">
          <legend>Ganador</legend>
          <div className="winner-grid">
            {(["blue", "red"] as Corner[]).map((corner) => (
              <button
                type="button"
                key={corner}
                className={`winner-option winner-option--${corner}`}
                aria-pressed={winner === corner}
                onClick={() => setWinner(corner)}
              >
                {match[corner].name}
              </button>
            ))}
          </div>
          {!suggested && method === "points" && (
            <p className="tie-notice">
              Empate técnico: el árbitro debe elegir al ganador.
            </p>
          )}
        </fieldset>

        <button
          className="button button--danger button--wide action-confirm"
          type="button"
          disabled={!winner}
          onClick={() => winner && onConfirm({ winner, method })}
        >
          <Flag aria-hidden="true" />
          Confirmar resultado
        </button>
      </section>
    </div>
  );
}
