// frontend/src/lib/leaderboard-data.ts

// ⚠️ লিডারবোর্ডের সব ডাটা ডেমো, কোনো আসল ব্যবহারকারী নয়।

export const leaderboardTabs = [
  { id: "daily", label: "দৈনিক" },
  { id: "weekly", label: "সাপ্তাহিক" },
  { id: "monthly", label: "মাসিক" },
  { id: "overall", label: "সার্বিক" },
] as const;

export type LeaderboardTab = (typeof leaderboardTabs)[number]["id"];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  accuracy: number; // সঠিক উত্তরের শতকরা হার
  streak: number;
};

const letters = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ট"];

// প্রতি ট্যাবে স্কোরের গুণক (দীর্ঘ সময়ে স্কোর বেশি)
const scoreScale: Record<LeaderboardTab, number> = {
  daily: 1,
  weekly: 6,
  monthly: 22,
  overall: 90,
};

// স্থির নিয়মে বানানো শীর্ষ ১০ জনের ডেমো তালিকা (Math.random ছাড়া, তাই সার্ভার-ব্রাউজারে একই)
export function getLeaderboard(tab: LeaderboardTab): LeaderboardEntry[] {
  return letters.map((letter, index) => ({
    rank: index + 1,
    name: `ডেমো শিক্ষার্থী ${letter}`,
    avatar: letter,
    score: Math.round((980 - index * 22) * scoreScale[tab]),
    accuracy: 98 - index * 2,
    streak: Math.max(5, 45 - index * 4),
  }));
}

// ব্যবহারকারীর নিজের ডেমো অবস্থান
export const myPosition: Record<LeaderboardTab, { rank: number; pointsToNext: number }> = {
  daily: { rank: 57, pointsToNext: 12 },
  weekly: { rank: 42, pointsToNext: 4 },
  monthly: { rank: 38, pointsToNext: 30 },
  overall: { rank: 120, pointsToNext: 85 },
};