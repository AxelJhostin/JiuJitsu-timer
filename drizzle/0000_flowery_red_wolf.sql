CREATE TYPE "public"."corner" AS ENUM('blue', 'red');--> statement-breakpoint
CREATE TYPE "public"."event_kind" AS ENUM('takedown', 'sweep', 'knee_on_belly', 'guard_pass', 'mount', 'back_control', 'advantage', 'penalty');--> statement-breakpoint
CREATE TYPE "public"."match_mode" AS ENUM('gi', 'no-gi');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('ready', 'running', 'paused', 'finished');--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"match_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"corner" "corner" NOT NULL,
	"kind" "event_kind" NOT NULL,
	"label" text NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"advantage_delta" integer DEFAULT 0 NOT NULL,
	"penalty_delta" integer DEFAULT 0 NOT NULL,
	"opponent_points" integer DEFAULT 0 NOT NULL,
	"opponent_advantages" integer DEFAULT 0 NOT NULL,
	"remaining_seconds" integer NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tournament" text DEFAULT '' NOT NULL,
	"mat" text DEFAULT '' NOT NULL,
	"division" text DEFAULT '' NOT NULL,
	"mode" "match_mode" NOT NULL,
	"ruleset_id" text NOT NULL,
	"ruleset_version" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"remaining_seconds" integer NOT NULL,
	"blue" jsonb NOT NULL,
	"red" jsonb NOT NULL,
	"blue_score" jsonb NOT NULL,
	"red_score" jsonb NOT NULL,
	"status" "match_status" NOT NULL,
	"result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "match_events_match_sequence_idx" ON "match_events" USING btree ("match_id","sequence");--> statement-breakpoint
CREATE INDEX "matches_created_at_idx" ON "matches" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "matches_status_idx" ON "matches" USING btree ("status");