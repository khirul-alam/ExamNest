// frontend/src/components/dashboard/UpcomingJobsCard.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DeadlineStatus } from "@/components/jobs/DeadlineStatus";
import { daysUntil } from "@/lib/format";
import { jobItems } from "@/lib/jobs-data";
import { toBanglaNumber } from "@/lib/pricing";
import { useToday } from "@/lib/useToday";

// এত দিনের মধ্যে আবেদনের শেষ তারিখ হলে তালিকায় আসবে
const WINDOW_DAYS = 14;
const MAX_ITEMS = 3;

export function UpcomingJobsCard() {
  const today = useToday();

  const rows = today
    ? jobItems
        .map((job) => ({ job, daysLeft: daysUntil(job.deadline, today) }))
        .filter(({ daysLeft }) => daysLeft >= 0 && daysLeft <= WINDOW_DAYS)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, MAX_ITEMS)
    : [];

  return (
    <DashboardCard
      title="আবেদনের শেষ তারিখ কাছে"
      icon={Briefcase}
      action={
        <Link href="/job-circular" className="text-xs text-primary hover:underline">
          সব দেখুন
        </Link>
      }
    >
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          আগামী {toBanglaNumber(WINDOW_DAYS)} দিনে আবেদনের সময় শেষ হচ্ছে এমন বিজ্ঞপ্তি নেই।
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ job }) => (
            <li key={job.id} className="rounded-lg bg-muted p-3">
              <Link
                href={`/job-circular/${job.id}`}
                className="mb-1 flex items-center justify-between gap-2 text-sm font-medium hover:text-primary"
              >
                <span className="truncate">{job.org}</span>
                <ArrowRight size={13} className="shrink-0" />
              </Link>
              <DeadlineStatus deadline={job.deadline} />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}