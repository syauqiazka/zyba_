export const MOODS = [
    { value: "DEPRESSED", label: "Sangat Terpuruk", emoji: "😞", bg: "#A99BE0", text: "text-white" },
    { value: "SAD", label: "Sedih", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
    { value: "NEUTRAL", label: "Biasa Saja", emoji: "😐", bg: "#6B5645", text: "text-white" },
    { value: "HAPPY", label: "Senang", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
    { value: "OVERJOYED", label: "Sangat Bahagia", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

export type Mood = (typeof MOODS)[number];