import React from "react";
import { ArrowRight, Clock3, Monitor, Plus, Trophy, Zap } from "lucide-react";
import { finishMethodLabels, type MatchState } from "@/domain/match";
import { loadActiveMatch, loadMatchHistory } from "@/lib/storage";

export function HomeDashboard() {
  const [lastMatch, setLastMatch] = React.useState<MatchState | null>(null);
  const [historyCount, setHistoryCount] = React.useState(0);

  React.useEffect(() => {
    const history = loadMatchHistory();
    setHistoryCount(history.length);
    setLastMatch(history[0] ?? loadActiveMatch());
  }, []);

  return (
    <div className="home-layout">
      <section className="home-hero panel">
        <p className="eyebrow">Sistema operativo · IBJJF</p>
        <h1>El marcador claro para cada combate</h1>
        <p className="home-hero__copy">
          Control táctico de tiempo, ventajas y penalizaciones sin margen de
          error.
        </p>

        <div className="mat-selector" aria-label="Puesto de mesa asignado">
          {["01", "02", "03"].map((mat) => (
            <span className={mat === "02" ? "is-active" : ""} key={mat}>
              Tatami <b>{mat}</b>
            </span>
          ))}
        </div>

        <a className="button button--primary home-cta" href="/combates/nuevo">
          <Plus aria-hidden="true" />
          <span>
            <strong>Nuevo combate</strong>
            <small>Listo para iniciar reloj</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </a>
        <a className="button home-quick-cta" href="/combates/rapido">
          <Zap aria-hidden="true" />
          <span>
            <strong>Combate rápido</strong>
            <small>Solo nombres y tiempo</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </a>
        <a className="history-link" href="/historial">
          <Clock3 aria-hidden="true" /> Ver historial de combates
          <span>{historyCount} guardados</span>
        </a>
      </section>

      <div className="home-shortcuts">
        <a className="panel shortcut-card" href="/proyeccion">
          <Monitor aria-hidden="true" />
          <small>Marcador externo</small>
          <strong>Modo proyección</strong>
        </a>
        <a className="panel shortcut-card" href="/reglas">
          <Trophy aria-hidden="true" />
          <small>Oficial IBJJF</small>
          <strong>Reglamento y tiempos</strong>
        </a>
      </div>

      <section className="last-match-section">
        <div className="section-title-row">
          <h2>Último combate disputado</h2>
          {lastMatch && (
            <time>
              {new Date(lastMatch.createdAt).toLocaleDateString("es-EC")}
            </time>
          )}
        </div>
        {lastMatch ? (
          <article className="last-match-card panel">
            <div className="last-match-card__meta">
              <span>{lastMatch.tournament}</span>
              <span>{lastMatch.mat}</span>
            </div>
            <div className="last-match-card__scores">
              <div className="mini-fighter mini-fighter--blue">
                <small>Rincón azul</small>
                <strong>{lastMatch.blue.name}</strong>
                <b>{lastMatch.blueScore.points}</b>
              </div>
              <div className="mini-fighter mini-fighter--red">
                <small>Rincón rojo</small>
                <strong>{lastMatch.red.name}</strong>
                <b>{lastMatch.redScore.points}</b>
              </div>
            </div>
            <div className="last-match-card__result">
              <Trophy aria-hidden="true" />
              <span>
                {lastMatch.result?.winner
                  ? `Ganador: ${lastMatch[lastMatch.result.winner].name}`
                  : "Combate preparado"}
                <small>
                  {lastMatch.result
                    ? finishMethodLabels[lastMatch.result.method]
                    : "Pendiente de iniciar"}
                </small>
              </span>
              <a
                href={
                  lastMatch.status === "finished" ? "/resumen" : "/marcador"
                }
              >
                Detalles <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </article>
        ) : (
          <div className="panel home-empty">
            Todavía no existen combates. El primero quedará aquí.
          </div>
        )}
      </section>
    </div>
  );
}
