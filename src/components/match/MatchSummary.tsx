import React from "react";
import { Monitor, PlayCircle, Trophy } from "lucide-react";
import {
  finishMethodLabels,
  formatClock,
  type Corner,
  type MatchState,
} from "@/domain/match";
import { loadActiveMatch, loadMatchHistory } from "@/lib/storage";

export function MatchSummary() {
  const [match, setMatch] = React.useState<MatchState | null>(null);

  React.useEffect(() => {
    const active = loadActiveMatch();
    const history = loadMatchHistory();
    setMatch(active?.status === "finished" ? active : (history[0] ?? null));
  }, []);

  if (!match || !match.result) {
    return (
      <section className="panel empty-state">
        <div>
          <h1>No hay un resultado disponible</h1>
          <p>Finaliza un combate para ver su acta y cronología.</p>
          <a className="button button--primary" href="/combates/nuevo">
            Preparar combate
          </a>
        </div>
      </section>
    );
  }

  const winner = match.result.winner ? match[match.result.winner] : null;

  return (
    <div className="summary-view">
      <section className="official-result panel">
        <div className="official-result__meta">
          <span>{match.mat}</span>
          <span>Acta · {match.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="official-result__banner">
          <Trophy aria-hidden="true" />
          <div>
            <small>Victoria oficial</small>
            <h1>{winner?.name ?? "Sin ganador"}</h1>
            <p>{winner?.academy}</p>
          </div>
          <span>{finishMethodLabels[match.result.method]}</span>
        </div>
        <div className="official-result__scores">
          {(["blue", "red"] as Corner[]).map((corner) => {
            const score = corner === "blue" ? match.blueScore : match.redScore;
            return (
              <div
                className={`result-fighter result-fighter--${corner}`}
                key={corner}
              >
                <small>Esquina {corner === "blue" ? "azul" : "roja"}</small>
                <strong>{match[corner].name}</strong>
                <span>{match[corner].academy}</span>
                <b>{score.points}</b>
                <em>
                  {score.advantages} ventajas · {score.penalties} penas
                </em>
              </div>
            );
          })}
        </div>
      </section>

      <section className="timeline-card panel">
        <div className="section-title-row">
          <h2>Registro cronológico de acciones</h2>
          <span>{match.events.length} eventos</span>
        </div>
        <ol className="timeline-list">
          {match.events.map((event) => (
            <li
              className={`timeline-event timeline-event--${event.corner}`}
              key={event.id}
            >
              <time>{formatClock(event.remainingSeconds)}</time>
              <div>
                <strong>{match[event.corner].name}</strong>
                <span>{event.label}</span>
              </div>
              <b>
                {event.points
                  ? `+${event.points}`
                  : event.advantageDelta
                    ? "+V"
                    : "+P"}
              </b>
            </li>
          ))}
          <li className="timeline-event timeline-event--finish">
            <time>00:00</time>
            <div>
              <strong>Fin del combate</strong>
              <span>{finishMethodLabels[match.result.method]}</span>
            </div>
            <b>{formatClock(match.durationSeconds - match.remainingSeconds)}</b>
          </li>
        </ol>
      </section>

      <div className="summary-actions">
        <a className="button button--primary" href="/combates/nuevo">
          <PlayCircle aria-hidden="true" /> Nuevo combate
        </a>
        <a className="button" href="/proyeccion">
          <Monitor aria-hidden="true" /> Proyección
        </a>
        <a className="button" href="/historial">
          Ver historial
        </a>
      </div>
    </div>
  );
}
