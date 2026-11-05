// frontend/src/lib/quick-access.ts
import {
  BookOpen,
  Briefcase,
  Clock,
  FileText,
  Target,
  type LucideIcon,
} from "lucide-react";
import { modelTests, questionPool } from "@/lib/exam-data";
import { formatBanglaDate } from "@/lib/format";
import { jobItems } from "@/lib/jobs-data";
import { previousQuestions } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects, countTopics } from "@/lib/subjects-data";

export type QuickAccessItem = {
  href: string;
  label: string; // ক্রিয়াপদসহ ছোট বোতামের লেখা
  hint: string; // গন্তব্য পেজের ডাটা থেকে হিসাব করা ছোট তথ্য
  icon: LucideIcon;
  color: string;
  requiresLogin: boolean; // গন্তব্যে যেতে লগইন লাগে কিনা
};

// সবচেয়ে সাম্প্রতিক প্রকাশের তারিখ (YYYY-MM-DD লেখা তাই সরাসরি সাজানো যায়)
const latestJobDate = jobItems.map((job) => job.publishedAt).sort().reverse()[0];

const totalTopics = allSubjects.reduce((sum, subject) => sum + countTopics(subject), 0);

// প্রতিটি ছোট তথ্য আসল ডাটা ফাইল থেকে গোনা, তাই ডাটা বদলালে নিজে বদলাবে
export const quickAccessItems: QuickAccessItem[] = [
  {
    href: "/subjects",
    label: "পড়া শুরু করুন",
    hint: `${toBanglaNumber(totalTopics)}টি টপিক`,
    icon: BookOpen,
    color: "#0d6e4f",
    requiresLogin: false,
  },
  {
    href: "/exam",
    label: "প্র্যাকটিস করুন",
    hint: `${toBanglaNumber(questionPool.length)}টি প্রশ্নের ভান্ডার`,
    icon: Target,
    color: "#2563eb",
    requiresLogin: true,
  },
  {
    href: "/model-test",
    label: "মডেল টেস্ট দিন",
    hint: `${toBanglaNumber(modelTests.length)}টি মডেল টেস্ট`,
    icon: FileText,
    color: "#7c3aed",
    requiresLogin: true,
  },
  {
    href: "/previous-questions",
    label: "বিগত প্রশ্ন দেখুন",
    hint: `${toBanglaNumber(previousQuestions.length)}টি প্রশ্ন`,
    icon: Clock,
    color: "#dc2626",
    requiresLogin: false,
  },
  {
    href: "/job-circular",
    label: "নতুন চাকরি দেখুন",
    hint: `সর্বশেষ: ${formatBanglaDate(latestJobDate)}`,
    icon: Briefcase,
    color: "#d97706",
    requiresLogin: false,
  },
];