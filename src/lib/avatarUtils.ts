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
  return (
    avatarUrl.startsWith("http://") ||
    avatarUrl.startsWith("https://") ||
    avatarUrl.startsWith("data:image/") ||
    avatarUrl.startsWith("/") ||
    avatarUrl.startsWith("blob:")
  );
}

/** Resolve avatar string to display value */
export function resolveAvatar(avatarUrl?: string | null): string {
  if (!avatarUrl) return "🦊";
  if (isAvatarUrl(avatarUrl)) return avatarUrl;
  return AVATAR_EMOJI_MAP[avatarUrl] || avatarUrl || "🦊";
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
