import {
  buildMatchEvent,
  compareScores,
  emptyScore,
  scoresFromEvents,
} from "./rules";
import type { MatchCommand, MatchConfig, MatchState } from "./types";

export function createMatchState(config: MatchConfig): MatchState {
  return {
    ...config,
    status: "ready",
    remainingSeconds: config.durationSeconds,
    blueScore: emptyScore(),
    redScore: emptyScore(),
    events: [],
    result: null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    finishedAt: null,
  };
}

export function matchReducer(
  state: MatchState,
  command: MatchCommand,
): MatchState {
  switch (command.type) {
    case "START":
      if (state.status !== "ready") return state;
      return {
        ...state,
        status: "running",
        startedAt: command.at ?? new Date().toISOString(),
      };

    case "PAUSE":
      return state.status === "running"
        ? { ...state, status: "paused" }
        : state;

    case "RESUME":
      return state.status === "paused"
        ? { ...state, status: "running" }
        : state;

    case "SET_REMAINING": {
      if (state.status !== "running") return state;
      const remainingSeconds = Math.max(0, Math.floor(command.seconds));
      if (remainingSeconds === 0) {
        return { ...state, remainingSeconds, status: "paused" };
      }
      return { ...state, remainingSeconds };
    }

    case "ADD_SCORE": {
      if (state.status === "finished") return state;
      const currentScore =
        command.corner === "blue" ? state.blueScore : state.redScore;
      const event = buildMatchEvent({
        sequence: state.events.length + 1,
        corner: command.corner,
        kind: command.kind,
        currentPenaltyCount: currentScore.penalties,
        remainingSeconds: state.remainingSeconds,
        createdAt: command.at ?? new Date().toISOString(),
      });
      const events = [...state.events, event];
      const scores = scoresFromEvents(events);
      return {
        ...state,
        events,
        blueScore: scores.blue,
        redScore: scores.red,
      };
    }

    case "UNDO_LAST": {
      if (state.status === "finished" || state.events.length === 0)
        return state;
      const events = state.events.slice(0, -1);
      const scores = scoresFromEvents(events);
      return {
        ...state,
        events,
        blueScore: scores.blue,
        redScore: scores.red,
      };
    }

    case "FINISH":
      if (state.status === "finished") return state;
      return {
        ...state,
        status: "finished",
        result: command.result,
        finishedAt: command.at ?? new Date().toISOString(),
      };
  }
}

export function suggestedPointsWinner(state: MatchState) {
  return compareScores(state.blueScore, state.redScore);
}
