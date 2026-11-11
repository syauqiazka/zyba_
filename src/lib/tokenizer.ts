/**
 * ZYBA Tokenizer Utility
 * Menghitung estimasi token untuk teks masukan & luaran percakapan ZYBA Companion.
 * Formula diselaraskan dengan representasi BPE/SentencePiece untuk bahasa Indonesia & Inggris.
 */

export function estimateTokens(text: string | null | undefined): number {
  if (!text) return 0;
  const cleaned = text.trim();
  if (cleaned.length === 0) return 0;

  // Rasio karakter & kata untuk teks bahasa Indonesia & bahasa Inggris
  const chars = cleaned.length;
  const words = cleaned.split(/\s+/).length;

  const byChars = Math.ceil(chars / 3.7);
  const byWords = Math.ceil(words * 1.35);

  return Math.max(1, Math.round((byChars + byWords) / 2));
}

export function estimateHistoryTokens(
  history?: Array<{ role?: string; content?: string }>
): number {
  if (!Array.isArray(history) || history.length === 0) return 0;
  let total = 0;
  for (const item of history) {
    if (item?.content) {
      total += estimateTokens(item.content) + 4; // 4 overhead token per turn delimiter
    }
  }
  return total;
}

