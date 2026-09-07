type TimerCue = "start" | "countdown" | "finish";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playTone(
  context: AudioContext,
  frequency: number,
  startsAt: number,
  duration: number,
  volume = 0.08,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

function vibrate(pattern: VibratePattern): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export function signalTimer(cue: TimerCue): void {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime + 0.02;
  if (cue === "start") {
    playTone(context, 880, now, 0.08);
    return;
  }

  if (cue === "countdown") {
    playTone(context, 720, now, 0.045, 0.05);
    vibrate(12);
    return;
  }

  playTone(context, 880, now, 0.16, 0.1);
  playTone(context, 880, now + 0.24, 0.16, 0.1);
  playTone(context, 1175, now + 0.48, 0.42, 0.12);
  vibrate([120, 70, 120, 70, 360]);
}
