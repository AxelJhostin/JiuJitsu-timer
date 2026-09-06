import { Pause, Play } from "lucide-react";
import { formatClock, type MatchStatus } from "@/domain/match";

interface MatchTimerProps {
  remainingSeconds: number;
  durationSeconds: number;
  status: MatchStatus;
  onToggle: () => void;
}

export function MatchTimer({
  remainingSeconds,
  durationSeconds,
  status,
  onToggle,
}: MatchTimerProps) {
  const isRunning = status === "running";
  const isFinished = status === "finished";
  const urgent = remainingSeconds <= 30 && remainingSeconds > 0;

  return (
    <section
      className={`match-timer ${urgent ? "match-timer--urgent" : ""}`}
      aria-label="Cronómetro del combate"
    >
      <div>
        <div className="match-timer__meta">
          <span className="chip">IBJJF {formatClock(durationSeconds)}</span>
          <span className={`timer-status timer-status--${status}`}>
            {isRunning
              ? "Activo"
              : status === "paused"
                ? remainingSeconds === 0
                  ? "Tiempo"
                  : "Pausado"
                : status === "ready"
                  ? "Listo"
                  : "Finalizado"}
          </span>
        </div>
        <output
          className="match-timer__clock"
          aria-live={urgent ? "polite" : "off"}
        >
          {formatClock(remainingSeconds)}
        </output>
      </div>

      <button
        className="timer-toggle"
        type="button"
        onClick={onToggle}
        disabled={isFinished}
        aria-label={isRunning ? "Pausar cronómetro" : "Iniciar cronómetro"}
      >
        {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        <span>
          {isRunning ? "Pausar" : status === "ready" ? "Iniciar" : "Continuar"}
        </span>
      </button>
    </section>
  );
}
