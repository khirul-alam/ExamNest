// frontend/src/app/current-affairs/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import {
  categoryColors,
  currentAffairsItems,
  getCurrentAffairsItem,
} from "@/lib/current-affairs-data";
import { formatBanglaDate } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

// সব খবরের পেজ বিল্ডের সময়ই তৈরি হবে (SEO ও গতির জন্য)
export function generateStaticParams() {
  return currentAffairsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = getCurrentAffairsItem(id);
  return item
    ? { title: item.title, description: item.summary }
    : { title: "কারেন্ট অ্যাফেয়ার্স" };
}

export default async function CurrentAffairsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = getCurrentAffairsItem(id);
  if (!item) notFound();

  const color = categoryColors[item.category];
  // একই ক্যাটাগরির আরও ৩টি খবর
  const related = currentAffairsItems
    .filter((other) => other.category === item.category && other.id !== item.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/current-affairs" className="text-primary hover:underline">
          কারেন্ট অ্যাফেয়ার্স
        </Link>
        <ChevronRight size={14} />
        <span className="line-clamp-1 text-foreground">{item.title}</span>
      </nav>

      <article className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            {item.category}
          </span>
          {item.important && (
            <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-950/40">
              🔥 পরীক্ষার জন্য গুরুত্বপূর্ণ
            </span>
          )}
          <time dateTime={item.date} className="ml-auto font-mono text-xs text-muted-foreground">
            প্রকাশ: {formatBanglaDate(item.date)}
          </time>
        </div>

        <h1 className="mb-3 font-display text-2xl font-bold leading-snug">{item.title}</h1>
        <p className="mb-5 rounded-lg bg-muted px-4 py-3 text-sm font-medium leading-relaxed">
          {item.summary}
        </p>

        {/* অনুচ্ছেদগুলো ফাঁকা লাইন ধরে আলাদা করে দেখানো হয় */}
        <div className="space-y-4">
          {item.detail.split("\n\n").map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-6 border-t border-border pt-3 text-xs text-muted-foreground">
          সূত্র: {item.source}
        </p>
      </article>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold">
            আরও {item.category} সংক্রান্ত খবর
          </h2>
          <ul className="space-y-2">
            {related.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/current-affairs/${other.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted"
                >
                  <span className="line-clamp-1">{other.title}</span>
                  <ArrowRight size={14} className="shrink-0 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href="/current-affairs"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ArrowLeft size={14} /> সব খবরে ফিরে যান
      </Link>
    </div>
  );
}