// frontend/src/lib/current-affairs-data.ts

// ⚠️ নিচের সব আইটেম ডেমো। কোনো আসল খবর বা পরিসংখ্যান এখানে নেই।
// আসল কারেন্ট অ্যাফেয়ার্স পরে Admin Panel থেকে প্রতিদিন যুক্ত হবে।

export const currentAffairsCategories = [
  "Bangladesh",
  "International",
  "Economy",
  "Science & Technology",
  "Sports",
] as const;

export type CurrentAffairsCategory = (typeof currentAffairsCategories)[number];

export type CurrentAffairsItem = {
  id: string;
  category: CurrentAffairsCategory;
  title: string;
  detail: string;
  date: string; // YYYY-MM-DD
  source: string;
  important: boolean; // পরীক্ষার জন্য গুরুত্বপূর্ণ
};

export const categoryColors: Record<CurrentAffairsCategory, string> = {
  Bangladesh: "#16a34a",
  International: "#2563eb",
  Economy: "#d97706",
  "Science & Technology": "#0891b2",
  Sports: "#7c3aed",
};

export const currentAffairsItems: CurrentAffairsItem[] = [
  {
    id: "ca1",
    category: "Bangladesh",
    title: "ডেমো: জাতীয় অবকাঠামো প্রকল্প বিষয়ক সাম্প্রতিক হালনাগাদ",
    detail:
      "এটি একটি ডেমো আইটেম। এখানে প্রকল্পের নাম, ব্যয়, সময়সীমা ও পরীক্ষার জন্য প্রাসঙ্গিক গুরুত্বপূর্ণ পয়েন্ট থাকবে।",
    date: "2026-11-03",
    source: "Admin (ডেমো)",
    important: true,
  },
  {
    id: "ca2",
    category: "International",
    title: "ডেমো: আন্তর্জাতিক সংস্থার সাম্প্রতিক সম্মেলন",
    detail:
      "এটি একটি ডেমো আইটেম। সম্মেলনের স্থান, তারিখ, সিদ্ধান্ত ও বাংলাদেশের অংশগ্রহণ এখানে বিস্তারিত লেখা হবে।",
    date: "2026-11-03",
    source: "Admin (ডেমো)",
    important: true,
  },
  {
    id: "ca3",
    category: "Economy",
    title: "ডেমো: অর্থনৈতিক সূচক ও বাজেট সংক্রান্ত তথ্য",
    detail:
      "এটি একটি ডেমো আইটেম। জিডিপি, মূল্যস্ফীতি, রিজার্ভ ইত্যাদি বিষয়ে সর্বশেষ তথ্য ও উৎস এখানে থাকবে।",
    date: "2026-11-02",
    source: "Admin (ডেমো)",
    important: false,
  },
  {
    id: "ca4",
    category: "Science & Technology",
    title: "ডেমো: বিজ্ঞান ও প্রযুক্তি জগতের সাম্প্রতিক উদ্ভাবন",
    detail:
      "এটি একটি ডেমো আইটেম। নতুন আবিষ্কার, মহাকাশ অভিযান বা প্রযুক্তি-নীতি বিষয়ক সংক্ষিপ্ত বিবরণ এখানে থাকবে।",
    date: "2026-11-01",
    source: "Admin (ডেমো)",
    important: false,
  },
  {
    id: "ca5",
    category: "Sports",
    title: "ডেমো: ক্রীড়া জগতের সাম্প্রতিক খবর",
    detail:
      "এটি একটি ডেমো আইটেম। টুর্নামেন্টের ফলাফল, রেকর্ড ও পুরস্কার বিষয়ক পরীক্ষার উপযোগী তথ্য এখানে থাকবে।",
    date: "2026-10-31",
    source: "Admin (ডেমো)",
    important: false,
  },
  {
    id: "ca6",
    category: "Bangladesh",
    title: "ডেমো: সাম্প্রতিক নীতিমালা ও আইন সংশোধন",
    detail:
      "এটি একটি ডেমো আইটেম। নতুন আইন, অধ্যাদেশ বা নীতিমালার নাম, তারিখ ও গুরুত্বপূর্ণ ধারা এখানে লেখা হবে।",
    date: "2026-10-30",
    source: "Admin (ডেমো)",
    important: true,
  },
  {
    id: "ca7",
    category: "International",
    title: "ডেমো: আন্তর্জাতিক পুরস্কার ও সম্মাননা",
    detail:
      "এটি একটি ডেমো আইটেম। পুরস্কারের নাম, বিজয়ী ও ক্ষেত্র সম্পর্কিত তথ্য এখানে সংরক্ষিত হবে।",
    date: "2026-10-29",
    source: "Admin (ডেমো)",
    important: false,
  },
  {
    id: "ca8",
    category: "Economy",
    title: "ডেমো: বাণিজ্য ও রপ্তানি বিষয়ক হালনাগাদ",
    detail:
      "এটি একটি ডেমো আইটেম। রপ্তানি আয়, প্রধান পণ্য ও বাণিজ্য চুক্তি সংক্রান্ত তথ্য এখানে থাকবে।",
    date: "2026-10-28",
    source: "Admin (ডেমো)",
    important: true,
  },
];