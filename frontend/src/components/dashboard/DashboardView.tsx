// frontend/src/components/dashboard/DashboardView.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Award,
  Bookmark,
  CheckCircle2,
  Crown,
  Flame,
  Loader2,
  Sparkles,
  StickyNote,
  Target,
  TrendingUp,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { BadgesCard } from "./BadgesCard";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { DailyGoalCard } from "./DailyGoalCard";
import { PerformanceGraph } from "./PerformanceGraph";
import { StreakCard } from "./StreakCard";
import { SubjectPerformanceCard } from "./SubjectPerformanceCard";
import { TodayTasksCard } from "./TodayTasksCard";
import { UpcomingJobsCard } from "./UpcomingJobsCard";
import { useDailyGoal, useSchedule } from "./useDashboardPrefs";
import { WeeklySchedule } from "./WeeklySchedule";
import { WrongSavedCard } from "./WrongSavedCard";
import { RecentHistory } from "@/components/model-test/RecentHistory";
import { RecommendedPractice } from "@/components/model-test/RecommendedPractice";
import { useStartSession } from "@/components/model-test/useStartSession";
import { useQuestionProgress } from "@/components/previous-questions/useQuestionProgress";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import {
  classifySubject,
  computeSubjectStats,
  estimateDurationMin,
  getOverview,
  getQuestionHistory,
  getRecommendations,
} from "@/lib/analytics";
import {
  buildTodayTasks,
  dateKey,
  getAnsweredOn,
  getBadges,
  getStreakCells,
  getStreakInfo,
} from "@/lib/dashboard-metrics";
import { demoAccount } from "@/lib/dashboard-data";
import { sessionFromQuestionIds } from "@/lib/custom-test";
import { daysUntil, formatBanglaDate } from "@/lib/format";
import { jobItems } from "@/lib/jobs-data";
import { toBanglaNumber } from "@/lib/pricing";
import { getTodayDayKey, weekDays } from "@/lib/study-schedule";
import { allSubjects, getSubject } from "@/lib/subjects-data";
import { useAttempts } from "@/lib/useAttempts";
import { useToday } from "@/lib/useToday";

type Stat = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
};

const quickLinks = [
  { href: "/model-test", label: "কাস্টম টেস্ট", icon: Target },
  { href: "/bookmarks", label: "বুকমার্ক", icon: Bookmark },
  { href: "/notes", label: "নোট", icon: StickyNote },
  { href: "/leaderboard", label: "লিডারবোর্ড", icon: Trophy },
  { href: "/profile", label: "প্রোফাইল", icon: User },
];

// একবারে সর্বোচ্চ এতগুলো ভুল বা সংরক্ষিত প্রশ্ন নিয়ে অনুশীলন
const PRACTICE_MAX = 20;
// এত দিনের কম বাকি থাকলে "আজকের করণীয়"-তে সতর্কতা
const URGENT_JOB_DAYS = 3;

const percentText = (value: number | null) =>
  value === null ? "—" : `${toBanglaNumber(value)}%`;

