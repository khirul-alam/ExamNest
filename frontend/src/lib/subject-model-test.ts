// frontend/src/lib/subject-model-test.ts
import { questionPool } from "@/lib/exam-data";

// ⚠️ ডেমো মান। আসল ডাটাবেজে ন্যূনতম প্রশ্নসংখ্যা অনেক বেশি (যেমন ২০) রাখুন।
export const MIN_MODEL_TEST_QUESTIONS = 5;
export const MAX_MODEL_TEST_QUESTIONS = 50;
// প্রশ্নপ্রতি সময় (মিনিট): ২০০ প্রশ্নে ১২০ মিনিটের হারে
const MINUTES_PER_QUESTION = 0.6;
const MIN_DURATION_MIN = 5;

export type SubjectModelTest = {
  available: boolean; // যথেষ্ট প্রশ্ন আছে কিনা
  poolSize: number; // এই বিষয়ের মোট প্রশ্ন
  questionCount: number; // এই পরীক্ষায় আসা প্রশ্ন
  durationMin: number;
  href: string;
};

// একটি বিষয়ের মডেল টেস্টের তথ্য: প্রশ্ন সংখ্যা, সময় ও লিংক
export function getSubjectModelTest(subjectSlug: string): SubjectModelTest {
  const poolSize = questionPool.filter((q) => q.subjectSlug === subjectSlug).length;
  const questionCount = Math.min(poolSize, MAX_MODEL_TEST_QUESTIONS);
  const durationMin = Math.max(MIN_DURATION_MIN, Math.ceil(questionCount * MINUTES_PER_QUESTION));

  return {
    available: poolSize >= MIN_MODEL_TEST_QUESTIONS,
    poolSize,
    questionCount,
    durationMin,
    href: `/exam?mode=model&subject=${encodeURIComponent(subjectSlug)}`,
  };
}