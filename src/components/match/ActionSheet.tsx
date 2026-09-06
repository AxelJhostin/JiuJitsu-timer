import React from "react";
import { Check, X } from "lucide-react";
import {
  cornerLabel,
  getScoringDefinition,
  IBJJF_RULESET,
  type Corner,
  type MatchState,
  type ScoringActionKind,
} from "@/domain/match";

interface ActionSheetProps {
  match: MatchState;
  initialCorner: Corner;
  onClose: () => void;
  onConfirm: (corner: Corner, kind: ScoringActionKind) => void;
}

export function ActionSheet({
  match,
  initialCorner,
  onClose,
  onConfirm,
}: ActionSheetProps) {
  const [corner, setCorner] = React.useState<Corner>(initialCorner);
  const [kind, setKind] = React.useState<ScoringActionKind>("takedown");
  const definition = getScoringDefinition(kind);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="action-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-sheet-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <p className="eyebrow">Reglamento oficial IBJJF</p>
            <h2 id="action-sheet-title">Registrar acción</h2>
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

        <div className="corner-selector" aria-label="Seleccionar competidor">
          {(["blue", "red"] as Corner[]).map((value) => (
            <button
              type="button"
              key={value}
              className={`corner-selector__option corner-selector__option--${value}`}
              aria-pressed={corner === value}
              onClick={() => setCorner(value)}
            >
              {cornerLabel(value)} · {match[value].name}
            </button>
          ))}
        </div>

        <div className="action-grid">
          {IBJJF_RULESET.actions.map((action) => (
            <button
              type="button"
              key={action.kind}
              className="action-option"
              aria-pressed={kind === action.kind}
              onClick={() => setKind(action.kind)}
            >
              <span>{action.label}</span>
              <strong>
                {action.kind === "advantage"
                  ? "+V"
                  : action.kind === "penalty"
                    ? "+P"
                    : `+${action.points}`}
              </strong>
            </button>
          ))}
        </div>

        <button
          className="button button--primary button--wide action-confirm"
          type="button"
          onClick={() => onConfirm(corner, kind)}
        >
          <Check aria-hidden="true" />
          Confirmar {definition.label}
        </button>
      </section>
    </div>
  );
}
