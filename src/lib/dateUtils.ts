/**
 * Helper format waktu relatif & tanggal Indonesia cerdas
 * Menghindari teks statis "Baru saja" untuk konten kemarin/lama
 */

export function formatRelativeTime(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return "Baru saja";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Baru saja";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Jika waktu di masa depan atau selisih < 45 detik
  if (diffMs < 45 * 1000 && diffMs >= -5000) {
    return "Baru saja";
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Menit
  if (diffMin < 60) {
    return `${Math.max(1, diffMin)}m lalu`;
  }

  // Jam (pada hari yang sama)
  if (diffHours < 24 && date.getDate() === now.getDate() && date.getMonth() === now.getMonth()) {
    return `${diffHours}j lalu`;
  }

  // Cek apakah kemarin
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isYesterday) {
    return `Kemarin, ${timeStr}`;
  }

  // < 7 hari
  if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  }

  // Lebih lama: Format tanggal Indonesia (mis. 23 Sep atau 23 Sep 2025)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format tanggal untuk separator pesan chat (misal: "Hari ini", "Kemarin", "Rabu, 24 September 2026")
 */
export function formatChatDateSeparator(dateInput: string | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Hari ini";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Helper cek apakah dua timestamp berada di tanggal kalender yang sama
 */
export function isSameCalendarDay(d1: string | Date, d2: string | Date): boolean {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format timestamp untuk preview daftar chat sidebar (mis. "14:20", "Kemarin", "23 Sep")
 */
export function formatChatListTime(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Kemarin";

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  });
}

