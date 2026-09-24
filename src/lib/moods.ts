export const MOODS = [
    { value: "DEPRESSED", label: "Depressed", emoji: "\u{1F61E}", bg: "#A99BE0", text: "text-white" },
    { value: "SAD", label: "Sad", emoji: "\u{1F641}", bg: "#EE8A5E", text: "text-white" },
    { value: "NEUTRAL", label: "Neutral", emoji: "\u{1F610}", bg: "#6B5645", text: "text-white" },
    { value: "HAPPY", label: "Happy", emoji: "\u{1F642}", bg: "#E8C24A", text: "text-brown-900" },
    { value: "OVERJOYED", label: "Overjoyed", emoji: "\u{1F604}", bg: "#8FAE5D", text: "text-white" },
] as const;

export type Mood = (typeof MOODS)[number];