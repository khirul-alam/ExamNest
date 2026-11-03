// frontend/src/lib/landing-data.ts
import {
  BarChart2,
  BookOpen,
  Brain,
  Clock,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
};

export const features: Feature[] = [
  {
    icon: BookOpen,
    title: "বিষয়ভিত্তিক পড়াশোনা",
    desc: "প্রতিটি বিষয়ের Chapter ও Topic অনুযায়ী সহজ ব্যাখ্যা, Shortcut Techniques এবং BCS Special Notes।",
    color: "#0d6e4f",
  },
  {
    icon: Target,
    title: "MCQ Practice",
    desc: "Subject, Chapter ও Topic ভিত্তিক MCQ Practice। Smart Random Question System দিয়ে প্রতিবার নতুন প্রশ্ন।",
    color: "#2563eb",
  },
  {
    icon: Brain,
    title: "মডেল টেস্ট",
    desc: "BCS, Bank, NTRCA সহ সকল পরীক্ষার পূর্ণাঙ্গ মডেল টেস্ট। বাস্তব পরীক্ষার পরিবেশে অনুশীলন।",
    color: "#7c3aed",
  },
  {
    icon: Clock,
    title: "বিগত বছরের প্রশ্ন",
    desc: "BCS থেকে Bank, Primary পর্যন্ত সকল পরীক্ষার বিগত বছরের প্রশ্ন ও সমাধান।",
    color: "#dc2626",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    desc: "আপনার দুর্বল বিষয় চিহ্নিত করুন। Daily, Weekly ও Monthly Performance বিশ্লেষণ।",
    color: "#d97706",
  },
  {
    icon: Sparkles,
    title: "AI Recommendation",
    desc: "আপনার অগ্রগতি বিশ্লেষণ করে ব্যক্তিগত পড়ার পরিকল্পনা ও রিভিশন পরামর্শ।",
    color: "#0891b2",
  },
];

export type SubjectCard = {
  slug: string;
  name: string;
  icon: string;
  color: string;
};

// SRS অনুযায়ী ১০টি মূল বিষয় (পরে ডাটাবেজ থেকে আসবে)
export const subjects: SubjectCard[] = [
  { slug: "bangla-language-literature", name: "বাংলা ভাষা ও সাহিত্য", icon: "📖", color: "#dc2626" },
  { slug: "english-language-literature", name: "English Language and Literature", icon: "🔤", color: "#2563eb" },
  { slug: "bangladesh-affairs", name: "বাংলাদেশ বিষয়াবলি", icon: "🇧🇩", color: "#16a34a" },
  { slug: "international-affairs", name: "আন্তর্জাতিক বিষয়াবলি", icon: "🌍", color: "#7c3aed" },
  { slug: "geography-environment", name: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা", icon: "🗺️", color: "#059669" },
  { slug: "general-science", name: "সাধারণ বিজ্ঞান", icon: "🔬", color: "#0891b2" },
  { slug: "computer-it", name: "কম্পিউটার ও তথ্য প্রযুক্তি", icon: "💻", color: "#0d6e4f" },
  { slug: "mathematical-reasoning", name: "গাণিতিক যুক্তি", icon: "🧮", color: "#d97706" },
  { slug: "mental-skills", name: "মানসিক দক্ষতা", icon: "🧠", color: "#be185d" },
  { slug: "ethics-governance", name: "নৈতিকতা, মূল্যবোধ ও সুশাসন", icon: "⚖️", color: "#6d28d9" },
];

// প্ল্যান অনুযায়ী সুবিধার তালিকা
export const freeFeatures = [
  "Progress Tracking",
  "ড্যাশবোর্ড",
  "Leaderboard Access",
  "Bookmark System",
  "Exam History",
  "Wrong Answer Review",
  "Study Streak",
  "Achievement Badge",
];

export const premiumFeatures = [
  "Unlimited Model Test",
  "Premium Notes",
  "AI Analysis",
  "Ad Free Experience",
  "Advanced Analytics",
  "Smart Study Plan",
  "AI Chat Tutor",
  "Video Course",
];

// ⚠️ নিচের দুটি তালিকা ডেমো ডাটা। পরে Admin Panel থেকে আসা আসল ডাটা দিয়ে বদলানো হবে।
export const latestNews = [
  { cat: "Bangladesh", title: "পদ্মা সেতুর টোল আদায় ৫০০ কোটি টাকা ছাড়িয়েছে", time: "২ ঘন্টা আগে" },
  { cat: "International", title: "জাতিসংঘের নিরাপত্তা পরিষদের বৈঠকে বাংলাদেশ", time: "৫ ঘন্টা আগে" },
  { cat: "Economy", title: "রেমিট্যান্স আয়ে নতুন রেকর্ড — ২.৮ বিলিয়ন ডলার", time: "৮ ঘন্টা আগে" },
  { cat: "Science & Technology", title: "বঙ্গবন্ধু স্যাটেলাইট-২ উৎক্ষেপণের প্রস্তুতি চলছে", time: "১২ ঘন্টা আগে" },
];

export const latestJobs = [
  { org: "বাংলাদেশ সিভিল সার্ভিস", type: "সরকারি", posts: "২০০০+", deadline: "৩০ আগস্ট ২০২৬", urgent: true },
  { org: "সোনালী ব্যাংক লিমিটেড", type: "ব্যাংক", posts: "৩৫০", deadline: "১৫ সেপ্টেম্বর ২০২৬", urgent: false },
  { org: "NTRCA", type: "NTRCA", posts: "১৫,০০০+", deadline: "২০ সেপ্টেম্বর ২০২৬", urgent: false },
  { org: "প্রাথমিক শিক্ষা অধিদপ্তর", type: "সরকারি", posts: "৪০,০০০+", deadline: "১০ অক্টোবর ২০২৬", urgent: false },
];

export const categoryColors: Record<string, string> = {
  Bangladesh: "#16a34a",
  International: "#2563eb",
  Economy: "#d97706",
  "Science & Technology": "#0891b2",
  Sports: "#7c3aed",
};