// frontend/src/lib/analytics.ts
import type { Attempt } from "@/lib/attempts";
import { getQuestionById, questionPool } from "@/lib/exam-data";
import { evaluate, MARK_CORRECT, MARK_WRONG, PASS_PERCENT } from "@/lib/exam-utils";
import { allSubjects, getSubject } from "@/lib/subjects-data";

// বিশ্লেষণের নিয়ম: কোনো বিষয়কে শক্তিশালী বা দুর্বল বলার আগে ন্যূনতম এতগুলো প্রশ্নের উত্তর লাগবে
export const MIN_ANSWERED_FOR_ANALYSIS = 10;
export const STRONG_ACCURACY = 75; // এর সমান বা বেশি হলে শক্তিশালী
export const WEAK_ACCURACY = 50; // এর কম হলে দুর্বল

const MINUTES_PER_QUESTION = 0.6;
const MIN_DURATION_MIN = 5;
const RECOMMENDED_QUESTION_COUNT = 20;

const round1 = (value: number) => Math.round(value * 10) / 10;

// প্রশ্নসংখ্যা অনুযায়ী আনুমানিক সময় (মিনিট)
export function estimateDurationMin(count: number): number {
  return Math.max(MIN_DURATION_MIN, Math.ceil(count * MINUTES_PER_QUESTION));
}

// ---- প্রশ্নভিত্তিক ইতিহাস ----

export type QuestionHistory = {
  answered: Set<string>; // কখনো উত্তর দেওয়া প্রশ্নের আইডি
  wrong: Set<string>; // সর্বশেষ উত্তরটি ভুল ছিল এমন প্রশ্ন
};

export function getQuestionHistory(attempts: Attempt[]): QuestionHistory {
  const answered = new Set<string>();
  const lastCorrect = new Map<string, boolean>();

  // attempts পুরনো থেকে নতুন ক্রমে থাকে, তাই শেষ উত্তরটিই চূড়ান্ত
  for (const attempt of attempts) {
    for (const instance of attempt.session.questions) {
      const question = getQuestionById(instance.id);
      const chosen = attempt.session.answers[instance.id];
      if (!question || chosen === undefined) continue;
      answered.add(question.id);
      lastCorrect.set(question.id, chosen === question.correctIndex);
    }
  }

  const wrong = new Set<string>();
  lastCorrect.forEach((isCorrect, id) => {
    if (!isCorrect) wrong.add(id);
  });

  return { answered, wrong };
}

// ---- সামগ্রিক সারাংশ ----

export type Overview = {
  totalTests: number;
  passedTests: number;
  answered: number; // মোট উত্তর (একই প্রশ্ন বারবার দিলে প্রতিবার গোনা)
  correct: number;
  wrong: number;
  accuracy: number | null; // সঠিক ÷ উত্তর দেওয়া
  uniqueAnswered: number; // স্বতন্ত্র প্রশ্ন (একবারই গোনা)
  totalMcq: number;
  coveragePercent: number;
  averagePercent: number | null;
  bestPercent: number | null;
};

export function getOverview(attempts: Attempt[]): Overview {
  const history = getQuestionHistory(attempts);
  let passedTests = 0;
  let correct = 0;
  let wrong = 0;
  const percents: number[] = [];

  for (const attempt of attempts) {
    const stats = evaluate(attempt.session);
    if (stats.passed) passedTests += 1;
    correct += stats.correct;
    wrong += stats.wrong;
    percents.push(stats.percent);
  }

  const answered = correct + wrong;
  const totalMcq = questionPool.length;

  return {
    totalTests: attempts.length,
    passedTests,
    answered,
    correct,
    wrong,
    accuracy: answered ? round1((correct / answered) * 100) : null,
    uniqueAnswered: history.answered.size,
    totalMcq,
    coveragePercent: totalMcq ? round1((history.answered.size / totalMcq) * 100) : 0,
    averagePercent: percents.length
      ? round1(percents.reduce((sum, p) => sum + p, 0) / percents.length)
      : null,
    bestPercent: percents.length ? Math.max(...percents) : null,
  };
}

// ---- বিষয়ভিত্তিক বিশ্লেষণ ----

export type SubjectStat = {
  subjectSlug: string;
  totalMcq: number;
  uniqueAnswered: number;
  coveragePercent: number; // MCQ Coverage
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number | null; // Accuracy
  tests: number; // এই বিষয়ের প্রশ্ন ছিল এমন পরীক্ষা
  passed: number; // ওই বিষয়ের অংশে পাস মার্ক পাওয়া পরীক্ষা
  successRate: number | null; // টেস্ট সফলতা
};

type Accumulator = {
  tests: number;
  passed: number;
  correct: number;
  wrong: number;
  skipped: number;
};

