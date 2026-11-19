// frontend/src/lib/dashboard-metrics.ts
import type { Attempt } from "@/lib/attempts";
import { evaluate } from "@/lib/exam-utils";
import { toLocalIsoDate } from "@/lib/notes";
import { toBanglaNumber } from "@/lib/pricing";
import { getItemHref, getItemLabel } from "@/lib/study-schedule";
import { allSubjects } from "@/lib/subjects-data";

// ---- তারিখের সহায়ক ----

// Date থেকে স্থানীয় তারিখ "YYYY-MM-DD" রূপে
export function dateKey(date: Date): string {
  return toLocalIsoDate(date.getTime());
}

// একটি তারিখের কয়েক দিন আগে/পরের তারিখ
export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  return toLocalIsoDate(new Date(year, month - 1, day + days).getTime());
}

// ---- দৈনিক লক্ষ্য ----

// নির্দিষ্ট দিনে মোট কতটি প্রশ্নে উত্তর দেওয়া হয়েছে (একই প্রশ্ন বারবার দিলে প্রতিবার গোনা)
export function getAnsweredOn(attempts: Attempt[], iso: string): number {
  return attempts
    .filter((attempt) => toLocalIsoDate(attempt.finishedAt) === iso)
    .reduce((sum, attempt) => sum + Object.keys(attempt.session.answers).length, 0);
}

// ---- Study Streak ----

export type StreakInfo = {
  current: number;
  best: number;
  activeDays: Set<string>;
  activeToday: boolean;
};

// পরীক্ষা দেওয়া দিনগুলো থেকে বর্তমান ও সর্বোচ্চ Streak (আজ এখনও না দিলেও গতকাল পর্যন্ত Streak বজায় থাকে)
export function getStreakInfo(attempts: Attempt[], todayIso: string): StreakInfo {
  const activeDays = new Set(attempts.map((attempt) => toLocalIsoDate(attempt.finishedAt)));

  let cursor = activeDays.has(todayIso) ? todayIso : addDays(todayIso, -1);
  let current = 0;
  while (activeDays.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of Array.from(activeDays).sort()) {
    run = previous !== null && addDays(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }

  return { current, best, activeDays, activeToday: activeDays.has(todayIso) };
}

// গত কয়েক দিনের ক্যালেন্ডারের ঘর (পুরনো থেকে নতুন, শেষটি আজ)
export function getStreakCells(activeDays: Set<string>, todayIso: string, count = 35) {
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(todayIso, index - (count - 1));
    return { date, active: activeDays.has(date), today: date === todayIso };
  });
}

// ---- পারফরম্যান্স গ্রাফ ----

export const ranges = [
  { id: "7d", label: "৭ দিন", days: 7 },
  { id: "30d", label: "৩০ দিন", days: 30 },
  { id: "90d", label: "৩ মাস", days: 90 },
  { id: "180d", label: "৬ মাস", days: 180 },
  { id: "all", label: "সব", days: null },
] as const;

export type RangeId = (typeof ranges)[number]["id"];

export type ScorePoint = {
  id: string;
  title: string;
  date: string;
  percent: number; // স্কোর শতকরা
  accuracy: number | null; // উত্তর দেওয়া প্রশ্নের মধ্যে সঠিকের শতকরা
};

// নির্বাচিত সময়ের পরীক্ষাগুলোর স্কোর ও Accuracy (পুরনো থেকে নতুন ক্রমে)
export function getScorePoints(
  attempts: Attempt[],
  rangeId: RangeId,
  todayIso: string,
): ScorePoint[] {
  const range = ranges.find((r) => r.id === rangeId);
  const cutoff = range && range.days !== null ? addDays(todayIso, -(range.days - 1)) : null;

  return attempts
    .filter((attempt) => cutoff === null || toLocalIsoDate(attempt.finishedAt) >= cutoff)
    .map((attempt) => {
      const stats = evaluate(attempt.session);
      const answered = stats.correct + stats.wrong;
      return {
        id: attempt.id,
        title: attempt.session.title,
        date: toLocalIsoDate(attempt.finishedAt),
        percent: stats.percent,
        accuracy: answered ? Math.round((stats.correct / answered) * 1000) / 10 : null,
      };
    });
}

// ---- Badge (SRS: অধ্যায়/টপিক সম্পন্ন করার ভিত্তিতে) ----

export type BadgeStatus = {
  id: "bronze" | "silver" | "gold" | "champion";
  icon: string;
  name: string;
  requirement: string;
  current: number;
  target: number;
  earned: boolean;
};

// ⚠️ SRS-এ শর্তের সংখ্যা নেই; নিচের সংখ্যাগুলো ধরে নেওয়া, চাইলে বদলানো যাবে
const BRONZE_CHAPTERS = 1;
const SILVER_CHAPTERS = 3;
const GOLD_SUBJECTS = 1;

