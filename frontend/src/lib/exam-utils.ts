// frontend/src/lib/exam-utils.ts
import { getQuestionById, questionPool, type ExamQuestion } from "@/lib/exam-data";

// নম্বর বিভাজন (SRS অনুযায়ী)
export const MARK_CORRECT = 1;
export const MARK_WRONG = -0.5;
// ⚠️ পাস মার্ক SRS-এ নেই, সাময়িকভাবে ৬০% ধরা হয়েছে
export const PASS_PERCENT = 60;
// এতবার নিয়ম ভাঙলে পরীক্ষা নিজে থেকে জমা হবে
export const MAX_VIOLATIONS = 3;
export const SESSION_KEY = "examnest-exam-session";

export type ExamMode = "practice" | "model";

// একটি প্রশ্ন এবং এই ব্যবহারকারীর জন্য অপশনের এলোমেলো ক্রম
export type QuestionInstance = { id: string; optionOrder: number[] };

export type ExamSession = {
  title: string;
  mode: ExamMode;
  durationSec: number;
  startedAt: number; // মিলিসেকেন্ড
  endsAt: number;
  questions: QuestionInstance[];
  // প্রশ্নের আইডি → বেছে নেওয়া অপশনের আসল ইনডেক্স (উত্তর না থাকলে চাবিই থাকবে না)
  answers: Record<string, number>;
  flags: string[];
  current: number;
  violations: number;
};

// Fisher–Yates শাফল
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// টপিক → বিষয় → সব প্রশ্ন, এই অগ্রাধিকারে প্রশ্ন ভান্ডার বেছে নেওয়া
export function filterPool(subject?: string, topic?: string): ExamQuestion[] {
  if (subject && topic) {
    const byTopic = questionPool.filter((q) => q.subjectSlug === subject && q.topicSlug === topic);
    if (byTopic.length > 0) return byTopic;
  }
  if (subject) {
    const bySubject = questionPool.filter((q) => q.subjectSlug === subject);
    if (bySubject.length > 0) return bySubject;
  }
  return questionPool;
}

type CreateOptions = {
  title: string;
  mode: ExamMode;
  durationMin: number;
  questionCount: number;
  subject?: string;
  topic?: string;
};

// নতুন পরীক্ষা তৈরি: প্রশ্ন ও অপশনের ক্রম এলোমেলো, কোনো প্রশ্ন দুবার আসে না
export function createSession(options: CreateOptions): ExamSession {
  const pool = filterPool(options.subject, options.topic);
  const count = Math.min(options.questionCount, pool.length);
  const picked = shuffle(pool).slice(0, count);
  const now = Date.now();

  return {
    title: options.title,
    mode: options.mode,
    durationSec: options.durationMin * 60,
    startedAt: now,
    endsAt: now + options.durationMin * 60 * 1000,
    questions: picked.map((q) => ({
      id: q.id,
      optionOrder: shuffle(q.options.map((_, index) => index)),
    })),
    answers: {},
    flags: [],
    current: 0,
    violations: 0,
  };
}

export type ExamStats = {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  percent: number;
  passed: boolean;
};

export function evaluate(session: ExamSession): ExamStats {
  let correct = 0;
  let wrong = 0;

  for (const instance of session.questions) {
    const question = getQuestionById(instance.id);
    const chosen = session.answers[instance.id];
    if (!question || chosen === undefined) continue;
    if (chosen === question.correctIndex) correct++;
    else wrong++;
  }

  const total = session.questions.length;
  const score = correct * MARK_CORRECT + wrong * MARK_WRONG;
  // নেগেটিভ স্কোরেও শতকরা ০-এর নিচে যাবে না
  const percent = total ? Math.round((Math.max(0, score) / total) * 1000) / 10 : 0;

  return {
    total,
    correct,
    wrong,
    skipped: total - correct - wrong,
    score,
    percent,
    passed: percent >= PASS_PERCENT,
  };
}

// সেকেন্ডকে mm:ss রূপে দেখানো
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---- ব্রাউজারে সেশন সংরক্ষণ (Auto Save / Resume / Browser Recovery) ----

export function saveSession(session: ExamSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // সংরক্ষণ না হলেও পরীক্ষা চলবে
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // উপেক্ষা
  }
}

// সংরক্ষিত তথ্য ব্যবহারকারী বদলাতে পারে, তাই গঠন যাচাই করে নেওয়া হয়
export function loadSession(): ExamSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<ExamSession>;

    const valid =
      typeof data.title === "string" &&
      (data.mode === "practice" || data.mode === "model") &&
      typeof data.durationSec === "number" &&
      typeof data.startedAt === "number" &&
      typeof data.endsAt === "number" &&
      Array.isArray(data.questions) &&
      data.questions.length > 0 &&
      data.questions.every(
        (q) =>
          typeof q?.id === "string" &&
          Array.isArray(q.optionOrder) &&
          q.optionOrder.length === 4 &&
          getQuestionById(q.id) !== undefined,
      ) &&
      typeof data.answers === "object" &&
      data.answers !== null &&
      Array.isArray(data.flags) &&
      typeof data.current === "number" &&
      typeof data.violations === "number";

    return valid ? (data as ExamSession) : null;
  } catch {
    return null;
  }
}