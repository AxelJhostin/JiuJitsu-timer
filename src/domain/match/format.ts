import type { Corner, FinishMethod, MatchState } from "./types";

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutesPart = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsPart = (seconds % 60).toString().padStart(2, "0");
  return `${minutesPart}:${secondsPart}`;
}

export function cornerLabel(corner: Corner): string {
  return corner === "blue" ? "Azul" : "Rojo";
}

export function competitorForCorner(state: MatchState, corner: Corner) {
  return corner === "blue" ? state.blue : state.red;
}

export const finishMethodLabels: Record<FinishMethod, string> = {
  points: "Puntos",
  submission: "Sumisión",
  disqualification: "Descalificación",
  retirement: "Abandono",
  injury: "Lesión",
  referee_decision: "Decisión arbitral",
  time: "Tiempo terminado",
};
