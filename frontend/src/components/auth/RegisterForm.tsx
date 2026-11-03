// frontend/src/components/auth/RegisterForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { FormField } from "./FormField";
import { PasswordStrength } from "./PasswordStrength";
import { SubmitButton } from "./SubmitButton";
import { useSimpleForm } from "@/lib/useSimpleForm";
import { registerSchema } from "@/lib/validation";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { values, errors, setValue, validate } = useSimpleForm(
    { name: "", email: "", password: "", confirmPassword: "", agree: false },
    registerSchema,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: Better Auth দিয়ে নিবন্ধন হবে; এখন শুধু যাচাই পেজে নেওয়া হচ্ছে
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        label="পুরো নাম"
        name="name"
        icon={User}
        placeholder="আপনার নাম"
        autoComplete="name"
        value={values.name}
        onChange={(v) => setValue("name", v)}
        error={errors.name}
      />
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
      <FormField
        label="পাসওয়ার্ড"
        name="password"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        autoComplete="new-password"
        value={values.password}
        onChange={(v) => setValue("password", v)}
        error={errors.password}
      />
      <PasswordStrength password={values.password} />
      <FormField
        label="পাসওয়ার্ড আবার লিখুন"
        name="confirmPassword"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(v) => setValue("confirmPassword", v)}
        error={errors.confirmPassword}
      />

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.agree}
            onChange={(e) => setValue("agree", e.target.checked)}
            className="mt-0.5 accent-[var(--primary)]"
          />
          <span>
            আমি{" "}
            <Link href="/terms" className="text-primary hover:underline">
              শর্তাবলি
            </Link>{" "}
            ও{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              প্রাইভেসি পলিসি
            </Link>{" "}
            মেনে নিচ্ছি
          </span>
        </label>
        {errors.agree && <p className="mt-1 text-xs text-red-500">{errors.agree}</p>}
      </div>

      <SubmitButton loading={loading}>অ্যাকাউন্ট খুলুন</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          লগইন করুন
        </Link>
      </p>
    </form>
  );
}