export function getBadges(
  isCompleted: (subjectSlug: string, topicSlug: string) => boolean,
): BadgeStatus[] {
  let completedChapters = 0;
  let completedSubjects = 0;

  for (const subject of allSubjects) {
    if (subject.chapters.length === 0) continue;

    let subjectDone = true;
    for (const chapter of subject.chapters) {
      const chapterDone =
        chapter.topics.length > 0 &&
        chapter.topics.every((topic) => isCompleted(subject.slug, topic.slug));
      if (chapterDone) completedChapters += 1;
      else subjectDone = false;
    }
    if (subjectDone) completedSubjects += 1;
  }

  const totalSubjects = allSubjects.length;
  const make = (
    id: BadgeStatus["id"],
    icon: string,
    name: string,
    requirement: string,
    current: number,
    target: number,
  ): BadgeStatus => ({ id, icon, name, requirement, current, target, earned: current >= target });

  return [
    make(
      "bronze",
      "🥉",
      "Bronze",
      `${toBanglaNumber(BRONZE_CHAPTERS)}টি অধ্যায় সম্পন্ন`,
      completedChapters,
      BRONZE_CHAPTERS,
    ),
    make(
      "silver",
      "🥈",
      "Silver",
      `${toBanglaNumber(SILVER_CHAPTERS)}টি অধ্যায় সম্পন্ন`,
      completedChapters,
      SILVER_CHAPTERS,
    ),
    make(
      "gold",
      "🥇",
      "Gold",
      `${toBanglaNumber(GOLD_SUBJECTS)}টি বিষয় সম্পূর্ণ`,
      completedSubjects,
      GOLD_SUBJECTS,
    ),
    make("champion", "🏆", "Champion", "সব বিষয় সম্পূর্ণ", completedSubjects, totalSubjects),
  ];
}

// ---- আজকের করণীয় ----

export type TodayTask = {
  id: string;
  text: string;
  tone: "todo" | "done" | "alert";
  href?: string;
  action?: "practice-wrong";
};

type TaskInput = {
  goalRemaining: number;
  todayItemIds: string[];
  weakSubject?: { slug: string; name: string; accuracy: number };
  wrongCount: number;
  urgentJobs: { id: string; org: string; daysLeft: number }[];
  streakCurrent: number;
  streakAtRisk: boolean;
};

// ব্যবহারকারীর আসল অবস্থা দেখে আজকের করণীয়ের তালিকা বানায়
export function buildTodayTasks(input: TaskInput): TodayTask[] {
  const tasks: TodayTask[] = [];

  if (input.goalRemaining > 0) {
    tasks.push({
      id: "goal",
      tone: "todo",
      text: `আজকের লক্ষ্য পূরণে আরও ${toBanglaNumber(input.goalRemaining)}টি MCQ বাকি`,
      href: "/exam",
    });
  } else {
    tasks.push({ id: "goal-done", tone: "done", text: "আজকের MCQ লক্ষ্য পূরণ হয়েছে" });
  }

  for (const id of input.todayItemIds) {
    const label = getItemLabel(id);
    if (label) {
      tasks.push({
        id: `schedule-${id}`,
        tone: "todo",
        text: `রুটিন অনুযায়ী আজ: ${label}`,
        href: getItemHref(id),
      });
    }
  }

  if (input.weakSubject) {
    tasks.push({
      id: "weak",
      tone: "alert",
      text: `${input.weakSubject.name} বিষয়ে দুর্বলতা কাটান (Accuracy ${toBanglaNumber(input.weakSubject.accuracy)}%)`,
      href: `/exam?subject=${encodeURIComponent(input.weakSubject.slug)}`,
    });
  }

  if (input.wrongCount > 0) {
    tasks.push({
      id: "wrong",
      tone: "todo",
      text: `${toBanglaNumber(input.wrongCount)}টি ভুল করা প্রশ্ন আবার অনুশীলন করুন`,
      action: "practice-wrong",
    });
  }

  if (input.streakAtRisk) {
    tasks.push({
      id: "streak",
      tone: "alert",
      text: `আজ পরীক্ষা দিলে আপনার ${toBanglaNumber(input.streakCurrent)} দিনের Streak বজায় থাকবে`,
      href: "/exam",
    });
  }

  for (const job of input.urgentJobs) {
    tasks.push({
      id: `job-${job.id}`,
      tone: "alert",
      text:
        job.daysLeft === 0
          ? `${job.org}-এর আবেদনের শেষ দিন আজ`
          : `${job.org}-এর আবেদনের শেষ তারিখে আর ${toBanglaNumber(job.daysLeft)} দিন বাকি`,
      href: `/job-circular/${job.id}`,
    });
  }

  return tasks;
}