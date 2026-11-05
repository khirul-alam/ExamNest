// frontend/src/components/jobs/DeadlineStatus.tsx
"use client";

import { Clock } from "lucide-react";
import { daysUntil, formatBanglaDate } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";
import { useToday } from "@/lib/useToday";

type Props = {
  deadline: string; // YYYY-MM-DD
  className?: string;
};

// শেষ তারিখ এবং কত দিন বাকি তা দেখায় (৭ দিনের কম হলে লাল)
export function DeadlineStatus({ deadline, className = "" }: Props) {
  const today = useToday();
  const daysLeft = today ? daysUntil(deadline, today) : null;
  const expired = daysLeft !== null && daysLeft < 0;
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  let status = "";
  if (daysLeft !== null) {
    if (expired) status = "মেয়াদ শেষ";
    else if (daysLeft === 0) status = "আজই শেষ দিন";
    else status = `আর ${toBanglaNumber(daysLeft)} দিন বাকি`;
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs ${className}`}>
      <span className="flex items-center gap-1 font-mono text-muted-foreground">
        <Clock size={11} /> শেষ তারিখ: {formatBanglaDate(deadline)}
      </span>
      {status && (
        <span
          className={
            expired
              ? "text-muted-foreground"
              : urgent
                ? "font-medium text-red-600"
                : "text-muted-foreground"
          }
        >
          {status}
        </span>
      )}
    </div>
  );
}