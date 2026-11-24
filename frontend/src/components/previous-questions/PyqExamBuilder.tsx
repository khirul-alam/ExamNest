// frontend/src/components/previous-questions/PyqExamBuilder.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Play } from "lucide-react";
import { useStartSession } from "@/components/model-test/useStartSession";
import { getQuestionById } from "@/lib/exam-data";
import { MARK_CORRECT, MARK_WRONG } from "@/lib/exam-utils";
import { toBanglaDigits } from "@/lib/format";
import { examTypes, pyqExams, previousQuestions } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import {
  buildPyqSession,
  getBuilderQuestionIds,
  resolveCount,
  resolveDuration,
  type BuilderInput,
  type BuilderKind,
  type CountChoice,
  type TimeChoice,
} from "@/lib/pyq-exam";
import { sortExams } from "@/lib/pyq-filters";
import { allSubjects } from "@/lib/subjects-data";

type Props = {
  canAct: boolean;
  showLock: boolean;
};

const kinds: { id: BuilderKind; title: string; desc: string }[] = [
  { id: "single", title: "একটি নির্দিষ্ট পরীক্ষা", desc: "পুরো প্রশ্নপত্র, মূল ক্রমে" },
  { id: "year", title: "একটি বছরের সব পরীক্ষা", desc: "ওই বছরের সব প্রতিষ্ঠান মিলিয়ে" },
  { id: "organization", title: "একটি প্রতিষ্ঠানের একাধিক পরীক্ষা", desc: "প্রতিষ্ঠানের পছন্দের পরীক্ষাগুলো" },
  { id: "subject", title: "বিষয়ভিত্তিক", desc: "একটি বিষয়ের সব বিগত প্রশ্ন" },
  { id: "custom", title: "নিজের পছন্দের একাধিক পরীক্ষা", desc: "যেকোনো পরীক্ষা বেছে মিলিয়ে" },
];

const countChoices: CountChoice[] = [20, 30, 50, 100, "all"];
const timeChoices: TimeChoice[] = [15, 30, 60, "auto"];

// বিকল্পের তালিকা ডাটা থেকে একবারই বের করা
const sortedExams = sortExams(pyqExams);
const years = Array.from(new Set(pyqExams.map((exam) => exam.year))).sort((a, b) => b - a);
const organizations = examTypes.filter((org) => pyqExams.some((exam) => exam.organization === org));
const pyqSubjectSlugs = new Set(
  previousQuestions.map((q) => q.subjectSlug),
);
const subjectOptions = allSubjects.filter((subject) => pyqSubjectSlugs.has(subject.slug));

const chipClass = (active: boolean) =>
  `rounded-lg border py-2 text-sm transition-colors ${
    active ? "border-primary bg-primary/10 font-medium text-primary" : "border-border hover:border-primary/50"
  }`;

const selectClass =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary";

