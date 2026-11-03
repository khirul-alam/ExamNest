// frontend/src/app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "পাসওয়ার্ড ভুলে গেছেন" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="পাসওয়ার্ড ভুলে গেছেন?"
      subtitle="ইমেইল দিন, আমরা রিসেট লিংক পাঠাব"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}