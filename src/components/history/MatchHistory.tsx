import React from "react";
import { Search, Trophy } from "lucide-react";
import { finishMethodLabels, type MatchState } from "@/domain/match";
import { loadMatchHistory } from "@/lib/storage";

export function MatchHistory() {
  const [matches, setMatches] = React.useState<MatchState[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    setMatches(loadMatchHistory());
    fetch("/api/matches?limit=50")
      .then((response) => response.json())
      .then((payload: { data?: MatchState[] }) => {
        if (!payload.data?.length) return;
        setMatches((local) => {
          const all = [...payload.data!, ...local];
          return Array.from(
            new Map(all.map((item) => [item.id, item])).values(),
          );
        });
      })
      .catch(() => undefined);
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const filtered = matches.filter((match) =>
    [match.blue.name, match.red.name, match.tournament, match.division]
      .join(" ")
      .toLocaleLowerCase("es")
      .includes(normalizedQuery),
  );

  return (
    <div className="history-view">
      <label className="search-field">
        <Search aria-hidden="true" />
        <span className="sr-only">Buscar combate</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar atleta, torneo o división"
        />
      </label>

      {filtered.length === 0 ? (
        <section className="panel empty-state">
          <div>
            <Trophy className="empty-state__icon" aria-hidden="true" />
            <h2>
              {matches.length ? "No encontramos resultados" : "Historial vacío"}
            </h2>
            <p>
              {matches.length
                ? "Prueba con otro término de búsqueda."
                : "Los combates finalizados aparecerán aquí."}
            </p>
            {!matches.length && (
              <a className="button button--primary" href="/combates/nuevo">
                Crear primer combate
              </a>
            )}
          </div>
        </section>
      ) : (
        <div className="history-list">
          {filtered.map((match) => (
            <a
              className="history-card-link"
              href={`/historial/${match.id}`}
              key={match.id}
            >
              <article className="history-card panel">
                <header>
                  <span>{match.tournament}</span>
                  <time>
                    {new Date(match.createdAt).toLocaleDateString("es-EC")}
                  </time>
                </header>
                <div className="history-card__matchup">
                  <div className="history-card__competitor history-card__competitor--blue">
                    <small>Azul</small>
                    <strong>{match.blue.name}</strong>
                    <span>{match.blue.academy}</span>
                  </div>
                  <div className="history-card__score">
                    <strong>
                      {match.blueScore.points} — {match.redScore.points}
                    </strong>
                    <small>
                      {match.result
                        ? finishMethodLabels[match.result.method]
                        : "Pendiente"}
                    </small>
                  </div>
                  <div className="history-card__competitor history-card__competitor--red">
                    <small>Rojo</small>
                    <strong>{match.red.name}</strong>
                    <span>{match.red.academy}</span>
                  </div>
                </div>
                <footer>
                  <span>{match.division}</span>
                  <span>Ver acta · {match.mat || "Sin asignar"}</span>
                </footer>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
