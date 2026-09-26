/** Map avatar key (safe ASCII string) -> emoji for display */
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
  "🦊": "🦊",
  "🐼": "🐼",
  "🦁": "🦁",
  "🐰": "🐰",
  "🐨": "🐨",
  "🐱": "🐱",
  "🌿": "🌿",
  "🌸": "🌸",
};

/** Check if avatar value is an uploaded image URL (not an emoji key) */
export function isAvatarUrl(avatarUrl?: string | null): boolean {
  if (!avatarUrl) return false;
  const trimmed = avatarUrl.trim();
  // If it's a known preset emoji key or an emoji itself, it is NOT an image URL
  if (AVATAR_EMOJI_MAP[trimmed.toLowerCase()]) return false;
  
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)
  );
}

/** Resolve avatar string to fallback emoji (never returns raw URL string) */
export function getFallbackEmoji(avatarUrl?: string | null): string {
  if (!avatarUrl) return "🦊";
  const trimmed = avatarUrl.trim().toLowerCase();
  return AVATAR_EMOJI_MAP[trimmed] || "🦊";
}

/** Resolve avatar string to display value */
export function resolveAvatar(avatarUrl?: string | null): string {
  if (!avatarUrl) return "🦊";
  const trimmed = avatarUrl.trim();
  const lower = trimmed.toLowerCase();
  if (AVATAR_EMOJI_MAP[lower]) return AVATAR_EMOJI_MAP[lower];
  if (isAvatarUrl(trimmed)) return trimmed;
  return trimmed || "🦊";
}

/** Get initials from name for fallback display */
export function getInitials(name?: string | null): string {
  if (!name?.trim()) return "ZY";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
