import { Trophy } from "lucide-react";
import {
  finishMethodLabels,
  formatClock,
  type Corner,
  type MatchState,
} from "@/domain/match";

interface MatchRecordProps {
  match: MatchState;
}

export function MatchRecord({ match }: MatchRecordProps) {
  const winner = match.result?.winner ? match[match.result.winner] : null;
  const finishMethod = match.result
    ? finishMethodLabels[match.result.method]
    : "Resultado pendiente";

  return (
    <>
      <section className="official-result panel">
        <div className="official-result__meta">
          <span>{match.mat || "Tatami sin asignar"}</span>
          <span>Acta · {match.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="official-result__banner">
          <Trophy aria-hidden="true" />
          <div>
            <small>{match.result ? "Victoria oficial" : "Combate"}</small>
            <h1>{winner?.name ?? "Sin ganador"}</h1>
            <p>{winner?.academy}</p>
          </div>
          <span>{finishMethod}</span>
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
        {match.events.length === 0 ? (
          <p className="timeline-empty">No se registraron acciones.</p>
        ) : (
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
          </ol>
        )}
        {match.result && (
          <div className="timeline-event timeline-event--finish">
            <time>00:00</time>
            <div>
              <strong>Fin del combate</strong>
              <span>{finishMethod}</span>
            </div>
            <b>{formatClock(match.durationSeconds - match.remainingSeconds)}</b>
          </div>
        )}
      </section>
    </>
  );
}
