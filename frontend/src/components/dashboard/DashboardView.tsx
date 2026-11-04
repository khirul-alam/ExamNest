// frontend/src/components/dashboard/DashboardView.tsx
"use client";

import Link from "next/link";
import {
  Award,
  BarChart2,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Star,
  StickyNote,
  Target,
  TrendingUp,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import {
  badges,
  demoAccount,
  demoStats,
  examHistory,
  getStreakCells,
  recentActivity,
  weeklyActivity,
  type ActivityType,
} from "@/lib/dashboard-data";
import { formatBanglaDate } from "@/lib/format";
import { myPosition } from "@/lib/leaderboard-data";
import { PASS_PERCENT } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects } from "@/lib/subjects-data";

type Stat = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
};

const activityIcons: Record<ActivityType, { icon: LucideIcon; color: string }> = {
  exam: { icon: Target, color: "#0d6e4f" },
  read: { icon: BookOpen, color: "#2563eb" },
  quiz: { icon: Star, color: "#d97706" },
};

const quickLinks = [
  { href: "/bookmarks", label: "বুকমার্ক", icon: Bookmark },
  { href: "/notes", label: "নোট", icon: StickyNote },
  { href: "/leaderboard", label: "লিডারবোর্ড", icon: Trophy },
  { href: "/profile", label: "প্রোফাইল", icon: User },
];

const streakCells = getStreakCells();
const maxWeekly = Math.max(...weeklyActivity.map((d) => d.questions));

