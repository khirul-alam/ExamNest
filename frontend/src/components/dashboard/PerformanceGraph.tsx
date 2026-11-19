// frontend/src/components/dashboard/PerformanceGraph.tsx
"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import type { Attempt } from "@/lib/attempts";
import { getScorePoints, ranges, type RangeId } from "@/lib/dashboard-metrics";
import { PASS_PERCENT } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";

type Props = {
  attempts: Attempt[];
  todayIso: string;
};

// গ্রাফের মাপ ও ভেতরের ফাঁকা জায়গা
const WIDTH = 600;
const HEIGHT = 220;
const PAD = { left: 36, right: 12, top: 12, bottom: 28 };
const INNER_W = WIDTH - PAD.left - PAD.right;
const INNER_H = HEIGHT - PAD.top - PAD.bottom;

const xAt = (index: number, count: number) =>
  count === 1 ? PAD.left + INNER_W / 2 : PAD.left + (INNER_W * index) / (count - 1);
const yAt = (value: number) =>
  PAD.top + INNER_H - (INNER_H * Math.min(100, Math.max(0, value))) / 100;

export function PerformanceGraph({ attempts, todayIso }: Props) {
  const [rangeId, setRangeId] = useState<RangeId>("30d");
  const points = getScorePoints(attempts, rangeId, todayIso);
  const count = points.length;

  const scorePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i, count)},${yAt(p.percent)}`)
    .join(" ");

  // Accuracy নেই এমন পরীক্ষা (কোনো উত্তর দেওয়া হয়নি) বাদ দিয়ে লাইন
  const accuracyPoints = points
    .map((p, i) => ({ index: i, value: p.accuracy }))
    .filter((p): p is { index: number; value: number } => p.value !== null);
  const accuracyPath = accuracyPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(p.index, count)},${yAt(p.value)}`)
    .join(" ");

  const average = count
    ? Math.round((points.reduce((sum, p) => sum + p.percent, 0) / count) * 10) / 10
    : null;

  // ৮টির বেশি পরীক্ষা হলে সব নম্বর না দেখিয়ে কিছু বাদ দেওয়া হয়
  const labelStep = Math.max(1, Math.ceil(count / 8));

  return (
    <DashboardCard
      title="Performance Improvement"
      icon={TrendingUp}
      action={
        <div className="flex flex-wrap gap-1">
          {ranges.map((range) => (
            <button
              key={range.id}
              onClick={() => setRangeId(range.id)}
              aria-pressed={rangeId === range.id}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                rangeId === range.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      }
    >
      {count === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          এই সময়ে কোনো পরীক্ষা দেওয়া হয়নি। পরীক্ষা দিলে এখানে উন্নতির ধারা দেখা যাবে।
        </p>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted-foreground">
            {toBanglaNumber(count)}টি পরীক্ষা
            {average !== null && ` · গড় স্কোর ${toBanglaNumber(average)}%`}
          </p>

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="পরীক্ষার স্কোর ও Accuracy-র পরিবর্তনের গ্রাফ"
            className="w-full"
          >
            {/* আনুভূমিক রেখা ও শতকরা লেখা */}
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={yAt(value)}
                  y2={yAt(value)}
                  className="stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 6}
                  y={yAt(value) + 3}
                  textAnchor="end"
                  fontSize={10}
                  className="fill-muted-foreground"
                >
                  {toBanglaNumber(value)}
                </text>
              </g>
            ))}

            {/* পাস মার্কের রেখা */}
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={yAt(PASS_PERCENT)}
              y2={yAt(PASS_PERCENT)}
              className="stroke-red-400"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={WIDTH - PAD.right}
              y={yAt(PASS_PERCENT) - 4}
              textAnchor="end"
              fontSize={10}
              className="fill-red-400"
            >
              পাস {toBanglaNumber(PASS_PERCENT)}%
            </text>

            {/* Accuracy রেখা */}
            {accuracyPoints.length > 1 && (
              <path
                d={accuracyPath}
                fill="none"
                className="stroke-violet-500"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            )}
            {accuracyPoints.map((p) => (
              <circle
                key={`acc-${points[p.index].id}`}
                cx={xAt(p.index, count)}
                cy={yAt(p.value)}
                r={3}
                className="fill-violet-500"
              />
            ))}

            {/* স্কোর রেখা */}
            {count > 1 && (
              <path
                d={scorePath}
                fill="none"
                className="stroke-primary"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            )}
            {points.map((p, i) => (
              <circle
                key={`score-${p.id}`}
                cx={xAt(i, count)}
                cy={yAt(p.percent)}
                r={4}
                className="fill-primary"
              >
                <title>{`${p.title}: স্কোর ${toBanglaNumber(p.percent)}%`}</title>
              </circle>
            ))}

            {/* নিচের পরীক্ষার ক্রমিক নম্বর */}
            {points.map((p, i) =>
              i % labelStep === 0 || i === count - 1 ? (
                <text
                  key={`label-${p.id}`}
                  x={xAt(i, count)}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  fontSize={10}
                  className="fill-muted-foreground"
                >
                  {toBanglaNumber(i + 1)}
                </text>
              ) : null,
            )}
          </svg>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded bg-primary" /> স্কোর %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded bg-violet-500" /> Accuracy %
            </span>
            <span>প্রতিটি বিন্দু একটি পরীক্ষা (পুরনো থেকে নতুন)</span>
          </div>
        </>
      )}
    </DashboardCard>
  );
}