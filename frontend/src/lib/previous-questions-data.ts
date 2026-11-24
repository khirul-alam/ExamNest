// frontend/src/lib/previous-questions-data.ts
import { getQuestionById, type ExamQuestion } from "@/lib/exam-data";

// ⚠️ পরীক্ষার নাম, পদ, সাল এবং কোন প্রশ্ন কোন পরীক্ষায় এসেছে, সবই ডেমো।
// বাস্তব প্রতিষ্ঠানের নাম শুধু শ্রেণি বোঝাতে ব্যবহৃত। যাচাই ছাড়া প্রকাশ করা যাবে না।
// আসল ডাটা পরে Admin Panel থেকে আসবে।

// প্রতিষ্ঠানের তালিকা (প্রোফাইলের "লক্ষ্য পরীক্ষা"-তেও এটি ব্যবহৃত হয়)
export const examTypes = [
  "BCS",
  "BADC",
  "NTRCA",
  "Bank Job",
  "Primary Teacher",
  "Railway",
] as const;

export type Organization = (typeof examTypes)[number];

// একটি পরীক্ষা: প্রশ্ন নেই, শুধু প্রশ্নের আইডির তালিকা (মূল প্রশ্নপত্রের ক্রমে)
export type PyqExam = {
  id: string;
  name: string;
  organization: Organization;
  post: string;
  year: number;
  kind: string;
  questionIds: string[];
};

export const pyqExams: PyqExam[] = [
  {
    id: "bcs-2022-admin",
    name: "BCS প্রিলিমিনারি ২০২২ — প্রশাসন ক্যাডার (ডেমো)",
    organization: "BCS",
    post: "প্রশাসন ক্যাডার",
    year: 2022,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py1", "py4", "py11", "py13", "py3", "py21"],
  },
  {
    id: "bcs-2022-tech",
    name: "BCS প্রিলিমিনারি ২০২২ — টেকনিক্যাল ক্যাডার (ডেমো)",
    organization: "BCS",
    post: "টেকনিক্যাল ক্যাডার",
    year: 2022,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py9", "py20", "py4", "py17", "py19"],
  },
  {
    id: "bcs-2021-admin",
    name: "BCS প্রিলিমিনারি ২০২১ — প্রশাসন ক্যাডার (ডেমো)",
    organization: "BCS",
    post: "প্রশাসন ক্যাডার",
    year: 2021,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py4", "py5", "py1", "py12", "py23"],
  },
  {
    id: "badc-2022-ad",
    name: "BADC সহকারী পরিচালক MCQ ২০২২ (ডেমো)",
    organization: "BADC",
    post: "সহকারী পরিচালক",
    year: 2022,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py1", "py11", "py13", "py8", "py22"],
  },
  {
    id: "badc-2022-office",
    name: "BADC অফিস সহায়ক MCQ ২০২২ (ডেমো)",
    organization: "BADC",
    post: "অফিস সহায়ক",
    year: 2022,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py2", "py14", "py15", "py16", "py10"],
  },
  {
    id: "badc-2023-ad",
    name: "BADC সহকারী পরিচালক MCQ ২০২৩ (ডেমো)",
    organization: "BADC",
    post: "সহকারী পরিচালক",
    year: 2023,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py4", "py5", "py18", "py7", "py21"],
  },
  {
    id: "ntrca-2023",
    name: "NTRCA সহকারী শিক্ষক নিবন্ধন ২০২৩ (ডেমো)",
    organization: "NTRCA",
    post: "সহকারী শিক্ষক",
    year: 2023,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py5", "py12", "py2", "py23", "py22"],
  },
  {
    id: "ntrca-2021",
    name: "NTRCA সহকারী শিক্ষক নিবন্ধন ২০২১ (ডেমো)",
    organization: "NTRCA",
    post: "সহকারী শিক্ষক",
    year: 2021,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py12", "py2", "py8", "py19", "py4"],
  },
  {
    id: "bank-2022",
    name: "ব্যাংক জব — সিনিয়র অফিসার ২০২২ (ডেমো)",
    organization: "Bank Job",
    post: "সিনিয়র অফিসার",
    year: 2022,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py3", "py8", "py6", "py10"],
  },
  {
    id: "bank-2024",
    name: "ব্যাংক জব — অফিসার (ক্যাশ) ২০২৪ (ডেমো)",
    organization: "Bank Job",
    post: "অফিসার (ক্যাশ)",
    year: 2024,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py17", "py18", "py9", "py20", "py1"],
  },
  {
    id: "primary-2024",
    name: "প্রাইমারি সহকারী শিক্ষক ২০২৪ (ডেমো)",
    organization: "Primary Teacher",
    post: "সহকারী শিক্ষক",
    year: 2024,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py2", "py7", "py14", "py15", "py16", "py11"],
  },
  {
    id: "railway-2019",
    name: "রেলওয়ে সহকারী স্টেশন মাস্টার ২০১৯ (ডেমো)",
    organization: "Railway",
    post: "সহকারী স্টেশন মাস্টার",
    year: 2019,
    kind: "MCQ পরীক্ষা",
    questionIds: ["py6", "py10", "py19", "py14"],
  },
];

export function getPyqExam(id: string): PyqExam | undefined {
  return pyqExams.find((exam) => exam.id === id);
}

// একটি প্রশ্ন কোন পরীক্ষায় কত নম্বর প্রশ্ন হিসেবে এসেছে
export type QuestionSource = { exam: PyqExam; order: number };

const sourceIndex = new Map<string, QuestionSource[]>();
for (const exam of pyqExams) {
  exam.questionIds.forEach((questionId, index) => {
    const list = sourceIndex.get(questionId) ?? [];
    list.push({ exam, order: index + 1 });
    sourceIndex.set(questionId, list);
  });
}

// প্রশ্নের সব উৎস (একই প্রশ্ন একাধিক পরীক্ষায় থাকলে একাধিক)
export function getQuestionSources(questionId: string): QuestionSource[] {
  return sourceIndex.get(questionId) ?? [];
}

// কমপক্ষে একটি পরীক্ষায় থাকা স্বতন্ত্র প্রশ্ন (একই প্রশ্ন একবারই গোনা)
export const previousQuestions: ExamQuestion[] = Array.from(sourceIndex.keys())
  .map((id) => getQuestionById(id))
  .filter((question): question is ExamQuestion => question !== undefined);