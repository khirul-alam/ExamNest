// frontend/src/lib/dashboard-data.ts

// ⚠️ এই ফাইলের সব ডাটা ডেমো। ব্যাকএন্ড যুক্ত হলে ব্যবহারকারীর আসল তথ্য দিয়ে বদলানো হবে।

export const demoAccount = {
  name: "ডেমো ব্যবহারকারী",
  email: "demo@examnest.test",
  planName: "ফ্রি ট্রায়াল",
  trialDaysTotal: 7,
  trialDaysLeft: 5,
};

export const demoStats = {
  streakDays: 14,
  totalQuestions: 1247,
  averagePercent: 78,
  bestPercent: 95,
};

// সাপ্তাহিক প্রশ্ন সমাধানের সংখ্যা
export const weeklyActivity = [
  { day: "রবি", questions: 45 },
  { day: "সোম", questions: 72 },
  { day: "মঙ্গল", questions: 38 },
  { day: "বুধ", questions: 90 },
  { day: "বৃহ", questions: 60 },
  { day: "শুক্র", questions: 55 },
  { day: "শনি", questions: 80 },
];

export type ActivityType = "exam" | "read" | "quiz";

export const recentActivity: {
  action: string;
  time: string;
  score?: string;
  type: ActivityType;
}[] = [
  { action: "ডেমো মডেল টেস্ট ১ সম্পন্ন", time: "২ ঘন্টা আগে", score: "৭২/১০০", type: "exam" },
  { action: "ভাষা আন্দোলন টপিক পড়েছেন", time: "৫ ঘন্টা আগে", type: "read" },
  { action: "Daily Quiz সম্পন্ন", time: "৮ ঘন্টা আগে", score: "১৮/২০", type: "quiz" },
  { action: "সাধারণ বিজ্ঞান অনুশীলন", time: "গতকাল", score: "৩৫/৫০", type: "exam" },
];

// পরীক্ষার ইতিহাস (ডেমো)
export const examHistory = [
  { id: "h1", title: "ডেমো মডেল টেস্ট ১", date: "2026-11-03", score: 72, total: 100 },
  { id: "h2", title: "টপিক পরীক্ষা — ভাষা আন্দোলন", date: "2026-11-01", score: 8.5, total: 10 },
  { id: "h3", title: "ডেমো মডেল টেস্ট ২", date: "2026-10-29", score: 54, total: 100 },
  { id: "h4", title: "সাধারণ বিজ্ঞান অনুশীলন", date: "2026-10-27", score: 35, total: 50 },
];

// ব্যাজ: Streak ও প্রশ্ন সংখ্যার সাথে মিল রেখে অর্জিত/অনর্জিত
export const badges = [
  { name: "সাত দিনের পাঠক", icon: "🥉", desc: "৭ দিনের Streak", earned: true },
  { name: "ধারাবাহিক পাঠক", icon: "🥇", desc: "৩০ দিনের Streak", earned: false },
  { name: "MCQ মাস্টার", icon: "🥈", desc: "৫০০ প্রশ্ন সমাধান", earned: true },
  { name: "চ্যাম্পিয়ন", icon: "🏆", desc: "প্রথম স্থান অর্জন", earned: false },
];

const earlierActiveDays = new Set([2, 4, 5, 8, 11, 12, 16, 18]);

// গত ৩৫ দিনের Study Streak ক্যালেন্ডারের ঘর (শেষ ঘরটি আজ)
export function getStreakCells(): { active: boolean; today: boolean }[] {
  return Array.from({ length: 35 }, (_, index) => ({
    active: index >= 21 || earlierActiveDays.has(index),
    today: index === 34,
  }));
}