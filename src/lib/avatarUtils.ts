/** Map avatar key (safe ASCII string) → emoji for display */
export const AVATAR_EMOJI_MAP: Record<string, string> = {
  fox: "🦊",
  panda: "🐼",
  lion: "🦁",
  rabbit: "🐰",
  koala: "🐨",
  cat: "🐱",
  leaf: "🌿",
  flower: "🌸",
  fox_face: "🦊",
  // fallback for legacy raw emoji stored directly
  "🦊": "🦊",
  "🐼": "🐼",
  "🦁": "🦁",
  "🐰": "🐰",
  "🐨": "🐨",
  "🐱": "🐱",
  "🌿": "🌿",
  "🌸": "🌸",
};

/** Resolve avatar string (key or raw emoji) to a display emoji */
export function resolveAvatar(avatarUrl?: string | null): string {
  if (!avatarUrl) return "🦊";
  return AVATAR_EMOJI_MAP[avatarUrl] || "🦊";
}
