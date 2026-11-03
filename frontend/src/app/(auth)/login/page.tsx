// frontend/src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "লগইন" };

export default function LoginPage() {
  return (
    <AuthCard title="স্বাগতম ফিরে আসুন" subtitle="আপনার অ্যাকাউন্টে লগইন করুন">
      <LoginForm />
    </AuthCard>
  );
}