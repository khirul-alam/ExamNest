// frontend/src/components/model-test/CustomTestBuilder.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { useStartSession } from "./useStartSession";
import type { QuestionHistory } from "@/lib/analytics";
import {
  CUSTOM_COUNT_MAX,
  CUSTOM_DURATION_MAX,
  CUSTOM_NAME_MAX,
  distributeQuestions,
  getCandidateIds,
  pickQuestionIds,
  sessionFromQuestionIds,
  type CustomSource,
} from "@/lib/custom-test";
import { loadSession, MARK_CORRECT, MARK_WRONG, type ExamSession } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects, getSubject } from "@/lib/subjects-data";

type Kind = "single" | "multiple" | "full";
type Choice = number | "custom";

const kinds: { id: Kind; title: string; desc: string }[] = [
  { id: "single", title: "একটি বিষয়", desc: "শুধু একটি বিষয়ের প্রশ্ন" },
  { id: "multiple", title: "একাধিক বিষয়", desc: "পছন্দের কয়েকটি বিষয় মিলিয়ে" },
  { id: "full", title: "সম্পূর্ণ সিলেবাস", desc: "সব বিষয় থেকে সমানভাবে" },
];

const sources: { id: CustomSource; title: string }[] = [
  { id: "all", title: "সব প্রশ্ন" },
  { id: "new", title: "শুধু নতুন (আগে উত্তর দেননি)" },
  { id: "mistakes", title: "শুধু আগে ভুল করা প্রশ্ন" },
];

const countChoices = [10, 20, 30, 50, 100] as const;
const timeChoices = [10, 20, 30, 60] as const;

type Props = {
  history: QuestionHistory;
  isLoggedIn: boolean;
  isReady: boolean;
};

const chipClass = (active: boolean, disabled = false) =>
  `rounded-lg border py-2 text-sm transition-colors ${
    disabled
      ? "cursor-not-allowed border-border text-muted-foreground opacity-50"
      : active
        ? "border-primary bg-primary/10 font-medium text-primary"
        : "border-border hover:border-primary/50"
  }`;

