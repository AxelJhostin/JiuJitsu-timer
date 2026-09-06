export type Corner = "blue" | "red";

export type MatchStatus = "ready" | "running" | "paused" | "finished";

export type MatchMode = "gi" | "no-gi";

export type ScoringActionKind =
  | "takedown"
  | "sweep"
  | "knee_on_belly"
  | "guard_pass"
  | "mount"
  | "back_control"
  | "advantage"
  | "penalty";

export type FinishMethod =
  | "points"
  | "submission"
  | "disqualification"
  | "retirement"
  | "injury"
  | "referee_decision"
  | "time";

export interface Competitor {
  name: string;
  academy: string;
  belt: string;
}

export interface MatchScore {
  points: number;
  advantages: number;
  penalties: number;
}

export interface MatchEvent {
  id: string;
  sequence: number;
  corner: Corner;
  kind: ScoringActionKind;
  label: string;
  points: number;
  advantageDelta: number;
  penaltyDelta: number;
  opponentPoints: number;
  opponentAdvantages: number;
  remainingSeconds: number;
  createdAt: string;
}

export interface MatchConfig {
  id: string;
  tournament: string;
  mat: string;
  division: string;
  mode: MatchMode;
  rulesetId: string;
  rulesetVersion: string;
  durationSeconds: number;
  blue: Competitor;
  red: Competitor;
}

export interface MatchResult {
  winner: Corner | null;
  method: FinishMethod;
  note?: string;
}

export interface MatchState extends MatchConfig {
  status: MatchStatus;
  remainingSeconds: number;
  blueScore: MatchScore;
  redScore: MatchScore;
  events: MatchEvent[];
  result: MatchResult | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export type MatchCommand =
  | { type: "START"; at?: string }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SET_REMAINING"; seconds: number }
  | {
      type: "ADD_SCORE";
      corner: Corner;
      kind: ScoringActionKind;
      at?: string;
    }
  | { type: "UNDO_LAST" }
  | { type: "FINISH"; result: MatchResult; at?: string };
