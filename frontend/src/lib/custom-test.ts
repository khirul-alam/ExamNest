// frontend/src/lib/custom-test.ts
import type { QuestionHistory } from "@/lib/analytics";
import type { Attempt } from "@/lib/attempts";
import { getQuestionById, questionPool } from "@/lib/exam-data";
import { shuffle, type ExamMode, type ExamSession } from "@/lib/exam-utils";

export type CustomSource = "all" | "new" | "mistakes";

export const CUSTOM_COUNT_MAX = 200;
export const CUSTOM_DURATION_MAX = 180;
export const CUSTOM_NAME_MAX = 60;

// একটি বিষয়ের যেসব প্রশ্ন বেছে নেওয়া যাবে (উৎস অনুযায়ী)
export function getCandidateIds(
  subjectSlug: string,
  source: CustomSource,
  history: QuestionHistory,
): string[] {
  return questionPool
    .filter((q) => {
      if (q.subjectSlug !== subjectSlug) return false;
      if (source === "new") return !history.answered.has(q.id);
      if (source === "mistakes") return history.wrong.has(q.id);
      return true;
    })
    .map((q) => q.id);
}

export type DistributionRow = {
  subjectSlug: string;
  available: number; // এই বিষয়ে বেছে নেওয়ার মতো প্রশ্ন
  count: number; // এই পরীক্ষায় আসা প্রশ্ন
};

// মোট প্রশ্ন বিষয়গুলোর মধ্যে সমানভাবে ভাগ করা। কোনো বিষয়ে প্রশ্ন কম পড়লে বাকিটা অন্যদের মধ্যে যায়।
export function distributeQuestions(
  subjects: { subjectSlug: string; available: number }[],
  total: number,
): DistributionRow[] {
  const rows: DistributionRow[] = subjects.map((s) => ({ ...s, count: 0 }));
  let remaining = Math.min(
    Math.max(0, total),
    rows.reduce((sum, row) => sum + row.available, 0),
  );

  // এক এক করে ঘুরে ঘুরে প্রতিটি বিষয়ে একটি করে প্রশ্ন যোগ করা
  while (remaining > 0) {
    let added = false;
    for (const row of rows) {
      if (remaining === 0) break;
      if (row.count < row.available) {
        row.count += 1;
        remaining -= 1;
        added = true;
      }
    }
    if (!added) break;
  }

  return rows;
}

// প্রতিটি বিষয়ের প্রার্থী প্রশ্ন এলোমেলো করে নির্ধারিত সংখ্যক বেছে নেওয়া
export function pickQuestionIds(
  rows: DistributionRow[],
  candidatesBySlug: Record<string, string[]>,
): string[] {
  return rows.flatMap((row) => shuffle(candidatesBySlug[row.subjectSlug] ?? []).slice(0, row.count));
}

type SessionInput = {
  title: string;
  mode: ExamMode;
  durationMin: number;
  questionIds: string[];
};

// প্রশ্নের আইডির তালিকা থেকে নতুন পরীক্ষা তৈরি (প্রশ্ন ও অপশনের ক্রম এলোমেলো, কোনো প্রশ্ন দুবার নয়)
export function sessionFromQuestionIds(input: SessionInput): ExamSession | null {
  const ids = Array.from(new Set(input.questionIds)).filter(
    (id) => getQuestionById(id) !== undefined,
  );
  if (ids.length === 0) return null;

  const now = Date.now();
  return {
    title: input.title,
    mode: input.mode,
    durationSec: input.durationMin * 60,
    startedAt: now,
    endsAt: now + input.durationMin * 60 * 1000,
    questions: shuffle(ids).map((id) => {
      const question = getQuestionById(id)!;
      return { id, optionOrder: shuffle(question.options.map((_, index) => index)) };
    }),
    answers: {},
    flags: [],
    current: 0,
    violations: 0,
  };
}

// আগের একটি পরীক্ষা হুবহু একই প্রশ্ন দিয়ে আবার দেওয়া (ক্রম নতুন করে এলোমেলো হয়)
export function retakeSession(attempt: Attempt): ExamSession | null {
  return sessionFromQuestionIds({
    title: attempt.session.title,
    mode: attempt.session.mode,
    durationMin: Math.max(1, Math.round(attempt.session.durationSec / 60)),
    questionIds: attempt.session.questions.map((q) => q.id),
  });
}