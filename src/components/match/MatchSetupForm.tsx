import React from "react";
import { ArrowLeftRight, Play, ShieldCheck } from "lucide-react";
import {
  createMatchState,
  formatClock,
  IBJJF_RULESET,
  type MatchMode,
} from "@/domain/match";
import { saveActiveMatch } from "@/lib/storage";

const durations = [180, 300, 360, 480, 600];

export function MatchSetupForm() {
  const [blueName, setBlueName] = React.useState("Carlos Mendoza");
  const [blueAcademy, setBlueAcademy] = React.useState("Alliance BJJ");
  const [redName, setRedName] = React.useState("Mateo Rivera");
  const [redAcademy, setRedAcademy] = React.useState("Gracie Barra");
  const [tournament, setTournament] = React.useState(
    "Copa Andina de Jiu-Jitsu",
  );
  const [division, setDivision] = React.useState(
    "Adultos · Azul · Medio (-82.3 kg)",
  );
  const [mat, setMat] = React.useState("Tatami 2");
  const [mode, setMode] = React.useState<MatchMode>("gi");
  const [durationSeconds, setDurationSeconds] = React.useState(360);
  const [error, setError] = React.useState("");

  const swapCorners = () => {
    setBlueName(redName);
    setBlueAcademy(redAcademy);
    setRedName(blueName);
    setRedAcademy(blueAcademy);
  };

  const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (blueName.trim().length < 2 || redName.trim().length < 2) {
      setError("Ingresa el nombre de ambos competidores.");
      return;
    }

    const match = createMatchState({
      id: crypto.randomUUID(),
      tournament: tournament.trim(),
      mat: mat.trim(),
      division: division.trim(),
      mode,
      rulesetId: IBJJF_RULESET.id,
      rulesetVersion: IBJJF_RULESET.version,
      durationSeconds,
      blue: {
        name: blueName.trim(),
        academy: blueAcademy.trim(),
        belt: "azul",
      },
      red: {
        name: redName.trim(),
        academy: redAcademy.trim(),
        belt: "azul",
      },
    });

    saveActiveMatch(match);
    window.location.href = "/marcador";
  };

  return (
    <form className="setup-form" onSubmit={submit}>
      <section className="setup-preview panel">
        <div className="setup-preview__meta">
          <span>Previsualización en pantalla</span>
          <span className="chip">
            {mode === "gi" ? "Gi" : "No-Gi"} · Adulto
          </span>
        </div>
        <div className="setup-preview__board">
          <div className="setup-preview__fighter setup-preview__fighter--blue">
            <span>Azul</span>
            <strong>{blueName || "Competidor azul"}</strong>
            <small>{blueAcademy || "Academia"}</small>
            <b>0</b>
          </div>
          <output>{formatClock(durationSeconds)}</output>
          <div className="setup-preview__fighter setup-preview__fighter--red">
            <span>Rojo</span>
            <strong>{redName || "Competidor rojo"}</strong>
            <small>{redAcademy || "Academia"}</small>
            <b>0</b>
          </div>
        </div>
      </section>

      <div className="setup-section-heading">
        <span>Atletas en tatami</span>
        <button
          className="button button--ghost button--compact"
          type="button"
          onClick={swapCorners}
        >
          <ArrowLeftRight aria-hidden="true" /> Invertir esquinas
        </button>
      </div>

      <div className="setup-corners">
        <section className="competitor-form competitor-form--blue panel">
          <h2>Esquina azul</h2>
          <div className="field">
            <label htmlFor="blue-name">Nombre del competidor</label>
            <input
              id="blue-name"
              className="input"
              value={blueName}
              onChange={(event) => setBlueName(event.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="blue-academy">Academia / equipo</label>
            <input
              id="blue-academy"
              className="input"
              value={blueAcademy}
              onChange={(event) => setBlueAcademy(event.target.value)}
              autoComplete="off"
            />
          </div>
        </section>

        <section className="competitor-form competitor-form--red panel">
          <h2>Esquina roja</h2>
          <div className="field">
            <label htmlFor="red-name">Nombre del competidor</label>
            <input
              id="red-name"
              className="input"
              value={redName}
              onChange={(event) => setRedName(event.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="red-academy">Academia / equipo</label>
            <input
              id="red-academy"
              className="input"
              value={redAcademy}
              onChange={(event) => setRedAcademy(event.target.value)}
              autoComplete="off"
            />
          </div>
        </section>
      </div>

      <section className="setup-block panel">
        <h2>Datos del torneo y división</h2>
        <div className="setup-fields-grid">
          <div className="field">
            <label htmlFor="tournament">Torneo</label>
            <input
              id="tournament"
              className="input"
              value={tournament}
              onChange={(event) => setTournament(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="mat">Tatami</label>
            <input
              id="mat"
              className="input"
              value={mat}
              onChange={(event) => setMat(event.target.value)}
            />
          </div>
          <div className="field setup-field--wide">
            <label htmlFor="division">División y peso</label>
            <input
              id="division"
              className="input"
              value={division}
              onChange={(event) => setDivision(event.target.value)}
            />
          </div>
        </div>

        <fieldset className="segmented-field">
          <legend>Modalidad</legend>
          <div>
            <button
              type="button"
              aria-pressed={mode === "gi"}
              onClick={() => setMode("gi")}
            >
              Gi (kimono)
            </button>
            <button
              type="button"
              aria-pressed={mode === "no-gi"}
              onClick={() => setMode("no-gi")}
            >
              No-Gi
            </button>
          </div>
        </fieldset>
      </section>

      <section className="setup-block panel">
        <div className="setup-block__title">
          <h2>Duración del round</h2>
          <span className="chip">{formatClock(durationSeconds)} min</span>
        </div>
        <div className="duration-grid">
          {durations.map((duration) => (
            <button
              type="button"
              key={duration}
              aria-pressed={durationSeconds === duration}
              onClick={() => setDurationSeconds(duration)}
            >
              <strong>{duration / 60} min</strong>
              <span>
                {duration === 180
                  ? "Infantil"
                  : duration === 360
                    ? "Azul adulto"
                    : duration === 600
                      ? "Negra"
                      : "Rápido"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="ruleset-card panel">
        <ShieldCheck aria-hidden="true" />
        <div>
          <span className="eyebrow">Reglamento aplicado</span>
          <h2>IBJJF estándar</h2>
          <p>
            +2 derribo, barrido y rodilla; +3 pase; +4 montada y espalda.
            Ventajas y penalizaciones escalonadas.
          </p>
        </div>
        <span className="status-badge status-badge--ready">Activo</span>
      </section>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="setup-submit-bar">
        <a className="button" href="/">
          Volver
        </a>
        <button className="button button--primary" type="submit">
          <Play aria-hidden="true" /> Iniciar combate
        </button>
      </div>
    </form>
  );
}
