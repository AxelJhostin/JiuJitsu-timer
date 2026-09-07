import { matchStateSchema, type MatchState } from "@/domain/match";

export const ACTIVE_MATCH_KEY = "tatami-score:active-match";
export const MATCH_HISTORY_KEY = "tatami-score:match-history";
const TECHNIQUE_PROMPT_DISMISSED_PREFIX =
  "tatami-score:technique-prompt-dismissed:";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadActiveMatch(): MatchState | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(ACTIVE_MATCH_KEY);
  if (!raw) return null;
  try {
    const parsed = matchStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    window.localStorage.removeItem(ACTIVE_MATCH_KEY);
    return null;
  }
}

export function saveActiveMatch(match: MatchState): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACTIVE_MATCH_KEY, JSON.stringify(match));
  window.dispatchEvent(
    new CustomEvent("tatami-score:match-change", { detail: match }),
  );
}

export function loadMatchHistory(): MatchState[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(MATCH_HISTORY_KEY);
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.flatMap((item) => {
      const result = matchStateSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    window.localStorage.removeItem(MATCH_HISTORY_KEY);
    return [];
  }
}

export function archiveMatch(match: MatchState): void {
  if (!canUseStorage()) return;
  const history = loadMatchHistory().filter((item) => item.id !== match.id);
  window.localStorage.setItem(
    MATCH_HISTORY_KEY,
    JSON.stringify([match, ...history].slice(0, 100)),
  );
  saveActiveMatch(match);
}

export function isTechniquePromptDismissed(matchId: string): boolean {
  if (!canUseStorage()) return false;
  return (
    window.localStorage.getItem(
      `${TECHNIQUE_PROMPT_DISMISSED_PREFIX}${matchId}`,
    ) === "true"
  );
}

export function dismissTechniquePrompt(matchId: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    `${TECHNIQUE_PROMPT_DISMISSED_PREFIX}${matchId}`,
    "true",
  );
}

export async function syncMatch(match: MatchState): Promise<boolean> {
  try {
    const response = await fetch(`/api/matches/${match.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(match),
    });
    return response.ok;
  } catch {
    return false;
  }
}
