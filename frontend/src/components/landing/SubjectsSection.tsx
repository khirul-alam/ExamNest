// frontend/src/components/landing/SubjectsSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { subjects } from "@/lib/landing-data";

export function SubjectsSection() {
  return (
    <section className="border-y border-border bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              বিষয়সমূহ
            </h2>
            <p className="mt-1 text-muted-foreground">
              BCS সিলেবাস অনুযায়ী সাজানো বিষয়ভিত্তিক প্রস্তুতি
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            সব বিষয় দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/subjects/${subject.slug}`}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                style={{ backgroundColor: `${subject.color}1a` }}
              >
                {subject.icon}
              </div>
              <h3 className="text-sm font-semibold leading-snug group-hover:text-primary">
                {subject.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}