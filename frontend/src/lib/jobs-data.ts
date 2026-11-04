// frontend/src/lib/jobs-data.ts

// ⚠️ নিচের বিজ্ঞপ্তিগুলো সম্পূর্ণ ডেমো, কোনো আসল সংস্থার নয়।
// আসল বিজ্ঞপ্তি পরে Admin Panel থেকে যুক্ত হবে।

export const jobCategories = [
  "সরকারি চাকরি",
  "ব্যাংক চাকরি",
  "NTRCA",
  "NGO",
  "Private Jobs",
] as const;

export type JobCategory = (typeof jobCategories)[number];

export type JobItem = {
  id: string;
  org: string;
  category: JobCategory;
  posts: string;
  salary: string;
  deadline: string; // YYYY-MM-DD
  publishedAt: string; // YYYY-MM-DD
  qualification: string;
  applyInfo: string;
};

export const jobItems: JobItem[] = [
  {
    id: "j1",
    org: "ডেমো সরকারি দপ্তর",
    category: "সরকারি চাকরি",
    posts: "২০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-11-09",
    publishedAt: "2026-10-30",
    qualification: "স্নাতক বা সমমান (ডেমো)",
    applyInfo: "অনলাইনে আবেদন করতে হবে (ডেমো তথ্য)।",
  },
  {
    id: "j2",
    org: "ডেমো ব্যাংক লিমিটেড",
    category: "ব্যাংক চাকরি",
    posts: "১০০",
    salary: "৩৫,০০০ – ৭০,০০০",
    deadline: "2026-11-25",
    publishedAt: "2026-11-01",
    qualification: "স্নাতক, সর্বনিম্ন দ্বিতীয় শ্রেণি (ডেমো)",
    applyInfo: "ব্যাংকের ওয়েবসাইটে আবেদন (ডেমো তথ্য)।",
  },
  {
    id: "j3",
    org: "ডেমো NTRCA বিজ্ঞপ্তি",
    category: "NTRCA",
    posts: "১,০০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-12-05",
    publishedAt: "2026-11-02",
    qualification: "প্রযোজ্য বিষয়ে স্নাতক ও প্রশিক্ষণ (ডেমো)",
    applyInfo: "নির্ধারিত পোর্টালে আবেদন (ডেমো তথ্য)।",
  },
  {
    id: "j4",
    org: "ডেমো প্রাথমিক শিক্ষা বিজ্ঞপ্তি",
    category: "সরকারি চাকরি",
    posts: "৫,০০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-12-15",
    publishedAt: "2026-11-03",
    qualification: "স্নাতক বা সমমান (ডেমো)",
    applyInfo: "অনলাইনে আবেদন (ডেমো তথ্য)।",
  },
  {
    id: "j5",
    org: "ডেমো এনজিও",
    category: "NGO",
    posts: "৫০",
    salary: "আলোচনা সাপেক্ষ",
    deadline: "2026-11-07",
    publishedAt: "2026-10-28",
    qualification: "প্রাসঙ্গিক অভিজ্ঞতাসহ স্নাতক (ডেমো)",
    applyInfo: "ইমেইলে সিভি পাঠাতে হবে (ডেমো তথ্য)।",
  },
  {
    id: "j6",
    org: "ডেমো টেলিকম কোম্পানি",
    category: "Private Jobs",
    posts: "২০",
    salary: "আলোচনা সাপেক্ষ",
    deadline: "2026-11-20",
    publishedAt: "2026-11-03",
    qualification: "প্রকৌশল বা ব্যবসায় শিক্ষায় স্নাতক (ডেমো)",
    applyInfo: "কোম্পানির ক্যারিয়ার পেজে আবেদন (ডেমো তথ্য)।",
  },
  {
    id: "j7",
    org: "ডেমো ব্যাংক (মেয়াদ শেষ হওয়ার উদাহরণ)",
    category: "ব্যাংক চাকরি",
    posts: "৫০",
    salary: "৩০,০০০ – ৫০,০০০",
    deadline: "2026-10-25",
    publishedAt: "2026-10-10",
    qualification: "স্নাতক (ডেমো)",
    applyInfo: "আবেদনের সময় শেষ (ডেমো তথ্য)।",
  },
];