export function PyqExamBuilder({ canAct, showLock }: Props) {
  const startSession = useStartSession();

  const [kind, setKind] = useState<BuilderKind>("single");
  const [examId, setExamId] = useState(sortedExams[0].id);
  const [year, setYear] = useState(years[0]);
  const [organization, setOrganization] = useState<string>(organizations[0]);
  // null মানে ওই প্রতিষ্ঠানের সব পরীক্ষা বাছা আছে
  const [orgPicked, setOrgPicked] = useState<string[] | null>(null);
  const [customPicked, setCustomPicked] = useState<string[]>([]);
  const [subject, setSubject] = useState(subjectOptions[0]?.slug ?? "");
  const [countChoice, setCountChoice] = useState<CountChoice>(20);
  const [timeChoice, setTimeChoice] = useState<TimeChoice>("auto");
  const [shuffleOn, setShuffleOn] = useState(false);
  const [error, setError] = useState("");

  const orgExams = sortedExams.filter((exam) => exam.organization === organization);
  const pickedExamIds =
    kind === "organization" ? (orgPicked ?? orgExams.map((e) => e.id)) : customPicked;

  const input: BuilderInput = { kind, examId, year, organization, pickedExamIds, subject };
  const ids = getBuilderQuestionIds(input);
  const count = resolveCount(countChoice, ids.length);
  const duration = resolveDuration(timeChoice, count);

  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const handleStart = () => {
    const session = buildPyqSession(input, { count: countChoice, time: timeChoice, shuffle: shuffleOn });
    if (!session) {
      setError("এই নির্বাচনে কোনো প্রশ্ন পাওয়া যায়নি। অন্তত একটি পরীক্ষা বা বিষয় বেছে নিন।");
      return;
    }
    setError("");
    startSession(session);
  };

  // একাধিক পরীক্ষা বাছার তালিকা (প্রতিষ্ঠানের বা সব পরীক্ষার)
  const checklist = kind === "organization" ? orgExams : kind === "custom" ? sortedExams : [];

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
      <h3 className="mb-1 font-display text-lg font-bold">বিগত বছরের পরীক্ষা তৈরি করুন</h3>
      <p className="mb-5 text-xs text-muted-foreground">
        একটি পরীক্ষা, একটি বছর, একটি প্রতিষ্ঠান বা বিষয় ধরে নিজের পছন্দের পরীক্ষা বানান।
      </p>

      <div className="space-y-6">
        {/* ১. পরীক্ষার ধরন */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">১. পরীক্ষার ধরন</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {kinds.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setKind(item.id);
                  // নির্দিষ্ট পরীক্ষায় মূল ক্রম, মিলিয়ে বানালে এলোমেলো হওয়াই স্বাভাবিক
                  setShuffleOn(item.id !== "single");
                }}
                aria-pressed={kind === item.id}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  kind === item.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ২. নির্বাচন */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">২. নির্বাচন</h4>

          {kind === "single" && (
            <select value={examId} onChange={(e) => setExamId(e.target.value)} aria-label="পরীক্ষা" className={selectClass}>
              {sortedExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          )}

          {kind === "year" && (
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="বছর" className={selectClass}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {toBanglaDigits(y)}
                </option>
              ))}
            </select>
          )}

          {kind === "subject" && (
            <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="বিষয়" className={selectClass}>
              {subjectOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          {kind === "organization" && (
            <select
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                setOrgPicked(null);
              }}
              aria-label="প্রতিষ্ঠান"
              className={`${selectClass} mb-2`}
            >
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          )}

          {checklist.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {checklist.map((exam) => {
                const checked = pickedExamIds.includes(exam.id);
                return (
                  <label
                    key={exam.id}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                      checked ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (kind === "organization") setOrgPicked(toggleIn(pickedExamIds, exam.id));
                        else setCustomPicked((prev) => toggleIn(prev, exam.id));
                      }}
                      className="mt-0.5 accent-[var(--primary)]"
                    />
                    <span>
                      {exam.name}
                      <span className="block font-mono text-muted-foreground">
                        {toBanglaNumber(exam.questionIds.length)}টি প্রশ্ন
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        {/* ৩. প্রশ্নের সংখ্যা */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">৩. প্রশ্নের সংখ্যা</h4>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {countChoices.map((choice) => (
              <button
                key={String(choice)}
                onClick={() => setCountChoice(choice)}
                aria-pressed={countChoice === choice}
                className={chipClass(countChoice === choice)}
              >
                {choice === "all" ? "সব প্রশ্ন" : toBanglaNumber(choice)}
              </button>
            ))}
          </div>
        </section>

        {/* ৪. সময় */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">৪. সময়</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {timeChoices.map((choice) => (
              <button
                key={String(choice)}
                onClick={() => setTimeChoice(choice)}
                aria-pressed={timeChoice === choice}
                className={chipClass(timeChoice === choice)}
              >
                {choice === "auto" ? "প্রশ্ন অনুযায়ী" : `${toBanglaNumber(choice)} মিনিট`}
              </button>
            ))}
          </div>
        </section>

        {/* ৫. অন্যান্য */}
        <section>
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={shuffleOn}
              onChange={(e) => setShuffleOn(e.target.checked)}
              className="mt-0.5 accent-[var(--primary)]"
            />
            <span>
              প্রশ্ন ও অপশন এলোমেলোভাবে সাজান
              <span className="block text-xs text-muted-foreground">
                বন্ধ থাকলে মূল প্রশ্নপত্রের ক্রমেই প্রশ্ন ও অপশন আসবে।
              </span>
            </span>
          </label>
        </section>

        {/* প্রিভিউ */}
        <section className="rounded-xl bg-muted p-4 text-sm">
          <p>
            মোট স্বতন্ত্র প্রশ্ন: <strong className="font-mono">{toBanglaNumber(ids.length)}</strong> ·
            পরীক্ষায় আসবে: <strong className="font-mono text-primary">{toBanglaNumber(count)}</strong>টি ·
            সময়: <strong className="font-mono">{toBanglaNumber(duration)}</strong> মিনিট
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            একই প্রশ্ন একাধিক পরীক্ষায় থাকলেও পরীক্ষায় একবারই আসে। নম্বর: সঠিক +
            {toBanglaNumber(MARK_CORRECT)}, ভুল −{toBanglaNumber(Math.abs(MARK_WRONG))}, উত্তর না দিলে ০
            (সব পরীক্ষায় একই নিয়ম)। নতুন পরীক্ষা শুরু করলে আগের অসমাপ্ত পরীক্ষা বাতিল হবে।
          </p>
        </section>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {canAct ? (
          <button
            onClick={handleStart}
            disabled={ids.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={15} /> পরীক্ষা শুরু করুন
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            {showLock && <Lock size={15} />} লগইন করে পরীক্ষা শুরু করুন
          </Link>
        )}
      </div>
    </div>
  );
}