import React from "react";
import { Monitor, PlayCircle } from "lucide-react";
import type { MatchState } from "@/domain/match";
import { loadActiveMatch, loadMatchHistory } from "@/lib/storage";
import { MatchRecord } from "./MatchRecord";

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

  return (
    <div className="summary-view">
      <MatchRecord match={match} />

      <div className="summary-actions">
        <a className="button button--primary" href="/combates/nuevo">
          <PlayCircle aria-hidden="true" /> Nuevo combate
        </a>
        <a className="button" href="/proyeccion">
          <Monitor aria-hidden="true" /> Proyección
        </a>
        <a className="button" href="/combates/rapido">
          Combate rápido
        </a>
        <a className="button" href="/historial">
          Ver historial
        </a>
      </div>
    </div>
  );
}
