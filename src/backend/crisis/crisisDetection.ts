/**
 * Backend Crisis Detection & Safety Engine
 */

const RISK_KEYWORDS = [
  "bunuh diri",
  "mengakhiri hidup",
  "tidak ingin hidup",
  "menyakiti diri",
  "self harm",
  "self-harm",
  "suicide",
];

export function detectRisk(text: string): boolean {
  const normalized = text.toLowerCase();
  return RISK_KEYWORDS.some((kw) => normalized.includes(kw));
}

export const CRISIS_RESOURCES = {
  message:
    "Kami ingin memastikan kamu aman. Kamu tidak sendirian, dan ada bantuan yang bisa dihubungi sekarang.",
  hotlines: [
    { name: "Layanan Sejiwa (Kemenkes)", contact: "119 ext. 8" },
    { name: "Into The Light Indonesia", contact: "https://www.intothelightid.org" },
    { name: "LISA Suicide Prevention Helpline", contact: "081-1-3855-472" },
  ],
};
