import React from "react";
import { Maximize, Radio } from "lucide-react";
import { formatClock, type Corner, type MatchState } from "@/domain/match";
import { loadActiveMatch } from "@/lib/storage";

export function ProjectionBoard() {
  const [match, setMatch] = React.useState<MatchState | null>(null);

  React.useEffect(() => {
    const refresh = () => setMatch(loadActiveMatch());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("tatami-score:match-change", refresh);
    const interval = window.setInterval(refresh, 1000);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("tatami-score:match-change", refresh);
      window.clearInterval(interval);
    };
  }, []);

  const enterFullscreen = () => document.documentElement.requestFullscreen?.();

  if (!match) {
    return (
      <section className="projection-empty">
        <img src="/logo.svg" width="88" height="88" alt="" />
        <h1>Esperando combate</h1>
        <p>Prepara un combate desde la mesa para activar esta pantalla.</p>
      </section>
    );
  }

  return (
    <div className="projection-board">
      <header className="projection-header">
        <div>
          <span>{match.mat}</span>
          <strong>{match.tournament}</strong>
          <small>
            {match.division} · {match.mode === "gi" ? "Gi" : "No-Gi"}
          </small>
        </div>
        <span className="status-badge status-badge--live">
          <Radio aria-hidden="true" />{" "}
          {match.status === "running"
            ? "En vivo"
            : match.status === "finished"
              ? "Finalizado"
              : "Pausado"}
        </span>
        <button
          className="icon-button"
          type="button"
          onClick={enterFullscreen}
          aria-label="Pantalla completa"
        >
          <Maximize aria-hidden="true" />
        </button>
      </header>

      <section className="projection-clock">
        <small>
          {match.status === "running"
            ? "Tiempo corriendo"
            : match.status === "finished"
              ? "Combate finalizado"
              : "Tiempo pausado"}
        </small>
        <output>{formatClock(match.remainingSeconds)}</output>
        <span>Periodo 1 · {formatClock(match.durationSeconds)} total</span>
      </section>

      <div className="projection-fighters">
        {(["blue", "red"] as Corner[]).map((corner) => {
          const score = corner === "blue" ? match.blueScore : match.redScore;
          return (
            <section
              className={`projection-fighter projection-fighter--${corner}`}
              key={corner}
            >
              <div className="projection-fighter__name">
                <small>Esquina {corner === "blue" ? "azul" : "roja"}</small>
                <h2>{match[corner].name}</h2>
                <p>{match[corner].academy}</p>
              </div>
              <div className="projection-fighter__score">
                <span>Puntos</span>
                <strong>{score.points}</strong>
              </div>
              <div className="projection-fighter__secondary">
                <span>
                  Ventajas <b>{score.advantages}</b>
                </span>
                <span>
                  Faltas <b>{score.penalties}</b>
                </span>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="projection-footer">
        <span>Última acción</span>
        <strong>
          {match.events.at(-1)?.label ?? "Esperando primera acción"}
        </strong>
        <span>Reglamento IBJJF</span>
      </footer>
    </div>
  );
}
