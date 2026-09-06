import React from "react";
import { Flag, Settings2, Undo2 } from "lucide-react";
import {
  cornerLabel,
  formatClock,
  matchReducer,
  penaltyRequiresDisqualification,
  type Corner,
  type MatchCommand,
  type MatchResult,
  type MatchState,
  type ScoringActionKind,
} from "@/domain/match";
import {
  archiveMatch,
  loadActiveMatch,
  saveActiveMatch,
  syncMatch,
} from "@/lib/storage";
import { ActionSheet } from "./ActionSheet";
import { CompetitorScoreCard } from "./CompetitorScoreCard";
import { FinishMatchDialog } from "./FinishMatchDialog";
import { MatchTimer } from "./MatchTimer";

export function MatchController() {
  const [match, setMatch] = React.useState<MatchState | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [actionCorner, setActionCorner] = React.useState<Corner | null>(null);
  const [finishOpen, setFinishOpen] = React.useState(false);
  const [disqualifiedCorner, setDisqualifiedCorner] =
    React.useState<Corner | null>(null);
  const [syncState, setSyncState] = React.useState<
    "local" | "syncing" | "synced"
  >("local");
  const endAt = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMatch(loadActiveMatch());
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!match) return;
    saveActiveMatch(match);
  }, [match]);

  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.code !== "Space" ||
        target?.matches("input, select, textarea, button, a")
      ) {
        return;
      }
      event.preventDefault();
      setMatch((current) => {
        if (!current) return current;
        if (current.status === "ready") {
          return matchReducer(current, { type: "START" });
        }
        if (current.status === "running") {
          return matchReducer(current, { type: "PAUSE" });
        }
        if (current.status === "paused" && current.remainingSeconds > 0) {
          return matchReducer(current, { type: "RESUME" });
        }
        return current;
      });
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  React.useEffect(() => {
    if (!match || match.status !== "running") {
      endAt.current = null;
      return;
    }

    endAt.current = Date.now() + match.remainingSeconds * 1000;
    const interval = window.setInterval(() => {
      if (!endAt.current) return;
      const seconds = Math.max(
        0,
        Math.ceil((endAt.current - Date.now()) / 1000),
      );
      setMatch((current) =>
        current
          ? matchReducer(current, { type: "SET_REMAINING", seconds })
          : current,
      );
      if (seconds === 0) {
        window.clearInterval(interval);
        setFinishOpen(true);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [match?.status]);

  const send = React.useCallback((command: MatchCommand) => {
    setMatch((current) => (current ? matchReducer(current, command) : current));
  }, []);

  const addScore = (corner: Corner, kind: ScoringActionKind) => {
    if (!match) return;
    send({ type: "ADD_SCORE", corner, kind });
    if (kind === "penalty") {
      const current = corner === "blue" ? match.blueScore : match.redScore;
      if (
        penaltyRequiresDisqualification({
          ...current,
          penalties: current.penalties + 1,
        })
      ) {
        setDisqualifiedCorner(corner);
        setFinishOpen(true);
      }
    }
  };

  const toggleTimer = () => {
    if (!match) return;
    if (match.status === "ready") send({ type: "START" });
    else if (match.status === "running") send({ type: "PAUSE" });
    else if (match.status === "paused" && match.remainingSeconds > 0)
      send({ type: "RESUME" });
  };

  const finish = async (result: MatchResult) => {
    if (!match) return;
    const finished = matchReducer(match, { type: "FINISH", result });
    setMatch(finished);
    archiveMatch(finished);
    setFinishOpen(false);
    setSyncState("syncing");
    const synced = await syncMatch(finished);
    setSyncState(synced ? "synced" : "local");
    window.setTimeout(() => {
      window.location.href = "/resumen";
    }, 350);
  };

  if (!loaded) {
    return <div className="panel empty-state">Cargando marcador…</div>;
  }

  if (!match) {
    return (
      <section className="panel empty-state">
        <div>
          <h1>No hay un combate preparado</h1>
          <p>
            Configura los competidores y la duración antes de abrir el marcador.
          </p>
          <a className="button button--primary" href="/combates/nuevo">
            Preparar combate
          </a>
        </div>
      </section>
    );
  }

  const lastEvent = match.events.at(-1);
  const disabled = match.status === "finished";

  return (
    <div className="scoreboard-operator">
      <div className="match-context">
        <span>
          <b>{match.mat || "Tatami 1"}</b> · {match.division}
        </span>
        <span
          className={
            match.status === "running"
              ? "status-badge status-badge--live"
              : "status-badge status-badge--ready"
          }
        >
          {match.status === "running"
            ? "En vivo"
            : match.status === "finished"
              ? "Finalizado"
              : "Mesa"}
        </span>
      </div>

      <MatchTimer
        remainingSeconds={match.remainingSeconds}
        durationSeconds={match.durationSeconds}
        status={match.status}
        onToggle={toggleTimer}
      />

      <div className="last-action" aria-live="polite">
        <span>Última acción</span>
        <strong>
          {lastEvent
            ? `${formatClock(lastEvent.remainingSeconds)} · ${match[lastEvent.corner].name} · ${lastEvent.label}`
            : "Aún no hay acciones registradas"}
        </strong>
      </div>

      <div className="fighters-grid">
        {(["blue", "red"] as Corner[]).map((corner) => (
          <CompetitorScoreCard
            key={corner}
            corner={corner}
            competitor={match[corner]}
            score={corner === "blue" ? match.blueScore : match.redScore}
            disabled={disabled}
            onScore={(kind) => addScore(corner, kind)}
            onOpenActions={() => setActionCorner(corner)}
          />
        ))}
      </div>

      <div className="operator-tools">
        <button
          className="button"
          type="button"
          onClick={() => send({ type: "UNDO_LAST" })}
          disabled={!lastEvent || disabled}
        >
          <Undo2 aria-hidden="true" />
          <span>
            Deshacer{lastEvent ? ` · ${cornerLabel(lastEvent.corner)}` : ""}
          </span>
        </button>
        <a className="button" href="/reglas">
          <Settings2 aria-hidden="true" />
          <span>Ajustes de mesa</span>
        </a>
      </div>

      <button
        className="button button--danger finish-button"
        type="button"
        onClick={() => setFinishOpen(true)}
        disabled={disabled}
      >
        <Flag aria-hidden="true" />
        Finalizar combate
      </button>

      <p className="sync-note" aria-live="polite">
        {syncState === "syncing"
          ? "Guardando…"
          : syncState === "synced"
            ? "Guardado en Neon"
            : "Guardado en este dispositivo"}
      </p>

      {actionCorner && (
        <ActionSheet
          match={match}
          initialCorner={actionCorner}
          onClose={() => setActionCorner(null)}
          onConfirm={(corner, kind) => {
            addScore(corner, kind);
            setActionCorner(null);
          }}
        />
      )}

      {finishOpen && (
        <FinishMatchDialog
          match={match}
          disqualifiedCorner={disqualifiedCorner}
          onClose={() => {
            setFinishOpen(false);
            setDisqualifiedCorner(null);
          }}
          onConfirm={finish}
        />
      )}
    </div>
  );
}