export function computeSubjectStats(attempts: Attempt[]): SubjectStat[] {
  const history = getQuestionHistory(attempts);
  const accumulators = new Map<string, Accumulator>();

  for (const attempt of attempts) {
    // এই পরীক্ষায় প্রতিটি বিষয়ের অংশ আলাদা করে হিসাব
    const sections = new Map<string, { total: number; correct: number; wrong: number }>();

    for (const instance of attempt.session.questions) {
      const question = getQuestionById(instance.id);
      if (!question) continue;

      const section = sections.get(question.subjectSlug) ?? { total: 0, correct: 0, wrong: 0 };
      section.total += 1;
      const chosen = attempt.session.answers[instance.id];
      if (chosen !== undefined) {
        if (chosen === question.correctIndex) section.correct += 1;
        else section.wrong += 1;
      }
      sections.set(question.subjectSlug, section);
    }

    sections.forEach((section, slug) => {
      const acc = accumulators.get(slug) ?? { tests: 0, passed: 0, correct: 0, wrong: 0, skipped: 0 };
      const score = section.correct * MARK_CORRECT + section.wrong * MARK_WRONG;
      const percent = (Math.max(0, score) / section.total) * 100;

      acc.tests += 1;
      if (percent >= PASS_PERCENT) acc.passed += 1;
      acc.correct += section.correct;
      acc.wrong += section.wrong;
      acc.skipped += section.total - section.correct - section.wrong;
      accumulators.set(slug, acc);
    });
  }

  // বিষয় অনুযায়ী স্বতন্ত্র উত্তর দেওয়া প্রশ্ন
  const uniqueBySubject = new Map<string, number>();
  history.answered.forEach((id) => {
    const question = getQuestionById(id);
    if (question) {
      uniqueBySubject.set(question.subjectSlug, (uniqueBySubject.get(question.subjectSlug) ?? 0) + 1);
    }
  });

  return allSubjects
    .map((subject) => {
      const totalMcq = questionPool.filter((q) => q.subjectSlug === subject.slug).length;
      const acc = accumulators.get(subject.slug) ?? {
        tests: 0,
        passed: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      };
      const uniqueAnswered = uniqueBySubject.get(subject.slug) ?? 0;
      const answered = acc.correct + acc.wrong;

      return {
        subjectSlug: subject.slug,
        totalMcq,
        uniqueAnswered,
        coveragePercent: totalMcq ? round1((uniqueAnswered / totalMcq) * 100) : 0,
        answered,
        correct: acc.correct,
        wrong: acc.wrong,
        skipped: acc.skipped,
        accuracy: answered ? round1((acc.correct / answered) * 100) : null,
        tests: acc.tests,
        passed: acc.passed,
        successRate: acc.tests ? round1((acc.passed / acc.tests) * 100) : null,
      };
    })
    // যেসব বিষয়ে প্রশ্নই নেই সেগুলো বিশ্লেষণে আসে না
    .filter((stat) => stat.totalMcq > 0);
}

export type Strength = "strong" | "weak" | "average" | "insufficient";

// পর্যাপ্ত তথ্য থাকলে Accuracy দেখে শক্তিশালী/দুর্বল/মাঝারি নির্ধারণ
export function classifySubject(stat: SubjectStat): Strength {
  if (stat.accuracy === null || stat.answered < MIN_ANSWERED_FOR_ANALYSIS) return "insufficient";
  if (stat.accuracy >= STRONG_ACCURACY) return "strong";
  if (stat.accuracy < WEAK_ACCURACY) return "weak";
  return "average";
}

// ---- প্রস্তাবিত অনুশীলন (নিয়মভিত্তিক) ----

export type Recommendation = {
  id: string;
  kind: "weak" | "mistakes" | "new";
  title: string;
  reason: string;
  questionIds: string[];
  durationMin: number;
};

export function getRecommendations(
  stats: SubjectStat[],
  history: QuestionHistory,
  attemptCount: number,
): Recommendation[] {
  const result: Recommendation[] = [];

  // ১. দুর্বল বিষয়: ভুল করা প্রশ্ন আগে, তারপর নতুন, তারপর বাকি
  const weakStats = stats
    .filter((stat) => classifySubject(stat) === "weak")
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
    .slice(0, 2);

  for (const stat of weakStats) {
    const ids = questionPool.filter((q) => q.subjectSlug === stat.subjectSlug).map((q) => q.id);
    const ordered = [
      ...ids.filter((id) => history.wrong.has(id)),
      ...ids.filter((id) => !history.answered.has(id)),
      ...ids.filter((id) => history.answered.has(id) && !history.wrong.has(id)),
    ].slice(0, RECOMMENDED_QUESTION_COUNT);

    result.push({
      id: `weak-${stat.subjectSlug}`,
      kind: "weak",
      title: `${getSubject(stat.subjectSlug)?.name ?? "বিষয়"} — দুর্বলতা কাটান`,
      reason: `এই বিষয়ে আপনার সঠিক উত্তরের হার ${stat.accuracy}%`,
      questionIds: ordered,
      durationMin: estimateDurationMin(ordered.length),
    });
  }

  // ২. আগে ভুল করা প্রশ্ন
  const mistakeIds = Array.from(history.wrong).slice(0, RECOMMENDED_QUESTION_COUNT);
  if (mistakeIds.length > 0) {
    result.push({
      id: "mistakes",
      kind: "mistakes",
      title: "ভুল করা প্রশ্ন আবার অনুশীলন",
      reason: `${mistakeIds.length}টি প্রশ্নে আপনার সর্বশেষ উত্তর ভুল ছিল`,
      questionIds: mistakeIds,
      durationMin: estimateDurationMin(mistakeIds.length),
    });
  }

  // ৩. নতুন (এখনও উত্তর না দেওয়া) প্রশ্ন
  const newIds = questionPool
    .filter((q) => !history.answered.has(q.id))
    .map((q) => q.id)
    .slice(0, RECOMMENDED_QUESTION_COUNT);
  if (newIds.length > 0) {
    result.push({
      id: "new",
      kind: "new",
      title: attemptCount === 0 ? "প্রথম অনুশীলন শুরু করুন" : "নতুন প্রশ্ন অনুশীলন",
      reason:
        attemptCount === 0
          ? "এখনও কোনো প্রশ্নে উত্তর দেননি"
          : `${newIds.length}টি প্রশ্ন আপনি এখনও অনুশীলন করেননি`,
      questionIds: newIds,
      durationMin: estimateDurationMin(newIds.length),
    });
  }

  return result.slice(0, 3);
}