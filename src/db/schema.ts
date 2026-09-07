import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  Competitor,
  MatchEvent,
  MatchResult,
  MatchScore,
} from "@/domain/match";

export const matchStatusEnum = pgEnum("match_status", [
  "ready",
  "running",
  "paused",
  "finished",
]);

export const matchModeEnum = pgEnum("match_mode", ["gi", "no-gi"]);

export const cornerEnum = pgEnum("corner", ["blue", "red"]);

export const eventKindEnum = pgEnum("event_kind", [
  "points_2",
  "points_3",
  "points_4",
  "takedown",
  "sweep",
  "knee_on_belly",
  "guard_pass",
  "mount",
  "back_control",
  "advantage",
  "penalty",
]);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey(),
    tournament: text("tournament").notNull().default(""),
    mat: text("mat").notNull().default(""),
    division: text("division").notNull().default(""),
    mode: matchModeEnum("mode").notNull(),
    rulesetId: text("ruleset_id").notNull(),
    rulesetVersion: text("ruleset_version").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    remainingSeconds: integer("remaining_seconds").notNull(),
    blue: jsonb("blue").$type<Competitor>().notNull(),
    red: jsonb("red").$type<Competitor>().notNull(),
    blueScore: jsonb("blue_score").$type<MatchScore>().notNull(),
    redScore: jsonb("red_score").$type<MatchScore>().notNull(),
    status: matchStatusEnum("status").notNull(),
    result: jsonb("result").$type<MatchResult | null>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    startedAt: timestamp("started_at", {
      withTimezone: true,
      mode: "string",
    }),
    finishedAt: timestamp("finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("matches_created_at_idx").on(table.createdAt),
    index("matches_status_idx").on(table.status),
  ],
);

export const matchEvents = pgTable(
  "match_events",
  {
    id: uuid("id").primaryKey(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    corner: cornerEnum("corner").notNull(),
    kind: eventKindEnum("kind").notNull(),
    label: text("label").notNull(),
    points: integer("points").notNull().default(0),
    advantageDelta: integer("advantage_delta").notNull().default(0),
    penaltyDelta: integer("penalty_delta").notNull().default(0),
    opponentPoints: integer("opponent_points").notNull().default(0),
    opponentAdvantages: integer("opponent_advantages").notNull().default(0),
    remainingSeconds: integer("remaining_seconds").notNull(),
    payload: jsonb("payload").$type<Partial<MatchEvent>>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("match_events_match_sequence_idx").on(
      table.matchId,
      table.sequence,
    ),
  ],
);

export type MatchRow = typeof matches.$inferSelect;
export type NewMatchRow = typeof matches.$inferInsert;
