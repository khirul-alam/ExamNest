// frontend/src/lib/jobs-data.ts

// ⚠️ নিচের বিজ্ঞপ্তিগুলো সম্পূর্ণ ডেমো, কোনো আসল সংস্থার নয়।
// আবেদনের লিংক example.com (ইন্টারনেটে শুধু উদাহরণের জন্য সংরক্ষিত ঠিকানা), কোনো আসল সাইট নয়।
// আসল বিজ্ঞপ্তি ও লিংক পরে Admin Panel থেকে যুক্ত হবে।

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
  summary: string; // সংক্ষিপ্ত বিবরণ
  posts: string;
  salary: string;
  deadline: string; // আবেদনের শেষ তারিখ, YYYY-MM-DD
  publishedAt: string; // প্রকাশের তারিখ, YYYY-MM-DD
  qualification: string;
  applyInfo: string;
  applyUrl: string; // আবেদনের লিংক
};

export const jobItems: JobItem[] = [
  {
    id: "j1",
    org: "ডেমো সরকারি দপ্তর",
    category: "সরকারি চাকরি",
    summary: "ডেমো: পদের নাম, যোগ্যতা ও আবেদনের নিয়মের সংক্ষিপ্ত বিবরণ এখানে থাকবে।",
    posts: "২০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-11-09",
    publishedAt: "2026-10-30",
    qualification: "স্নাতক বা সমমান (ডেমো)",
    applyInfo: "অনলাইনে আবেদন করতে হবে (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j1",
  },
  {
    id: "j2",
    org: "ডেমো ব্যাংক লিমিটেড",
    category: "ব্যাংক চাকরি",
    summary: "ডেমো: ব্যাংকের নিয়োগ বিজ্ঞপ্তির মূল শর্ত ও আবেদনের সময়সীমার সারাংশ এখানে থাকবে।",
    posts: "১০০",
    salary: "৩৫,০০০ – ৭০,০০০",
    deadline: "2026-11-25",
    publishedAt: "2026-11-01",
    qualification: "স্নাতক, সর্বনিম্ন দ্বিতীয় শ্রেণি (ডেমো)",
    applyInfo: "ব্যাংকের ওয়েবসাইটে আবেদন (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j2",
  },
  {
    id: "j3",
    org: "ডেমো NTRCA বিজ্ঞপ্তি",
    category: "NTRCA",
    summary: "ডেমো: শিক্ষক নিবন্ধনের পদসংখ্যা, বিষয় ও আবেদনের সারসংক্ষেপ এখানে থাকবে।",
    posts: "১,০০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-12-05",
    publishedAt: "2026-11-02",
    qualification: "প্রযোজ্য বিষয়ে স্নাতক ও প্রশিক্ষণ (ডেমো)",
    applyInfo: "নির্ধারিত পোর্টালে আবেদন (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j3",
  },
  {
    id: "j4",
    org: "ডেমো প্রাথমিক শিক্ষা বিজ্ঞপ্তি",
    category: "সরকারি চাকরি",
    summary: "ডেমো: সহকারী শিক্ষক পদের যোগ্যতা, পরীক্ষার ধাপ ও আবেদনের সারসংক্ষেপ এখানে থাকবে।",
    posts: "৫,০০০+",
    salary: "গ্রেড অনুযায়ী",
    deadline: "2026-12-15",
    publishedAt: "2026-11-03",
    qualification: "স্নাতক বা সমমান (ডেমো)",
    applyInfo: "অনলাইনে আবেদন (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j4",
  },
  {
    id: "j5",
    org: "ডেমো এনজিও",
    category: "NGO",
    summary: "ডেমো: প্রকল্প কর্মকর্তার দায়িত্ব, অভিজ্ঞতার শর্ত ও আবেদনের নিয়ম এখানে থাকবে।",
    posts: "৫০",
    salary: "আলোচনা সাপেক্ষ",
    deadline: "2026-11-07",
    publishedAt: "2026-10-28",
    qualification: "প্রাসঙ্গিক অভিজ্ঞতাসহ স্নাতক (ডেমো)",
    applyInfo: "ইমেইলে সিভি পাঠাতে হবে (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j5",
  },
  {
    id: "j6",
    org: "ডেমো টেলিকম কোম্পানি",
    category: "Private Jobs",
    summary: "ডেমো: কোম্পানির পদের বিবরণ, প্রয়োজনীয় দক্ষতা ও আবেদনের নিয়ম এখানে থাকবে।",
    posts: "২০",
    salary: "আলোচনা সাপেক্ষ",
    deadline: "2026-11-20",
    publishedAt: "2026-11-03",
    qualification: "প্রকৌশল বা ব্যবসায় শিক্ষায় স্নাতক (ডেমো)",
    applyInfo: "কোম্পানির ক্যারিয়ার পেজে আবেদন (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j6",
  },
  {
    id: "j7",
    org: "ডেমো ব্যাংক (মেয়াদ শেষ হওয়ার উদাহরণ)",
    category: "ব্যাংক চাকরি",
    summary: "ডেমো: মেয়াদ শেষ হয়ে যাওয়া বিজ্ঞপ্তি কেমন দেখায় তা বোঝানোর উদাহরণ।",
    posts: "৫০",
    salary: "৩০,০০০ – ৫০,০০০",
    deadline: "2026-10-25",
    publishedAt: "2026-10-10",
    qualification: "স্নাতক (ডেমো)",
    applyInfo: "আবেদনের সময় শেষ (ডেমো তথ্য)।",
    applyUrl: "https://example.com/apply/j7",
  },
];

export function getJobItem(id: string): JobItem | undefined {
  return jobItems.find((job) => job.id === id);
}

// আবেদনের লিংক শুধু http/https হলে ফেরত দেয়, নইলে null (javascript: ধরনের ক্ষতিকর লিংক ঠেকাতে)
export function getSafeApplyUrl(job: JobItem): string | null {
  try {
    const url = new URL(job.applyUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}