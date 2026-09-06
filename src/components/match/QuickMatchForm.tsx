import React from "react";
import { ArrowRight, Clock3, Settings2, Zap } from "lucide-react";
import { createMatchState, formatClock, IBJJF_RULESET } from "@/domain/match";
import { saveActiveMatch } from "@/lib/storage";

const quickDurations = [180, 300, 360, 480, 600];

export function QuickMatchForm() {
  const [blueName, setBlueName] = React.useState("");
  const [redName, setRedName] = React.useState("");
  const [durationSeconds, setDurationSeconds] = React.useState(300);
  const [error, setError] = React.useState("");

  const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (blueName.trim().length < 2 || redName.trim().length < 2) {
      setError("Ingresa el nombre de ambos competidores.");
      return;
    }

    const match = createMatchState({
      id: crypto.randomUUID(),
      tournament: "Combate rápido",
      mat: "Sin asignar",
      division: "Combate rápido",
      mode: "gi",
      rulesetId: IBJJF_RULESET.id,
      rulesetVersion: IBJJF_RULESET.version,
      durationSeconds,
      blue: {
        name: blueName.trim(),
        academy: "",
        belt: "libre",
      },
      red: {
        name: redName.trim(),
        academy: "",
        belt: "libre",
      },
    });

    saveActiveMatch(match);
    window.location.href = "/marcador";
  };

  return (
    <form className="quick-match-form panel" onSubmit={submit}>
      <div className="quick-match-form__intro">
        <span className="quick-match-form__icon">
          <Zap aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">Configuración mínima</p>
          <h1>Listos en segundos</h1>
          <p>
            Solo necesitamos identificar las esquinas y elegir cuánto dura el
            combate.
          </p>
        </div>
      </div>

      <div className="quick-match-corners">
        <div className="field quick-corner quick-corner--blue">
          <label htmlFor="quick-blue-name">Competidor azul</label>
          <input
            id="quick-blue-name"
            className="input"
            value={blueName}
            onChange={(event) => {
              setBlueName(event.target.value);
              setError("");
            }}
            placeholder="Nombre del competidor"
            autoComplete="off"
            autoFocus
          />
        </div>

        <div className="field quick-corner quick-corner--red">
          <label htmlFor="quick-red-name">Competidor rojo</label>
          <input
            id="quick-red-name"
            className="input"
            value={redName}
            onChange={(event) => {
              setRedName(event.target.value);
              setError("");
            }}
            placeholder="Nombre del competidor"
            autoComplete="off"
          />
        </div>
      </div>

      <fieldset className="quick-duration">
        <legend>
          <Clock3 aria-hidden="true" /> Tiempo del combate
        </legend>
        <div className="quick-duration__options">
          {quickDurations.map((duration) => (
            <button
              type="button"
              key={duration}
              aria-pressed={durationSeconds === duration}
              onClick={() => setDurationSeconds(duration)}
            >
              <strong>{duration / 60}</strong>
              <span>min</span>
            </button>
          ))}
        </div>
        <output>Duración seleccionada: {formatClock(durationSeconds)}</output>
      </fieldset>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button button--primary quick-start" type="submit">
        <Zap aria-hidden="true" />
        Iniciar combate rápido
        <ArrowRight aria-hidden="true" />
      </button>

      <a className="quick-advanced-link" href="/combates/nuevo">
        <Settings2 aria-hidden="true" />
        ¿Necesitas torneo, academia o categoría? Usar configuración completa
      </a>
    </form>
  );
}
