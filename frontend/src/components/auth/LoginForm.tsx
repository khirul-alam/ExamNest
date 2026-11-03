// frontend/src/components/auth/LoginForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyRound, Lock, Mail, Phone } from "lucide-react";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { useSimpleForm } from "@/lib/useSimpleForm";
import { loginSchema, otpSchema, phoneLoginSchema } from "@/lib/validation";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";

type Method = "email" | "phone";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthPreview();
  const [method, setMethod] = useState<Method>("email");
  const [loading, setLoading] = useState(false);

  // ইমেইল + পাসওয়ার্ড ফর্ম
  const emailForm = useSimpleForm({ email: "", password: "" }, loginSchema);

  // ফোন + OTP ফর্ম (দুই ধাপ: নম্বর দেওয়া, তারপর কোড)
  const phoneForm = useSimpleForm({ phone: "" }, phoneLoginSchema);
  const otpForm = useSimpleForm({ otp: "" }, otpSchema);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // OTP আবার পাঠানোর কাউন্টডাউন (৬০ সেকেন্ড)
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // সাময়িক: আসল লগইন Better Auth যুক্ত হলে এখানে বদলে যাবে
  const finishLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      router.push("/");
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.validate()) return;
    finishLogin();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForm.validate()) return;
    // TODO: ব্যাকএন্ডে OTP পাঠানোর API কল হবে
    setOtpSent(true);
    setCooldown(60);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpForm.validate()) return;
    finishLogin();
  };

  return (
    <div>
      {/* লগইন পদ্ধতি বাছাই */}
      <div className="mb-5 flex rounded-lg border border-border bg-muted p-1">
        {(
          [
            { id: "email", label: "ইমেইল", icon: Mail },
            { id: "phone", label: "ফোন + OTP", icon: Phone },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
              method === id
                ? "bg-card text-primary shadow"
                : "text-muted-foreground"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {method === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
          <FormField
            label="ইমেইল"
            name="email"
            type="email"
            icon={Mail}
            placeholder="example@email.com"
            autoComplete="email"
            value={emailForm.values.email}
            onChange={(v) => emailForm.setValue("email", v)}
            error={emailForm.errors.email}
          />
          <FormField
            label="পাসওয়ার্ড"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            value={emailForm.values.password}
            onChange={(v) => emailForm.setValue("password", v)}
            error={emailForm.errors.password}
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
          <SubmitButton loading={loading}>লগইন করুন</SubmitButton>
        </form>
      )}

      {method === "phone" && !otpSent && (
        <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
          <FormField
            label="মোবাইল নম্বর"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="017XXXXXXXX"
            autoComplete="tel"
            value={phoneForm.values.phone}
            onChange={(v) => phoneForm.setValue("phone", v)}
            error={phoneForm.errors.phone}
            hint="এই নম্বরে একটি ৬ সংখ্যার কোড পাঠানো হবে"
          />
          <SubmitButton>OTP পাঠান</SubmitButton>
        </form>
      )}

      {method === "phone" && otpSent && (
        <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono">{phoneForm.values.phone}</span> নম্বরে
            কোড পাঠানো হয়েছে।
          </p>
          <FormField
            label="OTP কোড"
            name="otp"
            icon={KeyRound}
            placeholder="______"
            autoComplete="one-time-code"
            value={otpForm.values.otp}
            onChange={(v) => otpForm.setValue("otp", v)}
            error={otpForm.errors.otp}
          />
          <SubmitButton loading={loading}>যাচাই করে লগইন করুন</SubmitButton>
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-muted-foreground hover:underline"
            >
              নম্বর বদলান
            </button>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => setCooldown(60)}
              className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0 ? `আবার পাঠান (${cooldown}s)` : "আবার পাঠান"}
            </button>
          </div>
        </form>
      )}

      {/* Google লগইন ভবিষ্যতের জন্য */}
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> অথবা{" "}
        <div className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-lg border border-border py-2.5 text-sm text-muted-foreground"
      >
        Google দিয়ে লগইন (শীঘ্রই আসছে)
      </button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        নতুন ব্যবহারকারী?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          রেজিস্ট্রেশন করুন
        </Link>
      </p>
    </div>
  );
}