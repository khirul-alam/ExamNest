// frontend/src/components/exam/ExamSetup.tsx
"use client";

import { useState } from "react";
import { Clock, ListChecks, ShieldAlert } from "lucide-react";
import { MARK_CORRECT, MARK_WRONG, MAX_VIOLATIONS, type ExamMode } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";

const timeChoices = [10, 20, 30, 60] as const;
const countChoices = [10, 20, 30, 50, 100] as const;

type Choice = number | "custom";

type Props = {
  title: string;
  mode: ExamMode;
  poolSize: number;
  // মডেল টেস্টের সময় ও প্রশ্ন সংখ্যা আগে থেকেই ঠিক করা থাকে
  preset?: { durationMin: number; questionCount: number };
  onStart: (config: { durationMin: number; questionCount: number }) => void;
};

export function ExamSetup({ title, mode, poolSize, preset, onStart }: Props) {
  const [timeChoice, setTimeChoice] = useState<Choice>(20);
  const [countChoice, setCountChoice] = useState<Choice>(10);
  const [customTime, setCustomTime] = useState("15");
  const [customCount, setCustomCount] = useState("15");
  const [error, setError] = useState("");

  const durationMin = preset
    ? preset.durationMin
    : timeChoice === "custom"
      ? Number(customTime)
      : timeChoice;
  const requestedCount = preset
    ? preset.questionCount
    : countChoice === "custom"
      ? Number(customCount)
      : countChoice;
  const actualCount = Math.min(requestedCount, poolSize);

  const handleStart = () => {
    if (!Number.isInteger(durationMin) || durationMin < 1 || durationMin > 180) {
      setError("সময় ১ থেকে ১৮০ মিনিটের মধ্যে দিন");
      return;
    }
    if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 200) {
      setError("প্রশ্ন সংখ্যা ১ থেকে ২০০-এর মধ্যে দিন");
      return;
    }
    setError("");
    onStart({ durationMin, questionCount: requestedCount });
  };

  const chipClass = (active: boolean) =>
    `rounded-lg border py-2.5 text-sm font-medium transition-colors ${
      active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
    }`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold">{title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {preset ? "পরীক্ষা শুরুর আগে নিয়মগুলো পড়ে নিন" : "পরীক্ষার সময় ও প্রশ্ন সংখ্যা নির্বাচন করুন"}
      </p>

      {preset ? (
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Clock size={20} className="mx-auto mb-1 text-primary" />
            <div className="font-mono text-xl font-bold">{toBanglaNumber(durationMin)} মিনিট</div>
            <div className="text-xs text-muted-foreground">সময়</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <ListChecks size={20} className="mx-auto mb-1 text-primary" />
            <div className="font-mono text-xl font-bold">{toBanglaNumber(actualCount)} টি</div>
            <div className="text-xs text-muted-foreground">প্রশ্ন</div>
          </div>
        </div>
      ) : (
        <>
          <section className="mb-6 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">⏱ সময় নির্বাচন করুন</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {timeChoices.map((t) => (
                <button key={t} onClick={() => setTimeChoice(t)} className={chipClass(timeChoice === t)}>
                  {toBanglaNumber(t)} মিনিট
                </button>
              ))}
              <button onClick={() => setTimeChoice("custom")} className={chipClass(timeChoice === "custom")}>
                Custom
              </button>
            </div>
            {timeChoice === "custom" && (
              <input
                type="number"
                min={1}
                max={180}
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                aria-label="কাস্টম সময় (মিনিট)"
                className="mt-3 w-40 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
              />
            )}
          </section>

          <section className="mb-6 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">📝 প্রশ্ন সংখ্যা নির্বাচন করুন</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {countChoices.map((c) => (
                <button key={c} onClick={() => setCountChoice(c)} className={chipClass(countChoice === c)}>
                  {toBanglaNumber(c)}
                </button>
              ))}
              <button onClick={() => setCountChoice("custom")} className={chipClass(countChoice === "custom")}>
                Custom
              </button>
            </div>
            {countChoice === "custom" && (
              <input
                type="number"
                min={1}
                max={200}
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                aria-label="কাস্টম প্রশ্ন সংখ্যা"
                className="mt-3 w-40 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
              />
            )}
          </section>
        </>
      )}

      {/* ডেমো ডাটার সীমা জানানো */}
      {requestedCount > poolSize && (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm">
          এখন প্রশ্ন ভান্ডারে মাত্র {toBanglaNumber(poolSize)}টি (ডেমো) প্রশ্ন আছে, তাই পরীক্ষা{" "}
          {toBanglaNumber(actualCount)}টি প্রশ্ন দিয়ে হবে।
        </p>
      )}

      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="mb-1 font-semibold text-primary">মার্কিং সিস্টেম</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>✅ সঠিক = <strong>+{toBanglaNumber(MARK_CORRECT)}</strong></span>
          <span>❌ ভুল = <strong>−{toBanglaNumber(Math.abs(MARK_WRONG))}</strong></span>
          <span>⏭ Skip = <strong>০</strong></span>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-4 text-sm">
        <p className="mb-2 flex items-center gap-1.5 font-semibold">
          <ShieldAlert size={16} className="text-amber-600" /> পরীক্ষার নিয়ম
        </p>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          {mode === "model" && <li>পরীক্ষা চলার সময় <strong>ফুলস্ক্রিন মোড বাধ্যতামূলক</strong></li>}
          <li>
            ট্যাব বদলানো বা উইন্ডো ছাড়লে সতর্কতা আসবে; {toBanglaNumber(MAX_VIOLATIONS)} বার হলে পরীক্ষা নিজে জমা হবে
          </li>
          <li>Copy, Paste ও Right-Click বন্ধ থাকবে</li>
          <li>ব্রাউজার রিফ্রেশ করলেও আপনার উত্তর ও সময় সংরক্ষিত থাকবে</li>
          <li>সময় শেষ হলে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হবে</li>
        </ul>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <button
        onClick={handleStart}
        className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
      >
        পরীক্ষা শুরু করুন →
      </button>
    </div>
  );
}