export function DashboardView() {
  const studyProgress = useStudyProgress();
  const questionProgress = useQuestionProgress();
  const { attempts, ready } = useAttempts();
  const today = useToday();
  const { goal, update: updateGoal } = useDailyGoal();
  const { schedule, update: updateSchedule } = useSchedule();
  const startSession = useStartSession();

  const todayIso = today ? dateKey(today) : null;

  const history = useMemo(() => getQuestionHistory(attempts), [attempts]);
  const overview = useMemo(() => getOverview(attempts), [attempts]);
  const subjectStats = useMemo(() => computeSubjectStats(attempts), [attempts]);
  const recommendations = useMemo(
    () => getRecommendations(subjectStats, history, attempts.length),
    [subjectStats, history, attempts.length],
  );
  // ইতিহাস নতুন থেকে পুরনো ক্রমে দেখানো হয়
  const recentFirst = useMemo(() => [...attempts].reverse(), [attempts]);
  const streak = useMemo(
    () => (todayIso ? getStreakInfo(attempts, todayIso) : null),
    [attempts, todayIso],
  );

  // আসল তথ্য পড়া শেষ না হওয়া পর্যন্ত অপেক্ষা
  if (!ready || !questionProgress.ready || !today || !todayIso || !streak) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const answeredToday = getAnsweredOn(attempts, todayIso);
  const goalRemaining = Math.max(0, goal - answeredToday);
  const cells = getStreakCells(streak.activeDays, todayIso);
  const badges = getBadges(studyProgress.isCompleted);

  // সংরক্ষিত (বুকমার্ক করা) টপিকের সংখ্যা
  const savedTopics = allSubjects.reduce(
    (sum, subject) =>
      sum +
      subject.chapters
        .flatMap((chapter) => chapter.topics)
        .filter((topic) => studyProgress.isBookmarked(subject.slug, topic.slug)).length,
    0,
  );

  // সংরক্ষিত প্রশ্ন: সবচেয়ে নতুন সংরক্ষণ আগে
  const savedQuestionIds = [...questionProgress.bookmarkedIds].reverse();

  // সবচেয়ে দুর্বল বিষয় (পর্যাপ্ত উত্তর থাকলে)
  const weakStat = subjectStats
    .filter((stat) => classifySubject(stat) === "weak")
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))[0];
  const weakSubject =
    weakStat && getSubject(weakStat.subjectSlug)
      ? {
          slug: weakStat.subjectSlug,
          name: getSubject(weakStat.subjectSlug)!.name,
          accuracy: weakStat.accuracy ?? 0,
        }
      : undefined;

  const todayKey = getTodayDayKey(today);
  const urgentJobs = jobItems
    .map((job) => ({ id: job.id, org: job.org, daysLeft: daysUntil(job.deadline, today) }))
    .filter((job) => job.daysLeft >= 0 && job.daysLeft <= URGENT_JOB_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2);

  const tasks = buildTodayTasks({
    goalRemaining,
    todayItemIds: schedule[todayKey],
    weakSubject,
    wrongCount: history.wrong.size,
    urgentJobs,
    streakCurrent: streak.current,
    streakAtRisk: streak.current > 0 && !streak.activeToday,
  });

  // প্রশ্নের তালিকা নিয়ে অনুশীলন শুরু (সাধারণ মোডে, ফুলস্ক্রিন ছাড়া)
  const startPractice = (title: string, ids: string[]) => {
    const picked = ids.slice(0, PRACTICE_MAX);
    const session = sessionFromQuestionIds({
      title,
      mode: "practice",
      durationMin: estimateDurationMin(picked.length),
      questionIds: picked,
    });
    if (session) startSession(session);
  };

  const handlePracticeWrong = () =>
    startPractice("ভুল করা প্রশ্ন অনুশীলন", Array.from(history.wrong));
  const handlePracticeSaved = () => startPractice("সংরক্ষিত প্রশ্ন অনুশীলন", savedQuestionIds);

  const stats: Stat[] = [
    {
      icon: Flame,
      label: "Study Streak",
      value: `${toBanglaNumber(streak.current)} দিন`,
      sub: `সর্বোচ্চ ${toBanglaNumber(streak.best)} দিন`,
      color: "#ef4444",
    },
    {
      icon: Target,
      label: "মোট MCQ উত্তর",
      value: toBanglaNumber(overview.answered),
      sub: `${toBanglaNumber(overview.uniqueAnswered)}টি স্বতন্ত্র প্রশ্ন`,
      color: "#0d6e4f",
    },
    {
      icon: CheckCircle2,
      label: "Accuracy",
      value: percentText(overview.accuracy),
      sub: `${toBanglaNumber(overview.correct)}/${toBanglaNumber(overview.answered)} সঠিক`,
      color: "#7c3aed",
    },
    {
      icon: TrendingUp,
      label: "গড় স্কোর",
      value: percentText(overview.averagePercent),
      sub: `সর্বোচ্চ ${percentText(overview.bestPercent)}`,
      color: "#2563eb",
    },
    {
      icon: Award,
      label: "র‍্যাঙ্ক",
      value: "—",
      sub: "ব্যাকএন্ড যুক্ত হলে",
      color: "#d97706",
    },
  ];

  // ⚠️ ট্রায়ালের তথ্য ডেমো; নিবন্ধনের আসল তারিখ ব্যাকএন্ডে থাকবে
  const trialPercent = Math.round((demoAccount.trialDaysLeft / demoAccount.trialDaysTotal) * 100);
  const todayLabel = `${weekDays[(today.getDay() + 1) % 7].label}, ${formatBanglaDate(todayIso)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">স্বাগতম, {demoAccount.name}</h1>
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
        <p className="mt-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          এখানকার সব তথ্য আপনার পরীক্ষা ও অনুশীলনের আসল ফলাফল থেকে হিসাব হচ্ছে এবং আপাতত এই
          ব্রাউজারে জমা আছে। ব্যাকএন্ড যুক্ত হলে আপনার অ্যাকাউন্টে সংরক্ষিত হবে।
        </p>
      </div>

      {/* ফ্রি ট্রায়ালের অবস্থা (ডেমো) */}
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
          href="/pricing"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Crown size={15} /> প্রিমিয়াম নিন
        </Link>
      </div>

      {/* উপরের পরিসংখ্যান */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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

      {/* কার্ডের গ্রিড: ছোট স্ক্রিনে ওপর থেকে নিচে এই ক্রমেই সাজে */}
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailyGoalCard answeredToday={answeredToday} goal={goal} onGoalChange={updateGoal} />
        </div>
        <TodayTasksCard tasks={tasks} onPracticeWrong={handlePracticeWrong} />

        <div className="lg:col-span-2">
          <ContinueLearningCard />
        </div>
        <WrongSavedCard
          wrongCount={history.wrong.size}
          savedQuestions={savedQuestionIds.length}
          savedTopics={savedTopics}
          onPracticeWrong={handlePracticeWrong}
          onPracticeSaved={handlePracticeSaved}
        />

        <div className="lg:col-span-2">
          <SubjectPerformanceCard stats={subjectStats} />
        </div>
        <StreakCard current={streak.current} best={streak.best} cells={cells} />

        <div className="lg:col-span-2">
          <PerformanceGraph attempts={attempts} todayIso={todayIso} />
        </div>
        <UpcomingJobsCard />

        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="font-semibold">প্রস্তাবিত অনুশীলন</h2>
          </div>
          <RecommendedPractice items={recommendations} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">সাম্প্রতিক পরীক্ষা</h2>
          <RecentHistory attempts={recentFirst} />
        </div>
        <WeeklySchedule schedule={schedule} todayKey={todayKey} onChange={updateSchedule} />

        <BadgesCard badges={badges} />
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 font-semibold">দ্রুত লিংক</h2>
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
        </div>
      </div>
    </div>
  );
}