export function CustomTestBuilder({ history, isLoggedIn, isReady }: Props) {
  const startSession = useStartSession();

  const [kind, setKind] = useState<Kind>("multiple");
  const [selected, setSelected] = useState<string[]>([]);
  const [source, setSource] = useState<CustomSource>("all");
  const [countChoice, setCountChoice] = useState<Choice>(10);
  const [customCount, setCustomCount] = useState("15");
  const [timeChoice, setTimeChoice] = useState<Choice>(20);
  const [customTime, setCustomTime] = useState("15");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<ExamSession | null>(null);

  // আগের অসমাপ্ত পরীক্ষা থাকলে জানানো (নতুন শুরু করলে সেটি বাতিল হবে)
  useEffect(() => {
    if (isReady && isLoggedIn) setPending(loadSession());
  }, [isReady, isLoggedIn]);

  // প্রতিটি বিষয়ের প্রার্থী প্রশ্ন (নির্বাচিত উৎস অনুযায়ী)
  const candidatesBySlug: Record<string, string[]> = {};
  for (const subject of allSubjects) {
    candidatesBySlug[subject.slug] = getCandidateIds(subject.slug, source, history);
  }
  const selectable = allSubjects
    .filter((s) => candidatesBySlug[s.slug].length > 0)
    .map((s) => s.slug);

  // ধরন অনুযায়ী যেসব বিষয় নির্বাচিত ধরা হবে
  let chosen: string[];
  if (kind === "full") chosen = selectable;
  else if (kind === "single") chosen = selected.slice(0, 1).filter((s) => selectable.includes(s));
  else chosen = selected.filter((s) => selectable.includes(s));

  const requestedCount = countChoice === "custom" ? Number(customCount) : countChoice;
  const durationMin = timeChoice === "custom" ? Number(customTime) : timeChoice;
  const countValid =
    Number.isInteger(requestedCount) && requestedCount >= 1 && requestedCount <= CUSTOM_COUNT_MAX;
  const durationValid =
    Number.isInteger(durationMin) && durationMin >= 1 && durationMin <= CUSTOM_DURATION_MAX;

  const rows = distributeQuestions(
    chosen.map((slug) => ({ subjectSlug: slug, available: candidatesBySlug[slug].length })),
    countValid ? requestedCount : 0,
  );
  const planned = rows.reduce((sum, r) => sum + r.count, 0);

  const toggleSubject = (slug: string) => {
    if (kind === "single") setSelected([slug]);
    else setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const handleStart = () => {
    if (kind === "single" && chosen.length === 0) return setError("একটি বিষয় বেছে নিন");
    if (kind === "multiple" && chosen.length < 2) return setError("কমপক্ষে ২টি বিষয় বেছে নিন");
    if (kind === "full" && chosen.length === 0) return setError("কোনো বিষয়ে উপযুক্ত প্রশ্ন নেই");
    if (!countValid) return setError(`প্রশ্ন সংখ্যা ১ থেকে ${toBanglaNumber(CUSTOM_COUNT_MAX)}-এর মধ্যে দিন`);
    if (!durationValid) {
      return setError(`সময় ১ থেকে ${toBanglaNumber(CUSTOM_DURATION_MAX)} মিনিটের মধ্যে দিন`);
    }
    if (planned === 0) return setError("এই শর্তে কোনো প্রশ্ন পাওয়া যায়নি");

    const session = sessionFromQuestionIds({
      title: name.trim() || "কাস্টম মডেল টেস্ট",
      mode: "model",
      durationMin,
      questionIds: pickQuestionIds(rows, candidatesBySlug),
    });
    if (!session) return setError("পরীক্ষা তৈরি করা যায়নি");

    setError("");
    startSession(session);
  };

  const showLoginButton = isReady && !isLoggedIn;
  const showSubjectList = kind !== "full";

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        <div>
          <h3 className="font-display text-lg font-bold">নিজের মতো করে মডেল টেস্ট তৈরি করুন</h3>
          <p className="text-xs text-muted-foreground">
            প্রশ্ন প্রতিবার এলোমেলোভাবে বাছাই হয়, কোনো প্রশ্ন একই পরীক্ষায় দুবার আসে না।
          </p>
        </div>
      </div>

      {pending && (
        <p className="mb-5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
          আপনার একটি অসমাপ্ত পরীক্ষা আছে ({pending.title})।{" "}
          <Link href="/exam?resume=1" className="font-medium text-primary hover:underline">
            চালিয়ে যান
          </Link>
          । নতুন পরীক্ষা শুরু করলে সেটি বাতিল হবে।
        </p>
      )}

      <div className="space-y-6">
        {/* ১. পরীক্ষার ধরন */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">১. পরীক্ষার ধরন</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {kinds.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setKind(item.id);
                  if (item.id === "single") setSelected((prev) => prev.slice(0, 1));
                }}
                aria-pressed={kind === item.id}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  kind === item.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ২. প্রশ্নের উৎস */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">২. প্রশ্নের উৎস</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {sources.map((item) => {
              const disabled = item.id === "mistakes" && history.wrong.size === 0;
              return (
                <button
                  key={item.id}
                  disabled={disabled}
                  onClick={() => setSource(item.id)}
                  aria-pressed={source === item.id}
                  className={`px-2 ${chipClass(source === item.id, disabled)}`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
          {history.wrong.size === 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              পরীক্ষায় ভুল উত্তর দিলে &quot;আগে ভুল করা প্রশ্ন&quot; অপশনটি চালু হবে।
            </p>
          )}
        </section>

        {/* ৩. বিষয় নির্বাচন */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">৩. বিষয় নির্বাচন</h4>
          {showSubjectList ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {allSubjects.map((subject) => {
                  const available = candidatesBySlug[subject.slug].length;
                  const disabled = available === 0;
                  const checked = chosen.includes(subject.slug);
                  return (
                    <label
                      key={subject.slug}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                        disabled
                          ? "cursor-not-allowed border-border opacity-50"
                          : checked
                            ? "cursor-pointer border-primary bg-primary/10"
                            : "cursor-pointer border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type={kind === "single" ? "radio" : "checkbox"}
                        name="custom-subject"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSubject(subject.slug)}
                        className="accent-[var(--primary)]"
                      />
                      <span className="flex-1">{subject.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {disabled ? "প্রশ্ন নেই" : `${toBanglaNumber(available)}টি`}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                নির্বাচিত বিষয়: {toBanglaNumber(chosen.length)}টি
              </p>
            </>
          ) : (
            <p className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
              প্রশ্ন আছে এমন সব {toBanglaNumber(selectable.length)}টি বিষয় থেকে সমানভাবে প্রশ্ন
              আসবে।
            </p>
          )}
        </section>

        {/* ৪. প্রশ্ন সংখ্যা */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">৪. প্রশ্ন সংখ্যা</h4>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {countChoices.map((c) => (
              <button
                key={c}
                onClick={() => setCountChoice(c)}
                aria-pressed={countChoice === c}
                className={chipClass(countChoice === c)}
              >
                {toBanglaNumber(c)}
              </button>
            ))}
            <button
              onClick={() => setCountChoice("custom")}
              aria-pressed={countChoice === "custom"}
              className={chipClass(countChoice === "custom")}
            >
              Custom
            </button>
          </div>
          {countChoice === "custom" && (
            <input
              type="number"
              min={1}
              max={CUSTOM_COUNT_MAX}
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              aria-label="কাস্টম প্রশ্ন সংখ্যা"
              className="mt-2 w-40 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
        </section>

        {/* ৫. সময় */}
        <section>
          <h4 className="mb-2 text-sm font-semibold">৫. পরীক্ষার সময়</h4>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {timeChoices.map((t) => (
              <button
                key={t}
                onClick={() => setTimeChoice(t)}
                aria-pressed={timeChoice === t}
                className={chipClass(timeChoice === t)}
              >
                {toBanglaNumber(t)} মিনিট
              </button>
            ))}
            <button
              onClick={() => setTimeChoice("custom")}
              aria-pressed={timeChoice === "custom"}
              className={chipClass(timeChoice === "custom")}
            >
              Custom
            </button>
          </div>
          {timeChoice === "custom" && (
            <input
              type="number"
              min={1}
              max={CUSTOM_DURATION_MAX}
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              aria-label="কাস্টম সময় (মিনিট)"
              className="mt-2 w-40 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
        </section>

        {/* ৬. পরীক্ষার নাম */}
        <section>
          <label htmlFor="custom-name" className="mb-2 block text-sm font-semibold">
            ৬. পরীক্ষার নাম (ঐচ্ছিক)
          </label>
          <input
            id="custom-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={CUSTOM_NAME_MAX}
            placeholder="কাস্টম মডেল টেস্ট"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </section>

        {/* প্রশ্ন বিভাজনের প্রিভিউ */}
        {chosen.length > 0 && (
          <section className="rounded-xl bg-muted p-4">
            <h4 className="mb-2 text-sm font-semibold">কোন বিষয় থেকে কতটি প্রশ্ন আসবে</h4>
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.subjectSlug} className="border-b border-border last:border-0">
                    <td className="py-1.5">{getSubject(row.subjectSlug)?.name}</td>
                    <td className="py-1.5 text-right font-mono">{toBanglaNumber(row.count)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="pt-2">মোট</td>
                  <td className="pt-2 text-right font-mono text-primary">
                    {toBanglaNumber(planned)}
                  </td>
                </tr>
              </tbody>
            </table>
            {countValid && planned < requestedCount && (
              <p className="mt-2 text-xs text-muted-foreground">
                এই শর্তে মাত্র {toBanglaNumber(planned)}টি উপযুক্ত প্রশ্ন আছে (ডেমো প্রশ্ন-ভান্ডারের
                সীমা), তাই পরীক্ষা এতগুলো প্রশ্ন দিয়েই হবে।
              </p>
            )}
          </section>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          নম্বর: সঠিক +{toBanglaNumber(MARK_CORRECT)}, ভুল −{toBanglaNumber(Math.abs(MARK_WRONG))},
          উত্তর না দিলে ০ (সব পরীক্ষায় একই নিয়ম)। কঠিনতার মাত্রা এবং অধ্যায়/টপিক বেছে নেওয়ার
          সুবিধা MCQ-তে সেই তথ্য যুক্ত হলে আসবে। পরীক্ষা ফুলস্ক্রিন মোডে চলবে।
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {showLoginButton ? (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            <Lock size={15} /> লগইন করে পরীক্ষা শুরু করুন
          </Link>
        ) : (
          <button
            onClick={handleStart}
            disabled={planned === 0}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            পরীক্ষা তৈরি করে শুরু করুন →
          </button>
        )}
      </div>
    </div>
  );
}