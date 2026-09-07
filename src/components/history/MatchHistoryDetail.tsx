import React from "react";
import { ArrowLeft, FileWarning } from "lucide-react";
import { matchStateSchema, type MatchState } from "@/domain/match";
import { loadMatchHistory } from "@/lib/storage";
import { MatchRecord } from "@/components/match/MatchRecord";

interface MatchHistoryDetailProps {
  matchId: string;
}

export function MatchHistoryDetail({ matchId }: MatchHistoryDetailProps) {
  const [match, setMatch] = React.useState<MatchState | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const localMatch = loadMatchHistory().find((item) => item.id === matchId);
    if (localMatch) setMatch(localMatch);

    fetch(`/api/matches/${matchId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: unknown } | null) => {
        const parsed = matchStateSchema.safeParse(payload?.data);
        if (parsed.success) setMatch(parsed.data);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [matchId]);

  if (!loaded && !match) {
    return <section className="panel empty-state">Cargando acta…</section>;
  }

  if (!match) {
    return (
      <section className="panel empty-state">
        <div>
          <FileWarning className="empty-state__icon" aria-hidden="true" />
          <h1>Combate no encontrado</h1>
          <p>Puede haber sido eliminado de este dispositivo.</p>
          <a className="button button--primary" href="/historial">
            Volver al historial
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="summary-view history-detail-view">
      <a className="button history-back" href="/historial">
        <ArrowLeft aria-hidden="true" /> Volver al historial
      </a>
      <MatchRecord match={match} />
    </div>
  );
}
