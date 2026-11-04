// frontend/src/app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/static/PageShell";
import { features } from "@/lib/landing-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: `${siteConfig.name} — ${siteConfig.tagline}`,
};

export default function AboutPage() {
  return (
    <PageShell title="আমাদের সম্পর্কে" subtitle={`${siteConfig.name} — ${siteConfig.tagline}`}>
      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-bold">আমাদের লক্ষ্য</h2>
        <p className="leading-relaxed text-muted-foreground">
          বাংলা ভাষায় BCS ও অন্যান্য চাকরির পরীক্ষার প্রস্তুতি এক জায়গায়, সহজ ও গোছানো উপায়ে
          পৌঁছে দেওয়াই আমাদের লক্ষ্য। পড়া, অনুশীলন, মডেল টেস্ট ও নিজের অগ্রগতি যাচাই, সবকিছু
          যাতে একটি প্ল্যাটফর্মেই করা যায়।
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-bold">আমরা কী দিই</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}1a`, color }}
              >
                <Icon size={20} />
              </div>
              <h3 className="mb-1 text-sm font-semibold">{title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-bold">কীভাবে শুরু করবেন</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>ফ্রি অ্যাকাউন্ট খুলুন এবং ৭ দিন সব সুবিধা ব্যবহার করুন।</li>
          <li>বিষয় ধরে পড়ুন, অনুশীলন করুন এবং মডেল টেস্ট দিন।</li>
          <li>ড্যাশবোর্ডে নিজের অগ্রগতি ও দুর্বল জায়গা দেখে নিন।</li>
          <li>প্রয়োজনে Premium নিন, অথবা কোচিং সেন্টারের জন্য কর্পোরেট অ্যাকাউন্ট খুলুন।</li>
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          ফ্রি শুরু করুন
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
        >
          যোগাযোগ করুন
        </Link>
      </div>
    </PageShell>
  );
}