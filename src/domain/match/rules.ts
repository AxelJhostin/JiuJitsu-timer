import type {
  Corner,
  MatchEvent,
  MatchScore,
  ScoringActionKind,
} from "./types";

export interface ScoringDefinition {
  kind: ScoringActionKind;
  label: string;
  shortLabel: string;
  points: number;
}

export const IBJJF_RULESET = {
  id: "ibjjf-standard",
  version: "2024.1",
  name: "IBJJF estándar",
  actions: [
    { kind: "takedown", label: "Derribo", shortLabel: "Derribo", points: 2 },
    { kind: "sweep", label: "Barrido", shortLabel: "Barrido", points: 2 },
    {
      kind: "knee_on_belly",
      label: "Rodilla en abdomen",
      shortLabel: "Rodilla",
      points: 2,
    },
    {
      kind: "guard_pass",
      label: "Pase de guardia",
      shortLabel: "Pase",
      points: 3,
    },
    { kind: "mount", label: "Montada", shortLabel: "Montada", points: 4 },
    {
      kind: "back_control",
      label: "Control de espalda",
      shortLabel: "Espalda",
      points: 4,
    },
    {
      kind: "advantage",
      label: "Ventaja",
      shortLabel: "Ventaja",
      points: 0,
    },
    {
      kind: "penalty",
      label: "Penalización",
      shortLabel: "Falta",
      points: 0,
    },
  ] satisfies ScoringDefinition[],
} as const;

export const emptyScore = (): MatchScore => ({
  points: 0,
  advantages: 0,
  penalties: 0,
});

export function oppositeCorner(corner: Corner): Corner {
  return corner === "blue" ? "red" : "blue";
}

export function getScoringDefinition(
  kind: ScoringActionKind,
): ScoringDefinition {
  const definition = IBJJF_RULESET.actions.find(
    (action) => action.kind === kind,
  );

  if (!definition) {
    throw new Error(`Acción de puntuación desconocida: ${kind}`);
  }

  return definition;
}

export function buildMatchEvent(input: {
  sequence: number;
  corner: Corner;
  kind: ScoringActionKind;
  currentPenaltyCount: number;
  remainingSeconds: number;
  createdAt: string;
}): MatchEvent {
  const definition = getScoringDefinition(input.kind);
  const nextPenalty = input.currentPenaltyCount + 1;
  const isPenalty = input.kind === "penalty";

  return {
    id: crypto.randomUUID(),
    sequence: input.sequence,
    corner: input.corner,
    kind: input.kind,
    label: definition.label,
    points: definition.points,
    advantageDelta: input.kind === "advantage" ? 1 : 0,
    penaltyDelta: isPenalty ? 1 : 0,
    opponentAdvantages: isPenalty && nextPenalty === 2 ? 1 : 0,
    opponentPoints: isPenalty && nextPenalty === 3 ? 2 : 0,
    remainingSeconds: input.remainingSeconds,
    createdAt: input.createdAt,
  };
}

export function scoresFromEvents(events: MatchEvent[]): {
  blue: MatchScore;
  red: MatchScore;
} {
  const scores = { blue: emptyScore(), red: emptyScore() };

  for (const event of events) {
    const own = scores[event.corner];
    const opponent = scores[oppositeCorner(event.corner)];

    own.points += event.points;
    own.advantages += event.advantageDelta;
    own.penalties += event.penaltyDelta;
    opponent.points += event.opponentPoints;
    opponent.advantages += event.opponentAdvantages;
  }

  return scores;
}

export function compareScores(
  blue: MatchScore,
  red: MatchScore,
): Corner | null {
  if (blue.points !== red.points) {
    return blue.points > red.points ? "blue" : "red";
  }
  if (blue.advantages !== red.advantages) {
    return blue.advantages > red.advantages ? "blue" : "red";
  }
  if (blue.penalties !== red.penalties) {
    return blue.penalties < red.penalties ? "blue" : "red";
  }
  return null;
}

export function penaltyRequiresDisqualification(score: MatchScore): boolean {
  return score.penalties >= 4;
}
