// frontend/src/components/landing/CtaSection.tsx
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary to-emerald-800 px-6 py-12 text-center text-white">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          আজই আপনার প্রস্তুতি শুরু করুন
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          ফ্রি অ্যাকাউন্ট খুলে ৭ দিন সব সুবিধা ব্যবহার করে দেখুন।
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-lg bg-white px-7 py-3 font-medium text-emerald-800 hover:bg-white/90"
        >
          ফ্রি অ্যাকাউন্ট খুলুন
        </Link>
      </div>
    </section>
  );
}