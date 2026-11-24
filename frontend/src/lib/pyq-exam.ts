// frontend/src/lib/pyq-exam.ts
import { estimateDurationMin } from "@/lib/analytics";
import { sessionFromQuestionIds } from "@/lib/custom-test";
import { getQuestionById } from "@/lib/exam-data";
import { shuffle, type ExamSession } from "@/lib/exam-utils";
import { toBanglaDigits } from "@/lib/format";
import { pyqExams, type PyqExam } from "@/lib/previous-questions-data";
import { sortExams } from "@/lib/pyq-filters";
import { getSubject } from "@/lib/subjects-data";

// বিগত বছরের পরীক্ষা বানানোর পাঁচটি ধরন
export type BuilderKind = "single" | "year" | "organization" | "subject" | "custom";
export type CountChoice = number | "all";
export type TimeChoice = number | "auto";

export type BuilderInput = {
  kind: BuilderKind;
  examId: string; // single: নির্দিষ্ট পরীক্ষা
  year: number; // year: নির্দিষ্ট বছর
  organization: string; // organization: প্রতিষ্ঠান
  pickedExamIds: string[]; // organization ও custom: বাছাই করা পরীক্ষা
  subject: string; // subject: বিষয়
};

export type BuilderOptions = {
  count: CountChoice;
  time: TimeChoice;
  shuffle: boolean;
};

// নির্বাচন অনুযায়ী কোন কোন পরীক্ষা ধরা হবে
export function getSelectedExams(input: BuilderInput): PyqExam[] {
  switch (input.kind) {
    case "single":
      return pyqExams.filter((exam) => exam.id === input.examId);
    case "year":
      return sortExams(pyqExams.filter((exam) => exam.year === input.year));
    case "organization":
    case "custom":
      return sortExams(pyqExams.filter((exam) => input.pickedExamIds.includes(exam.id)));
    case "subject":
      return sortExams(pyqExams);
  }
}

// বাছাই করা পরীক্ষাগুলোর স্বতন্ত্র প্রশ্ন (একই প্রশ্ন একবারই), মূল প্রশ্নপত্রের ক্রমে
export function getBuilderQuestionIds(input: BuilderInput): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const exam of getSelectedExams(input)) {
    for (const id of exam.questionIds) {
      if (seen.has(id)) continue;
      if (input.kind === "subject" && getQuestionById(id)?.subjectSlug !== input.subject) continue;
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

export function getBuilderTitle(input: BuilderInput): string {
  switch (input.kind) {
    case "single":
      return getSelectedExams(input)[0]?.name ?? "বিগত বছরের পরীক্ষা";
    case "year":
      return `${toBanglaDigits(input.year)} সালের বিগত প্রশ্ন`;
    case "organization":
      return `${input.organization} — বিগত বছরের প্রশ্ন`;
    case "subject":
      return `${getSubject(input.subject)?.name ?? "বিষয়"} — বিগত বছরের প্রশ্ন`;
    case "custom":
      return "বিগত বছরের কাস্টম পরীক্ষা";
  }
}

export function resolveCount(choice: CountChoice, available: number): number {
  return choice === "all" ? available : Math.min(choice, available);
}

// "auto" হলে প্রশ্নসংখ্যা অনুযায়ী সময় নির্ধারিত হয়
export function resolveDuration(choice: TimeChoice, count: number): number {
  return choice === "auto" ? estimateDurationMin(count) : choice;
}

// পরীক্ষা তৈরি। এলোমেলো না করলে মূল প্রশ্নপত্রের প্রশ্ন ও অপশনের ক্রম ঠিক থাকে।
export function buildPyqSession(input: BuilderInput, options: BuilderOptions): ExamSession | null {
  const ids = getBuilderQuestionIds(input);
  if (ids.length === 0) return null;

  const count = resolveCount(options.count, ids.length);
  const picked = options.shuffle ? shuffle(ids).slice(0, count) : ids.slice(0, count);

  return sessionFromQuestionIds({
    title: getBuilderTitle(input),
    mode: "practice",
    durationMin: resolveDuration(options.time, picked.length),
    questionIds: picked,
    keepOrder: !options.shuffle,
  });
}

// একটি নির্দিষ্ট পরীক্ষার সব প্রশ্ন মূল ক্রমে নিয়ে সরাসরি পরীক্ষা তৈরি
export function buildSingleExamSession(exam: PyqExam): ExamSession | null {
  return buildPyqSession(
    {
      kind: "single",
      examId: exam.id,
      year: exam.year,
      organization: exam.organization,
      pickedExamIds: [],
      subject: "",
    },
    { count: "all", time: "auto", shuffle: false },
  );
}