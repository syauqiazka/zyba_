export function slugifyResourceTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getResourceSlug(title: string): string {
  return slugifyResourceTitle(title);
}

export function getResourceDescription(
  body: string | null | undefined,
  fallback = "Sumber daya kesehatan mental dan wellness dari ZYBA."
): string {
  const text = body?.replace(/\s+/g, " ").trim();

  if (!text) {
    return fallback;
  }

  return text.length > 160
    ? `${text.slice(0, 157).trimEnd()}...`
    : text;
}
