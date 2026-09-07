import React from "react";
import { Check, X } from "lucide-react";
import {
  cornerLabel,
  getScoringDefinition,
  IBJJF_RULESET,
  type Corner,
  type MatchState,
  type ScoringActionKind,
  type TechniqueActionKind,
} from "@/domain/match";

interface TagTarget {
  eventId: string;
  corner: Corner;
  points: number;
}

interface ActionSheetProps {
  match: MatchState;
  initialCorner: Corner;
  onClose: () => void;
  onConfirm: (corner: Corner, kind: ScoringActionKind) => void;
  tagTarget?: TagTarget;
  onTag?: (eventId: string, kind: TechniqueActionKind) => void;
}

export function ActionSheet({
  match,
  initialCorner,
  onClose,
  onConfirm,
  tagTarget,
  onTag,
}: ActionSheetProps) {
  const isTagging = Boolean(tagTarget);
  const actions = isTagging
    ? IBJJF_RULESET.actions.filter(
        (action) => action.points === tagTarget?.points,
      )
    : IBJJF_RULESET.actions;
  const [corner, setCorner] = React.useState<Corner>(
    tagTarget?.corner ?? initialCorner,
  );
  const [kind, setKind] = React.useState<ScoringActionKind>(actions[0].kind);
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
            <h2 id="action-sheet-title">
              {isTagging ? "Etiquetar técnica" : "Registrar acción"}
            </h2>
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

        {isTagging ? (
          <p className="technique-sheet-note">
            +{tagTarget?.points} para {match[corner].name}. Esta etiqueta es
            opcional y no modifica el puntaje.
          </p>
        ) : (
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
        )}

        <div className="action-grid">
          {actions.map((action) => (
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
                    ? "!"
                    : `+${action.points}`}
              </strong>
            </button>
          ))}
        </div>

        <button
          className="button button--primary button--wide action-confirm"
          type="button"
          onClick={() => {
            if (tagTarget && onTag) {
              onTag(tagTarget.eventId, kind as TechniqueActionKind);
            } else {
              onConfirm(corner, kind);
            }
          }}
        >
          <Check aria-hidden="true" />
          {isTagging ? "Guardar" : "Confirmar"} {definition.label}
        </button>
      </section>
    </div>
  );
}
