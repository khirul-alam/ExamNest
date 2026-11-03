// frontend/src/components/landing/FeaturesSection.tsx
import { features } from "@/lib/landing-data";

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          একটি সম্পূর্ণ শেখার ইকোসিস্টেম
        </h2>
        <p className="mt-2 text-muted-foreground">
          শিখুন, অনুশীলন করুন, পরীক্ষা দিন, বিশ্লেষণ দেখুন এবং রিভিশন করুন
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              <Icon size={22} />
            </div>
            <h3 className="mb-1.5 font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}