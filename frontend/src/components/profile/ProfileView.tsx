// frontend/src/components/profile/ProfileView.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CheckCircle2, Crown, Lock, Mail, User } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { demoAccount } from "@/lib/dashboard-data";
import { examTypes } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { changePasswordSchema, profileSchema } from "@/lib/profile-validation";
import { useSimpleForm } from "@/lib/useSimpleForm";

export function ProfileView() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [changing, setChanging] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const profile = useSimpleForm(
    {
      name: demoAccount.name,
      phone: "",
      institution: "",
      targetExam: "",
      showOnLeaderboard: true,
    },
    profileSchema,
  );

  const password = useSimpleForm(
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    changePasswordSchema,
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    if (!profile.validate()) return;
    setSaving(true);
    // TODO: ব্যাকএন্ড তৈরি হলে এখানে প্রোফাইল হালনাগাদের API কল হবে
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChanged(false);
    if (!password.validate()) return;
    setChanging(true);
    // TODO: Better Auth দিয়ে পাসওয়ার্ড পরিবর্তন হবে
    setTimeout(() => {
      setChanging(false);
      setPasswordChanged(true);
      password.setValue("currentPassword", "");
      password.setValue("newPassword", "");
      password.setValue("confirmPassword", "");
    }, 500);
  };

  const trialPercent = Math.round(
    (demoAccount.trialDaysLeft / demoAccount.trialDaysTotal) * 100,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">প্রোফাইল</h1>
        <p className="text-sm text-muted-foreground">আপনার ব্যক্তিগত তথ্য ও নিরাপত্তা</p>
        <p className="mt-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          ব্যাকএন্ড যুক্ত হওয়ার আগে পরিবর্তনগুলো আসলে সংরক্ষিত হয় না, শুধু ফর্ম যাচাই দেখা যায়।
        </p>
      </div>

      {/* সাবস্ক্রিপশন */}
      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">সাবস্ক্রিপশন</h2>
            <p className="text-sm text-muted-foreground">
              বর্তমান প্ল্যান: <strong className="text-foreground">{demoAccount.planName}</strong> · আর{" "}
              {toBanglaNumber(demoAccount.trialDaysLeft)} দিন বাকি
            </p>
          </div>
          <Link
            href="/#pricing"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            <Crown size={15} /> প্রিমিয়াম নিন
          </Link>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${trialPercent}%` }} />
        </div>
      </section>

      {/* ব্যক্তিগত তথ্য */}
      <form
        onSubmit={handleProfileSubmit}
        noValidate
        className="mb-6 space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-semibold">ব্যক্তিগত তথ্য</h2>

        <FormField
          label="পুরো নাম"
          name="name"
          icon={User}
          autoComplete="name"
          value={profile.values.name}
          onChange={(v) => profile.setValue("name", v)}
          error={profile.errors.name}
        />

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium">
            ইমেইল
          </label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="email"
              value={demoAccount.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-border bg-muted py-2.5 pl-9 pr-3 text-sm text-muted-foreground"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">ইমেইল পরিবর্তন করা যায় না</p>
        </div>

        <FormField
          label="মোবাইল নম্বর (ঐচ্ছিক)"
          name="phone"
          type="tel"
          placeholder="017XXXXXXXX"
          autoComplete="tel"
          value={profile.values.phone}
          onChange={(v) => profile.setValue("phone", v)}
          error={profile.errors.phone}
        />

        <FormField
          label="প্রতিষ্ঠান (ঐচ্ছিক)"
          name="institution"
          icon={Building2}
          placeholder="যেমন: কোচিং সেন্টার বা বিশ্ববিদ্যালয়"
          value={profile.values.institution}
          onChange={(v) => profile.setValue("institution", v)}
          error={profile.errors.institution}
        />

        <div>
          <label htmlFor="targetExam" className="mb-1.5 block text-xs font-medium">
            লক্ষ্য পরীক্ষা
          </label>
          <select
            id="targetExam"
            value={profile.values.targetExam}
            onChange={(e) => profile.setValue("targetExam", e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">বেছে নিন</option>
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value="অন্যান্য">অন্যান্য</option>
          </select>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.values.showOnLeaderboard}
            onChange={(e) => profile.setValue("showOnLeaderboard", e.target.checked)}
            className="mt-0.5 accent-[var(--primary)]"
          />
          <span>
            লিডারবোর্ডে আমার নাম দেখাও
            <span className="block text-xs text-muted-foreground">
              বন্ধ করলে আপনার নাম অন্যদের কাছে গোপন থাকবে।
            </span>
          </span>
        </label>

        {saved && (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 size={15} /> তথ্য যাচাই সফল (ডেমো: এখনও সংরক্ষিত হয়নি)
          </p>
        )}
        <SubmitButton loading={saving}>তথ্য সংরক্ষণ করুন</SubmitButton>
      </form>

      {/* পাসওয়ার্ড পরিবর্তন */}
      <form
        onSubmit={handlePasswordSubmit}
        noValidate
        className="space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-semibold">পাসওয়ার্ড পরিবর্তন</h2>

        <FormField
          label="বর্তমান পাসওয়ার্ড"
          name="currentPassword"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          value={password.values.currentPassword}
          onChange={(v) => password.setValue("currentPassword", v)}
          error={password.errors.currentPassword}
        />
        <FormField
          label="নতুন পাসওয়ার্ড"
          name="newPassword"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          value={password.values.newPassword}
          onChange={(v) => password.setValue("newPassword", v)}
          error={password.errors.newPassword}
        />
        <PasswordStrength password={password.values.newPassword} />
        <FormField
          label="নতুন পাসওয়ার্ড আবার লিখুন"
          name="confirmPassword"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          value={password.values.confirmPassword}
          onChange={(v) => password.setValue("confirmPassword", v)}
          error={password.errors.confirmPassword}
        />

        {passwordChanged && (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 size={15} /> যাচাই সফল (ডেমো: পাসওয়ার্ড আসলে বদলায়নি)
          </p>
        )}
        <SubmitButton loading={changing}>পাসওয়ার্ড বদলান</SubmitButton>
      </form>
    </div>
  );
}