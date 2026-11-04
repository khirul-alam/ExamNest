// frontend/src/app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageShell } from "@/components/static/PageShell";
import { faqGroups } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা (FAQ)",
  description: "ExamNest সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর",
};

export default function FaqPage() {
  return (
    <PageShell title="সাধারণ জিজ্ঞাসা" subtitle="সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর">
      <div className="space-y-8">
        {faqGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 font-display text-lg font-bold">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item) => (
                // নেটিভ details/summary: জাভাস্ক্রিপ্ট ছাড়াই খোলে-বন্ধ হয়
                <details
                  key={item.question}
                  className="group rounded-xl border border-border bg-card"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        উত্তর পাননি?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          আমাদের জানান
        </Link>
      </p>
    </PageShell>
  );
}