// frontend/src/lib/nav.ts
import {
  BookOpen,
  Briefcase,
  Clock,
  FileText,
  Home,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// লগইন ছাড়া ও লগইন করা, উভয় ব্যবহারকারীর জন্য সাধারণ লিংক
export const baseLinks: NavLink[] = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/subjects", label: "বিষয়সমূহ", icon: BookOpen },
  { href: "/model-test", label: "মডেল টেস্ট", icon: FileText },
  { href: "/previous-questions", label: "বিগত প্রশ্ন", icon: Clock },
  { href: "/current-affairs", label: "কারেন্ট অ্যাফেয়ার্স", icon: Star },
  { href: "/job-circular", label: "চাকরির বিজ্ঞপ্তি", icon: Briefcase },
];

// শুধু লগইন করা ব্যবহারকারীর জন্য অতিরিক্ত লিংক
export const memberLinks: NavLink[] = [
  ...baseLinks,
  { href: "/leaderboard", label: "লিডারবোর্ড", icon: Trophy },
];