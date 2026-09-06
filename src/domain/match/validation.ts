import { z } from "zod";

const competitorSchema = z.object({
  name: z.string().trim().min(2).max(80),
  academy: z.string().trim().max(100).default(""),
  belt: z.string().trim().min(2).max(30),
});

export const matchStateSchema = z.object({
  id: z.uuid(),
  tournament: z.string().max(120),
  mat: z.string().max(30),
  division: z.string().max(120),
  mode: z.enum(["gi", "no-gi"]),
  rulesetId: z.string().max(60),
  rulesetVersion: z.string().max(30),
  durationSeconds: z
    .number()
    .int()
    .positive()
    .max(60 * 60),
  remainingSeconds: z
    .number()
    .int()
    .min(0)
    .max(60 * 60),
  blue: competitorSchema,
  red: competitorSchema,
  status: z.enum(["ready", "running", "paused", "finished"]),
  blueScore: z.object({
    points: z.number().int().min(0),
    advantages: z.number().int().min(0),
    penalties: z.number().int().min(0),
  }),
  redScore: z.object({
    points: z.number().int().min(0),
    advantages: z.number().int().min(0),
    penalties: z.number().int().min(0),
  }),
  events: z.array(
    z.object({
      id: z.uuid(),
      sequence: z.number().int().positive(),
      corner: z.enum(["blue", "red"]),
      kind: z.enum([
        "takedown",
        "sweep",
        "knee_on_belly",
        "guard_pass",
        "mount",
        "back_control",
        "advantage",
        "penalty",
      ]),
      label: z.string(),
      points: z.number().int().min(0),
      advantageDelta: z.number().int().min(0),
      penaltyDelta: z.number().int().min(0),
      opponentPoints: z.number().int().min(0),
      opponentAdvantages: z.number().int().min(0),
      remainingSeconds: z.number().int().min(0),
      createdAt: z.iso.datetime(),
    }),
  ),
  result: z
    .object({
      winner: z.enum(["blue", "red"]).nullable(),
      method: z.enum([
        "points",
        "submission",
        "disqualification",
        "retirement",
        "injury",
        "referee_decision",
        "time",
      ]),
      note: z.string().max(300).optional(),
    })
    .nullable(),
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime().nullable(),
  finishedAt: z.iso.datetime().nullable(),
});
