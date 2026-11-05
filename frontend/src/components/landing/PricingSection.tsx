// frontend/src/components/landing/PricingSection.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CheckCircle2, Crown, Gift } from "lucide-react";
import { freeFeatures, premiumFeatures } from "@/lib/landing-data";
import {
  CORPORATE_LONG_TERM_DISCOUNT_PERCENT,
  CORPORATE_MIN_STUDENTS,
  CORPORATE_PRICE_PER_STUDENT,
  calcCorporateBreakdown,
  corporateDurations,
  corporateQuickCounts,
  formatTaka,
  premiumPlans,
  toBanglaNumber,
} from "@/lib/pricing";

// সুবিধার তালিকা দেখানোর ছোট কম্পোনেন্ট
function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  const [premiumId, setPremiumId] = useState<string>(premiumPlans[0].id);
  const [months, setMonths] = useState<number>(1);
  // ইনপুটে টাইপ করার সুবিধার জন্য সংখ্যাটি টেক্সট হিসেবে রাখা হয়েছে
  const [studentsInput, setStudentsInput] = useState("100");

  // প্রিমিয়াম: নির্বাচিত প্ল্যান, মাসিক গড় ও ১ মাসের দামের তুলনায় সাশ্রয়
  const monthlyPlan = premiumPlans[0];
  const premiumPlan = premiumPlans.find((p) => p.id === premiumId) ?? premiumPlans[0];
  const perMonth = Math.round(premiumPlan.price / premiumPlan.months);
  const savings = monthlyPlan.price * premiumPlan.months - premiumPlan.price;

  // কর্পোরেট: মোট দাম, ছাড় ও ছাড়ের পরের দাম
  const students = Number(studentsInput) || 0;
  const isBelowMin = students < CORPORATE_MIN_STUDENTS;
  const bill = calcCorporateBreakdown(students, months);

  const chipClass = (active: boolean) =>
    `rounded-lg border py-2 text-sm transition-colors ${
      active
        ? "border-primary bg-primary/10 font-medium text-primary"
        : "border-border hover:border-primary/50"
    }`;

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          আপনার জন্য সঠিক প্ল্যান বেছে নিন
        </h2>
        <p className="mt-2 text-muted-foreground">
          ব্যক্তিগত শিক্ষার্থী থেকে কোচিং সেন্টার — সবার জন্য প্ল্যান
        </p>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {/* ১. ফ্রি প্ল্যান */}
        <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Gift size={18} />
            </span>
            <h3 className="font-display text-lg font-bold">ফ্রি</h3>
          </div>

          <div className="mb-1 font-display text-3xl font-bold text-primary">
            {formatTaka(0)}
          </div>
          <p className="mb-5 text-sm text-muted-foreground">
            নিবন্ধনের পর ৭ দিন নিচের সব সুবিধা পাবেন। ৭ দিন শেষে অ্যাকাউন্ট বিজ্ঞাপনসহ
            Read Mode-এ চলবে।
          </p>

          <FeatureList items={freeFeatures} />

          <Link
            href="/register"
            className="mt-6 block rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 lg:mt-auto"
          >
            ফ্রি শুরু করুন
          </Link>
        </article>

        {/* ২. প্রিমিয়াম প্ল্যান */}
        <article className="flex flex-col rounded-2xl border-2 border-primary bg-card p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Crown size={18} />
            </span>
            <h3 className="font-display text-lg font-bold">প্রিমিয়াম</h3>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {premiumPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setPremiumId(plan.id)}
                aria-pressed={premiumId === plan.id}
                className={chipClass(premiumId === plan.id)}
              >
                {plan.label}
              </button>
            ))}
          </div>

          <div className="mb-1 font-display text-3xl font-bold text-primary">
            {formatTaka(premiumPlan.price)}
          </div>
          <p className="mb-1 min-h-5 text-xs text-muted-foreground">
            {premiumPlan.months > 1 &&
              `প্রতি মাসে প্রায় ${formatTaka(perMonth)}`}
          </p>
          <p className="mb-5 min-h-5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {savings > 0 && `১ মাসের দামের তুলনায় সাশ্রয় ${formatTaka(savings)}`}
          </p>

          <FeatureList items={premiumFeatures} />

          <Link
            href={`/register?plan=premium-${premiumPlan.id}`}
            className="mt-6 block rounded-lg bg-accent px-6 py-2.5 text-center text-sm font-medium text-accent-foreground hover:opacity-90 lg:mt-auto"
          >
            প্রিমিয়াম নিন
          </Link>
        </article>

        {/* ৩. কর্পোরেট প্ল্যান */}
        <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 text-secondary dark:text-blue-300">
              <Building2 size={18} />
            </span>
            <h3 className="font-display text-lg font-bold">কর্পোরেট</h3>
          </div>

          <div className="mb-1 font-display text-3xl font-bold text-primary">
            {formatTaka(CORPORATE_PRICE_PER_STUDENT)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / শিক্ষার্থী / মাস
            </span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            ন্যূনতম {toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন শিক্ষার্থী। ২ বছর বা তার
            বেশি মেয়াদে {toBanglaNumber(CORPORATE_LONG_TERM_DISCOUNT_PERCENT)}% ছাড়।
          </p>

          {/* মেয়াদ */}
          <div className="mb-1.5 text-xs font-medium">মেয়াদ</div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {corporateDurations.map((d) => (
              <button
                key={d.months}
                onClick={() => setMonths(d.months)}
                aria-pressed={months === d.months}
                className={chipClass(months === d.months)}
              >
                {d.label}
                {d.discountPercent > 0 && (
                  <span className="mt-0.5 block text-xs text-emerald-600 dark:text-emerald-400">
                    −{toBanglaNumber(d.discountPercent)}%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* শিক্ষার্থী সংখ্যা */}
          <label htmlFor="students" className="mb-1.5 block text-xs font-medium">
            শিক্ষার্থীর সংখ্যা
          </label>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {corporateQuickCounts.map((count) => (
              <button
                key={count}
                onClick={() => setStudentsInput(String(count))}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  students === count
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {toBanglaNumber(count)}
              </button>
            ))}
          </div>
          <input
            id="students"
            type="number"
            min={CORPORATE_MIN_STUDENTS}
            value={studentsInput}
            onChange={(e) => setStudentsInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {isBelowMin && (
            <p className="mt-1.5 text-xs text-red-500">
              ন্যূনতম {toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন শিক্ষার্থী প্রয়োজন।
            </p>
          )}

          {/* হিসাব */}
          <div className="mt-4 rounded-xl bg-muted p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {toBanglaNumber(students)} জন × {toBanglaNumber(months)} মাস
              </span>
              {!isBelowMin && bill.discount > 0 && (
                <span>{formatTaka(bill.subtotal)}</span>
              )}
            </div>
            {!isBelowMin && bill.discount > 0 && (
              <div className="mt-1 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span>ছাড় ({toBanglaNumber(bill.discountPercent)}%)</span>
                <span>−{formatTaka(bill.discount)}</span>
              </div>
            )}
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm font-medium">মোট</span>
              <span className="font-display text-xl font-bold text-primary">
                {isBelowMin ? "—" : formatTaka(bill.total)}
              </span>
            </div>
          </div>

          <p className="mb-2 mt-5 text-xs font-medium text-muted-foreground">
            প্রতিটি শিক্ষার্থী পাবে:
          </p>
          <FeatureList items={premiumFeatures} />

          {isBelowMin ? (
            <span className="mt-6 block cursor-not-allowed rounded-lg bg-muted px-6 py-2.5 text-center text-sm font-medium text-muted-foreground lg:mt-auto">
              কর্পোরেট অ্যাকাউন্ট খুলুন
            </span>
          ) : (
            <Link
              href={`/corporate/register?students=${students}&months=${months}`}
              className="mt-6 block rounded-lg bg-secondary px-6 py-2.5 text-center text-sm font-medium text-secondary-foreground hover:opacity-90 lg:mt-auto"
            >
              কর্পোরেট অ্যাকাউন্ট খুলুন
            </Link>
          )}
        </article>
      </div>
    </section>
  );
}