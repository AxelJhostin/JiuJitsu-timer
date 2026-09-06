import { desc, eq } from "drizzle-orm";
import type { MatchEvent, MatchState } from "@/domain/match";
import { getDatabase } from "../client";
import { matchEvents, matches } from "../schema";

function toState(
  match: typeof matches.$inferSelect,
  events: MatchEvent[],
): MatchState {
  return {
    id: match.id,
    tournament: match.tournament,
    mat: match.mat,
    division: match.division,
    mode: match.mode,
    rulesetId: match.rulesetId,
    rulesetVersion: match.rulesetVersion,
    durationSeconds: match.durationSeconds,
    remainingSeconds: match.remainingSeconds,
    blue: match.blue,
    red: match.red,
    blueScore: match.blueScore,
    redScore: match.redScore,
    status: match.status,
    result: match.result,
    events,
    createdAt: match.createdAt,
    startedAt: match.startedAt,
    finishedAt: match.finishedAt,
  };
}

function eventRow(event: MatchEvent, matchId: string) {
  return {
    id: event.id,
    matchId,
    sequence: event.sequence,
    corner: event.corner,
    kind: event.kind,
    label: event.label,
    points: event.points,
    advantageDelta: event.advantageDelta,
    penaltyDelta: event.penaltyDelta,
    opponentPoints: event.opponentPoints,
    opponentAdvantages: event.opponentAdvantages,
    remainingSeconds: event.remainingSeconds,
    createdAt: event.createdAt,
    payload: event,
  };
}

function matchRow(state: MatchState) {
  return {
    id: state.id,
    tournament: state.tournament,
    mat: state.mat,
    division: state.division,
    mode: state.mode,
    rulesetId: state.rulesetId,
    rulesetVersion: state.rulesetVersion,
    durationSeconds: state.durationSeconds,
    remainingSeconds: state.remainingSeconds,
    blue: state.blue,
    red: state.red,
    blueScore: state.blueScore,
    redScore: state.redScore,
    status: state.status,
    result: state.result,
    createdAt: state.createdAt,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    updatedAt: new Date().toISOString(),
  };
}

export async function saveMatch(state: MatchState): Promise<MatchState> {
  const db = getDatabase();

  await db
    .insert(matches)
    .values(matchRow(state))
    .onConflictDoUpdate({
      target: matches.id,
      set: matchRow(state),
    });

  await db.delete(matchEvents).where(eq(matchEvents.matchId, state.id));
  if (state.events.length > 0) {
    await db
      .insert(matchEvents)
      .values(state.events.map((event) => eventRow(event, state.id)));
  }

  return state;
}

export async function findMatch(id: string): Promise<MatchState | null> {
  const db = getDatabase();
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, id),
  });

  if (!match) return null;

  const eventRows = await db.query.matchEvents.findMany({
    where: eq(matchEvents.matchId, id),
    orderBy: (table, { asc }) => [asc(table.sequence)],
  });
  const events = eventRows.map((row) => row.payload as MatchEvent);
  return toState(match, events);
}

export async function listMatches(limit = 30): Promise<MatchState[]> {
  const db = getDatabase();
  const rows = await db
    .select()
    .from(matches)
    .orderBy(desc(matches.createdAt))
    .limit(Math.min(100, Math.max(1, limit)));

  return Promise.all(
    rows.map(async (match) => {
      const events = await db.query.matchEvents.findMany({
        where: eq(matchEvents.matchId, match.id),
        orderBy: (table, { asc }) => [asc(table.sequence)],
      });
      return toState(
        match,
        events.map((row) => row.payload as MatchEvent),
      );
    }),
  );
}
