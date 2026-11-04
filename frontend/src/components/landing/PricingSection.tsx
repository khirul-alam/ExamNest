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

type Tab = "free" | "premium" | "corporate";

const tabs: { id: Tab; label: string; icon: typeof Gift }[] = [
  { id: "free", label: "ফ্রি", icon: Gift },
  { id: "premium", label: "প্রিমিয়াম", icon: Crown },
  { id: "corporate", label: "কর্পোরেট", icon: Building2 },
];

// সুবিধার তালিকা দেখানোর ছোট কম্পোনেন্ট
function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm">
          <CheckCircle2 size={16} className="shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  const [tab, setTab] = useState<Tab>("free");
  const [premiumId, setPremiumId] = useState<string>(premiumPlans[0].id);
  const [months, setMonths] = useState<number>(1);
  // ইনপুটে টাইপ করার সুবিধার জন্য সংখ্যাটি টেক্সট হিসেবে রাখা হয়েছে
  const [studentsInput, setStudentsInput] = useState("100");

  const students = Number(studentsInput) || 0;
  const isBelowMin = students < CORPORATE_MIN_STUDENTS;
  // মোট দাম, ছাড় ও ছাড়ের পরের দামের হিসাব
  const bill = calcCorporateBreakdown(students, months);

  return (
    <section id="pricing" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          আপনার জন্য সঠিক প্ল্যান বেছে নিন
        </h2>
        <p className="mt-2 text-muted-foreground">
          ব্যক্তিগত শিক্ষার্থী থেকে কোচিং সেন্টার — সবার জন্য প্ল্যান
        </p>
      </div>

      {/* ট্যাব */}
      <div className="mx-auto mb-6 flex max-w-md rounded-xl border border-border bg-muted p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* ফ্রি প্ল্যান */}
        {tab === "free" && (
          <div>
            <h3 className="font-display text-xl font-bold">৭ দিনের ফ্রি অ্যাকাউন্ট</h3>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">
              নিবন্ধনের পর ৭ দিন নিচের সব সুবিধা পাবেন। ৭ দিন শেষে অ্যাকাউন্ট
              বিজ্ঞাপনসহ Read Mode-এ চলবে।
            </p>
            <FeatureList items={freeFeatures} />
            <Link
              href="/register"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              ফ্রি শুরু করুন
            </Link>
          </div>
        )}

        {/* প্রিমিয়াম প্ল্যান */}
        {tab === "premium" && (
          <div>
            <h3 className="font-display text-xl font-bold">প্রিমিয়াম</h3>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">
              সব সুবিধা আনলক করুন, কোনো বিজ্ঞাপন ছাড়া।
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {premiumPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setPremiumId(plan.id)}
                  className={`rounded-xl border p-3 text-center transition-colors ${
                    premiumId === plan.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm text-muted-foreground">{plan.label}</div>
                  <div className="mt-1 font-display text-lg font-bold text-primary">
                    {formatTaka(plan.price)}
                  </div>
                </button>
              ))}
            </div>

            <FeatureList items={premiumFeatures} />
            <Link
              href={`/register?plan=premium-${premiumId}`}
              className="mt-6 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              প্রিমিয়াম নিন
            </Link>
          </div>
        )}

        {/* কর্পোরেট প্ল্যান */}
        {tab === "corporate" && (
          <div>
            <h3 className="font-display text-xl font-bold">কর্পোরেট / প্রতিষ্ঠান</h3>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">
              কোচিং সেন্টার বা প্রতিষ্ঠানের নামে অ্যাকাউন্ট খুলুন। প্রতি শিক্ষার্থী
              মাসে {formatTaka(CORPORATE_PRICE_PER_STUDENT)}, ন্যূনতম{" "}
              {toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন। ২ বছর বা তার বেশি
              মেয়াদে {toBanglaNumber(CORPORATE_LONG_TERM_DISCOUNT_PERCENT)}% ছাড়।
            </p>

            {/* মেয়াদ */}
            <div className="mb-1.5 text-sm font-medium">মেয়াদ</div>
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {corporateDurations.map((d) => (
                <button
                  key={d.months}
                  onClick={() => setMonths(d.months)}
                  className={`rounded-lg border py-2 text-sm transition-colors ${
                    months === d.months
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {d.label}
                  {d.discountPercent > 0 && (
                    <span className="ml-1 rounded bg-emerald-100 px-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      −{toBanglaNumber(d.discountPercent)}%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* শিক্ষার্থী সংখ্যা */}
            <label htmlFor="students" className="mb-1.5 block text-sm font-medium">
              শিক্ষার্থীর সংখ্যা
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {corporateQuickCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setStudentsInput(String(count))}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    students === count
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {toBanglaNumber(count)} জন
                </button>
              ))}
            </div>
            <input
              id="students"
              type="number"
              min={CORPORATE_MIN_STUDENTS}
              value={studentsInput}
              onChange={(e) => setStudentsInput(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {isBelowMin && (
              <p className="mt-1.5 text-xs text-red-500">
                ন্যূনতম {toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন শিক্ষার্থী
                প্রয়োজন।
              </p>
            )}

            {/* হিসাব */}
            <div className="mt-6 rounded-xl bg-muted p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {toBanglaNumber(students)} জন × {toBanglaNumber(months)} মাস ×{" "}
                  {formatTaka(CORPORATE_PRICE_PER_STUDENT)}
                </span>
                {!isBelowMin && bill.discount > 0 && (
                  <span>{formatTaka(bill.subtotal)}</span>
                )}
              </div>
              {!isBelowMin && bill.discount > 0 && (
                <div className="mt-1 flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>ছাড় ({toBanglaNumber(bill.discountPercent)}%)</span>
                  <span>−{formatTaka(bill.discount)}</span>
                </div>
              )}
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-sm font-medium">মোট</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {isBelowMin ? "—" : formatTaka(bill.total)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <FeatureList items={premiumFeatures} />
            </div>

            {isBelowMin ? (
              <span className="mt-6 inline-block cursor-not-allowed rounded-lg bg-muted px-6 py-2.5 text-sm font-medium text-muted-foreground">
                কর্পোরেট অ্যাকাউন্ট খুলুন
              </span>
            ) : (
              <Link
                href={`/corporate/register?students=${students}&months=${months}`}
                className="mt-6 inline-block rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90"
              >
                কর্পোরেট অ্যাকাউন্ট খুলুন
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}