// frontend/src/app/(auth)/verify-email/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResendVerification } from "@/components/auth/ResendVerification";

export const metadata: Metadata = { title: "ইমেইল যাচাই করুন" };

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <AuthCard title="ইমেইল যাচাই করুন">
      <div className="text-center">
        <MailCheck size={44} className="mx-auto mb-3 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {email ? (
            <>
              <span className="font-medium text-foreground">{email}</span>{" "}
              ঠিকানায়
            </>
          ) : (
            "আপনার ইমেইলে"
          )}{" "}
          একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। লিংকটি ২৪ ঘণ্টা পর্যন্ত কার্যকর
          থাকবে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।
        </p>
        <div className="mt-5">
          <ResendVerification />
        </div>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          লগইন পেজে যান
        </Link>
      </div>
    </AuthCard>
  );
}