// frontend/src/app/(auth)/register/page.tsx
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { formatTaka, premiumPlans } from "@/lib/pricing";

export const metadata: Metadata = { title: "রেজিস্ট্রেশন" };

type Props = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { plan } = await searchParams;

  // ?plan=premium-3m এভাবে এলে নির্বাচিত প্ল্যান দেখানো হয়
  const selected = premiumPlans.find((p) => `premium-${p.id}` === plan);

  return (
    <AuthCard
      title="নতুন অ্যাকাউন্ট তৈরি করুন"
      subtitle="৭ দিনের ফ্রি অ্যাকাউন্ট দিয়ে শুরু করুন"
    >
      {selected && (
        <div className="mb-5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-center text-sm">
          নির্বাচিত প্ল্যান: <strong>প্রিমিয়াম {selected.label}</strong> (
          {formatTaka(selected.price)})
          <div className="mt-0.5 text-xs text-muted-foreground">
            অ্যাকাউন্ট খোলার পর পেমেন্ট সম্পন্ন করতে হবে
          </div>
        </div>
      )}
      <RegisterForm />
    </AuthCard>
  );
}