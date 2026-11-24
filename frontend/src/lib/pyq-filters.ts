// frontend/src/lib/pyq-filters.ts
import { getQuestionById } from "@/lib/exam-data";
import { examTypes, pyqExams, type PyqExam } from "@/lib/previous-questions-data";
import { allSubjects } from "@/lib/subjects-data";

export type PyqFilterKey = "year" | "organization" | "post" | "exam" | "subject";
export type PyqFilters = Record<PyqFilterKey, string>;

export const ALL = "all";

export const emptyFilters: PyqFilters = {
  year: ALL,
  organization: ALL,
  post: ALL,
  exam: ALL,
  subject: ALL,
};

const filterKeys: PyqFilterKey[] = ["year", "organization", "post", "exam", "subject"];

// প্রতিটি পরীক্ষায় কোন কোন বিষয়ের প্রশ্ন আছে
const subjectsByExam = new Map<string, Set<string>>();
for (const exam of pyqExams) {
  const subjects = new Set<string>();
  for (const id of exam.questionIds) {
    const question = getQuestionById(id);
    if (question) subjects.add(question.subjectSlug);
  }
  subjectsByExam.set(exam.id, subjects);
}

function examHasSubject(exam: PyqExam, subject: string): boolean {
  return subjectsByExam.get(exam.id)?.has(subject) ?? false;
}

// একটি পরীক্ষা ফিল্টারের সাথে মেলে কিনা (ignore দিলে সেই ফিল্টারটি বাদ দিয়ে দেখা হয়)
function matches(exam: PyqExam, filters: PyqFilters, ignore?: PyqFilterKey): boolean {
  if (ignore !== "year" && filters.year !== ALL && String(exam.year) !== filters.year) return false;
  if (
    ignore !== "organization" &&
    filters.organization !== ALL &&
    exam.organization !== filters.organization
  ) {
    return false;
  }
  if (ignore !== "post" && filters.post !== ALL && exam.post !== filters.post) return false;
  if (ignore !== "exam" && filters.exam !== ALL && exam.id !== filters.exam) return false;
  if (ignore !== "subject" && filters.subject !== ALL && !examHasSubject(exam, filters.subject)) {
    return false;
  }
  return true;
}

// নতুন বছর আগে, তারপর প্রতিষ্ঠানের ক্রমে, তারপর নাম অনুযায়ী
export function sortExams(exams: PyqExam[]): PyqExam[] {
  return [...exams].sort(
    (a, b) =>
      b.year - a.year ||
      examTypes.indexOf(a.organization) - examTypes.indexOf(b.organization) ||
      a.name.localeCompare(b.name, "bn"),
  );
}

export type FilterOptions = {
  years: number[];
  organizations: string[];
  posts: string[];
  exams: PyqExam[];
  subjects: string[];
};

// প্রতিটি ফিল্টারের অপশন বাকি ফিল্টারগুলোর সাথে মিলিয়ে বের করা (ফিল্টারগুলো পরস্পর-সংযুক্ত)
export function getFilterOptions(filters: PyqFilters): FilterOptions {
  const years = new Set<number>();
  const organizations = new Set<string>();
  const posts = new Set<string>();
  const exams: PyqExam[] = [];
  const subjects = new Set<string>();

  for (const exam of pyqExams) {
    if (matches(exam, filters, "year")) years.add(exam.year);
    if (matches(exam, filters, "organization")) organizations.add(exam.organization);
    if (matches(exam, filters, "post")) posts.add(exam.post);
    if (matches(exam, filters, "exam")) exams.push(exam);
    if (matches(exam, filters, "subject")) {
      subjectsByExam.get(exam.id)?.forEach((slug) => subjects.add(slug));
    }
  }

  return {
    years: Array.from(years).sort((a, b) => b - a),
    organizations: examTypes.filter((org) => organizations.has(org)),
    posts: Array.from(posts).sort((a, b) => a.localeCompare(b, "bn")),
    exams: sortExams(exams),
    subjects: allSubjects.map((s) => s.slug).filter((slug) => subjects.has(slug)),
  };
}

// একটি ফিল্টার বদলানো; নতুন পছন্দের সাথে খাপ না খাওয়া অন্য ফিল্টার নিজে "সব"-তে ফেরে
export function applyFilterChange(
  filters: PyqFilters,
  key: PyqFilterKey,
  value: string,
): PyqFilters {
  const next: PyqFilters = { ...filters, [key]: value };

  for (let round = 0; round < filterKeys.length; round++) {
    const options = getFilterOptions(next);
    let changed = false;

    for (const other of filterKeys) {
      if (other === key || next[other] === ALL) continue;

      let valid = true;
      if (other === "year") valid = options.years.includes(Number(next.year));
      if (other === "organization") valid = options.organizations.includes(next.organization);
      if (other === "post") valid = options.posts.includes(next.post);
      if (other === "exam") valid = options.exams.some((exam) => exam.id === next.exam);
      if (other === "subject") valid = options.subjects.includes(next.subject);

      if (!valid) {
        next[other] = ALL;
        changed = true;
      }
    }
    if (!changed) break;
  }

  return next;
}

// ফিল্টারের সাথে মেলে এমন পরীক্ষা
export function getVisibleExams(filters: PyqFilters): PyqExam[] {
  return sortExams(pyqExams.filter((exam) => matches(exam, filters)));
}

// ফিল্টারের সাথে মেলে এমন স্বতন্ত্র প্রশ্ন। একটি পরীক্ষা বাছলে মূল প্রশ্নপত্রের ক্রমে আসে।
export function getVisibleQuestionIds(filters: PyqFilters): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const exam of getVisibleExams(filters)) {
    for (const id of exam.questionIds) {
      if (seen.has(id)) continue;
      if (filters.subject !== ALL && getQuestionById(id)?.subjectSlug !== filters.subject) continue;
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

// কয়েকটি পরীক্ষা মিলিয়ে স্বতন্ত্র প্রশ্ন কতটি (একই প্রশ্ন দুবার গোনা হয় না)
export function uniqueQuestionCount(exams: PyqExam[]): number {
  return new Set(exams.flatMap((exam) => exam.questionIds)).size;
}

export type YearStat = {
  year: number;
  exams: number;
  questions: number;
  byOrganization: { organization: string; questions: number }[];
};

export function getYearStats(): YearStat[] {
  const years = Array.from(new Set(pyqExams.map((exam) => exam.year))).sort((a, b) => b - a);

  return years.map((year) => {
    const yearExams = pyqExams.filter((exam) => exam.year === year);
    return {
      year,
      exams: yearExams.length,
      questions: uniqueQuestionCount(yearExams),
      byOrganization: examTypes
        .map((organization) => ({
          organization,
          questions: uniqueQuestionCount(yearExams.filter((e) => e.organization === organization)),
        }))
        .filter((item) => item.questions > 0),
    };
  });
}

export type OrganizationStat = {
  organization: string;
  exams: number;
  questions: number;
  years: number[];
};

export function getOrganizationStats(): OrganizationStat[] {
  return examTypes
    .map((organization) => {
      const orgExams = pyqExams.filter((exam) => exam.organization === organization);
      return {
        organization,
        exams: orgExams.length,
        questions: uniqueQuestionCount(orgExams),
        years: Array.from(new Set(orgExams.map((e) => e.year))).sort((a, b) => b - a),
      };
    })
    .filter((item) => item.exams > 0);
}