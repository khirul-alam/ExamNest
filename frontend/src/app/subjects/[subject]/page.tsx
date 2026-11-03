// frontend/src/app/subjects/[subject]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ChapterList } from "@/components/subjects/ChapterList";
import { allSubjects, getSubject } from "@/lib/subjects-data";

type Props = { params: Promise<{ subject: string }> };

// সব বিষয়ের পেজ বিল্ডের সময়ই তৈরি হবে (SEO ও গতির জন্য)
export function generateStaticParams() {
  return allSubjects.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  return { title: subject?.name ?? "বিষয়" };
}

export default async function SubjectPage({ params }: Props) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/subjects" className="text-primary hover:underline">বিষয়সমূহ</Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{subject.name}</span>
      </nav>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{subject.icon}</span>
        <h1 className="font-display text-xl font-bold">{subject.name}</h1>
      </div>

      {subject.chapters.length > 0 ? (
        <ChapterList subject={subject} />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          এই বিষয়ের অধ্যায় ও টপিক শীঘ্রই যুক্ত করা হবে।
        </div>
      )}
    </div>
  );
}