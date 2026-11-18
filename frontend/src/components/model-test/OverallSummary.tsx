// frontend/src/components/model-test/OverallSummary.tsx
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Target,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Overview } from "@/lib/analytics";
import { toBanglaNumber } from "@/lib/pricing";

type Props = {
  overview: Overview;
  prepDone: number; // সম্পন্ন টপিক
  prepTotal: number; // মোট টপিক
};

type Card = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
};

const percentText = (value: number | null) =>
  value === null ? "—" : `${toBanglaNumber(value)}%`;

export function OverallSummary({ overview, prepDone, prepTotal }: Props) {
  const prepPercent = prepTotal ? Math.round((prepDone / prepTotal) * 100) : 0;

  const cards: Card[] = [
    {
      icon: ClipboardList,
      label: "মোট পরীক্ষা",
      value: toBanglaNumber(overview.totalTests),
      sub: `উত্তীর্ণ ${toBanglaNumber(overview.passedTests)}টি`,
      color: "#0d6e4f",
    },
    {
      icon: CheckCircle2,
      label: "সঠিক উত্তরের হার",
      value: percentText(overview.accuracy),
      sub: `${toBanglaNumber(overview.correct)}/${toBanglaNumber(overview.answered)} উত্তর`,
      color: "#2563eb",
    },
    {
      icon: Target,
      label: "MCQ অনুশীলন",
      value: `${toBanglaNumber(overview.uniqueAnswered)}/${toBanglaNumber(overview.totalMcq)}`,
      sub: `${toBanglaNumber(overview.coveragePercent)}% কভারেজ`,
      color: "#7c3aed",
    },
    {
      icon: BookOpen,
      label: "প্রস্তুতির অগ্রগতি",
      value: `${toBanglaNumber(prepPercent)}%`,
      sub: `${toBanglaNumber(prepDone)}/${toBanglaNumber(prepTotal)} টপিক`,
      color: "#0891b2",
    },
    {
      icon: TrendingUp,
      label: "গড় স্কোর",
      value: percentText(overview.averagePercent),
      sub: "সব পরীক্ষার গড়",
      color: "#d97706",
    },
    {
      icon: Trophy,
      label: "সর্বোচ্চ স্কোর",
      value: percentText(overview.bestPercent),
      sub: "সেরা পরীক্ষা",
      color: "#dc2626",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              <Icon size={18} />
            </div>
            <div className="font-mono text-xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 font-mono text-xs" style={{ color }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {overview.totalTests === 0 && (
        <p className="mt-3 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          এখনও কোনো পরীক্ষা দেননি। নিচের কাস্টম টেস্ট বা মডেল টেস্ট দিয়ে শুরু করুন, ফলাফল এখানে
          নিজে থেকেই আসবে।
        </p>
      )}
    </div>
  );
}