// frontend/src/components/auth/ForgotPasswordForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck, Mail } from "lucide-react";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { useSimpleForm } from "@/lib/useSimpleForm";
import { forgotPasswordSchema } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { values, errors, setValue, validate } = useSimpleForm(
    { email: "" },
    forgotPasswordSchema,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: ব্যাকএন্ডে পাসওয়ার্ড রিসেট লিংক পাঠানোর API কল হবে
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck size={40} className="mx-auto mb-3 text-primary" />
        {/* নিরাপত্তার জন্য ইমেইল নিবন্ধিত কিনা তা জানানো হয় না */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{values.email}</span>{" "}
          নিবন্ধিত হলে পাসওয়ার্ড রিসেট করার একটি লিংক পাঠানো হয়েছে। ইনবক্স ও
          স্প্যাম ফোল্ডার দেখুন।
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft size={14} /> লগইনে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        label="ইমেইল"
        name="email"
        type="email"
        icon={Mail}
        placeholder="example@email.com"
        autoComplete="email"
        value={values.email}
        onChange={(v) => setValue("email", v)}
        error={errors.email}
      />
      <SubmitButton loading={loading}>রিসেট লিংক পাঠান</SubmitButton>
      <p className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          লগইনে ফিরে যান
        </Link>
      </p>
    </form>
  );
}