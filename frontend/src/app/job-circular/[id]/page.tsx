// frontend/src/app/job-circular/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { DeadlineStatus } from "@/components/jobs/DeadlineStatus";
import { formatBanglaDate } from "@/lib/format";
import { getJobItem, getSafeApplyUrl, jobItems } from "@/lib/jobs-data";

type Props = { params: Promise<{ id: string }> };

// সব বিজ্ঞপ্তির পেজ বিল্ডের সময়ই তৈরি হবে (SEO ও গতির জন্য)
export function generateStaticParams() {
  return jobItems.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = getJobItem(id);
  return job ? { title: job.org, description: job.summary } : { title: "চাকরির বিজ্ঞপ্তি" };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJobItem(id);
  if (!job) notFound();

  // বিজ্ঞপ্তির মূল তথ্যগুলো তালিকা আকারে
  const details = [
    { label: "ক্যাটাগরি", value: job.category },
    { label: "পদসংখ্যা", value: job.posts },
    { label: "বেতন", value: job.salary },
    { label: "যোগ্যতা", value: job.qualification },
    { label: "আবেদন পদ্ধতি", value: job.applyInfo },
    { label: "প্রকাশের তারিখ", value: formatBanglaDate(job.publishedAt) },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/job-circular" className="text-primary hover:underline">
          চাকরির বিজ্ঞপ্তি
        </Link>
        <ChevronRight size={14} />
        <span className="line-clamp-1 text-foreground">{job.org}</span>
      </nav>

      <article className="rounded-xl border border-border bg-card p-6">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {job.category}
        </span>
        <h1 className="mb-2 mt-3 font-display text-2xl font-bold leading-snug">{job.org}</h1>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

        <DeadlineStatus deadline={job.deadline} className="mb-5 text-sm" />

        <dl className="mb-6 divide-y divide-border rounded-lg border border-border">
          {details.map((item) => (
            <div key={item.label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-3">
              <dt className="font-medium">{item.label}</dt>
              <dd className="text-muted-foreground sm:col-span-2">{item.value}</dd>
            </div>
          ))}
        </dl>

        <ApplyButton applyUrl={getSafeApplyUrl(job)} deadline={job.deadline} />
        <p className="mt-3 text-xs text-muted-foreground">
          আবেদনের লিংকটি নতুন ট্যাবে সংস্থার নিজস্ব সাইটে খুলবে। আবেদনের আগে সেখানকার
          নির্দেশনা ভালোভাবে পড়ে নিন।
        </p>
      </article>

      <Link
        href="/job-circular"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ArrowLeft size={14} /> সব বিজ্ঞপ্তিতে ফিরে যান
      </Link>
    </div>
  );
}