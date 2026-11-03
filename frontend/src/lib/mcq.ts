// frontend/src/lib/mcq.ts

// অপশনের বাংলা লেবেল (ক, খ, গ, ঘ)
export const optionLabels = ["ক", "খ", "গ", "ঘ"] as const;

export type Frequency = {
  level: "very" | "important" | "moderate";
  emoji: string;
  label: string;
  className: string;
};

// কতবার প্রশ্ন এসেছে সেই সংখ্যা থেকে Frequency ট্যাগ নির্ধারণ (SRS অনুযায়ী)
export function getFrequency(timesAsked: number): Frequency {
  if (timesAsked >= 5) {
    return { level: "very", emoji: "🔥", label: "অত্যন্ত গুরুত্বপূর্ণ", className: "text-red-500" };
  }
  if (timesAsked >= 3) {
    return { level: "important", emoji: "⭐", label: "গুরুত্বপূর্ণ", className: "text-amber-600" };
  }
  return { level: "moderate", emoji: "📌", label: "মাঝারি", className: "text-muted-foreground" };
}