export function DashboardView() {
  const progress = useStudyProgress();

  // আসল (প্রিভিউ) Progress থেকে বিষয়ভিত্তিক হিসাব; শুধু যেসব বিষয়ে কনটেন্ট আছে
  const subjectRows = allSubjects
    .filter((subject) => subject.chapters.length > 0)
    .map((subject) => {
      const topics = subject.chapters.flatMap((c) => c.topics);
      const done = topics.filter((t) => progress.isCompleted(subject.slug, t.slug)).length;
      const chaptersDone = subject.chapters.filter((c) =>
        c.topics.every((t) => progress.isCompleted(subject.slug, t.slug)),
      ).length;
      return {
        subject,
        totalTopics: topics.length,
        done,
        chapters: subject.chapters.length,
        chaptersDone,
        percent: topics.length ? Math.round((done / topics.length) * 100) : 0,
      };
    });

  const stats: Stat[] = [
    {
      icon: Flame,
      label: "Study Streak",
      value: `${toBanglaNumber(demoStats.streakDays)} দিন`,
      sub: "টানা পড়াশোনা",
      color: "#ef4444",
    },
    {
      icon: Target,
      label: "মোট প্রশ্ন",
      value: toBanglaNumber(demoStats.totalQuestions),
      sub: "সমাধান করেছেন",
      color: "#0d6e4f",
    },
    {
      icon: TrendingUp,
      label: "গড় স্কোর",
      value: `${toBanglaNumber(demoStats.averagePercent)}%`,
      sub: `সর্বোচ্চ ${toBanglaNumber(demoStats.bestPercent)}%`,
      color: "#2563eb",
    },
    {
      icon: Award,
      label: "র‍্যাঙ্ক",
      value: `#${toBanglaNumber(myPosition.weekly.rank)}`,
      sub: "সাপ্তাহিক",
      color: "#d97706",
    },
  ];

  const trialPercent = Math.round(
    (demoAccount.trialDaysLeft / demoAccount.trialDaysTotal) * 100,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">ড্যাশবোর্ড</h1>
        <p className="text-sm text-muted-foreground">আপনার অগ্রগতি এবং পরিসংখ্যান</p>
        <p className="mt-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          বিষয়ভিত্তিক অগ্রগতি আপনার সম্পন্ন করা টপিক থেকে আসছে। বাকি সংখ্যা, চার্ট ও তালিকা এখন
          ডেমো; ব্যাকএন্ড যুক্ত হলে আসল ডাটা দেখাবে।
        </p>
      </div>

      {/* ফ্রি ট্রায়ালের অবস্থা */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[220px] flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">{demoAccount.planName}</span>
            <span className="font-mono text-xs text-muted-foreground">
              আর {toBanglaNumber(demoAccount.trialDaysLeft)} দিন বাকি
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${trialPercent}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            ট্রায়াল শেষে অ্যাকাউন্ট বিজ্ঞাপনসহ Read Mode-এ চলবে।
          </p>
        </div>
        <Link
          href="/#pricing"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Crown size={15} /> প্রিমিয়াম নিন
        </Link>
      </div>

      {/* উপরের পরিসংখ্যান */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              <Icon size={18} />
            </div>
            <div className="font-mono text-xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 font-mono text-xs" style={{ color }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* বাম কলাম */}
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <BookOpen size={18} className="text-primary" /> বিষয়ভিত্তিক অগ্রগতি
            </h2>
            <div className="space-y-4">
              {subjectRows.map((row) => (
                <Link
                  key={row.subject.slug}
                  href={`/subjects/${row.subject.slug}`}
                  className="block rounded-lg transition-colors hover:bg-muted/60"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span>{row.subject.icon}</span> {row.subject.name}
                    </span>
                    <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <span>
                        Chapters: {toBanglaNumber(row.chaptersDone)}/{toBanglaNumber(row.chapters)}
                      </span>
                      <span className="font-bold" style={{ color: row.subject.color }}>
                        {toBanglaNumber(row.percent)}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${row.percent}%`, backgroundColor: row.subject.color }}
                    />
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    Topics: {toBanglaNumber(row.done)}/{toBanglaNumber(row.totalTopics)}
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              অন্যান্য বিষয়ের কনটেন্ট যুক্ত হলে এখানে নিজে থেকেই দেখা যাবে।
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <BarChart2 size={18} className="text-primary" /> সাপ্তাহিক প্রশ্ন সমাধান (ডেমো)
            </h2>
            <div className="flex h-36 items-end gap-2">
              {weeklyActivity.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-xs text-primary">{toBanglaNumber(d.questions)}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/50"
                    style={{ height: `${Math.max(8, (d.questions / maxWeekly) * 96)}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Clock size={18} className="text-primary" /> পরীক্ষার ইতিহাস (ডেমো)
            </h2>
            <ul className="divide-y divide-border">
              {examHistory.map((exam) => {
                const percent = (exam.score / exam.total) * 100;
                const passed = percent >= PASS_PERCENT;
                return (
                  <li key={exam.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-medium">{exam.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatBanglaDate(exam.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold">
                        {toBanglaNumber(exam.score)}/{toBanglaNumber(exam.total)}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          passed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {passed ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* ডান কলাম */}
        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Flame size={16} className="text-red-500" /> Study Streak (ডেমো)
              <span className="ml-auto font-mono text-sm font-bold text-red-500">
                🔥 {toBanglaNumber(demoStats.streakDays)} দিন
              </span>
            </h2>
            <div className="grid grid-cols-7 gap-1">
              {streakCells.map((cell, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-sm ${
                    cell.active ? "bg-primary" : "bg-muted"
                  } ${cell.today ? "outline outline-2 outline-offset-1 outline-primary" : ""}`}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">গত ৩৫ দিনের পড়াশোনা</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock size={16} className="text-primary" /> সাম্প্রতিক কার্যক্রম (ডেমো)
            </h2>
            <ul className="space-y-3">
              {recentActivity.map((activity) => {
                const { icon: Icon, color } = activityIcons[activity.type];
                return (
                  <li key={activity.action} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      <Icon size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug">{activity.action}</p>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        {activity.time}
                        {activity.score && (
                          <span className="font-bold text-primary">{activity.score}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Award size={16} className="text-amber-600" /> ব্যাজ (ডেমো)
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`rounded-lg bg-muted p-3 text-center ${badge.earned ? "" : "opacity-50"}`}
                >
                  <div className="mb-1 text-2xl">{badge.icon}</div>
                  <p className="text-xs font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  {badge.earned && <CheckCircle2 size={12} className="mx-auto mt-1 text-primary" />}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Star size={16} className="text-amber-600" /> AI সুপারিশ (ডেমো)
            </h2>
            <div className="space-y-2 text-xs">
              <p className="rounded-lg bg-red-500/10 p-2">
                🔴 <strong>দুর্বল বিষয়:</strong> পরীক্ষার ফলাফল জমা হলে এখানে আপনার দুর্বল বিষয় দেখাবে।
              </p>
              <p className="rounded-lg bg-primary/10 p-2">
                ✅ <strong>শক্তিশালী বিষয়:</strong> নিয়মিত অনুশীলনের পর এখানে শক্তিশালী বিষয় চিহ্নিত হবে।
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">দ্রুত লিংক</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Icon size={15} className="text-primary" /> {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}