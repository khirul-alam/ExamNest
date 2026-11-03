// frontend/src/components/auth/CorporateRegisterForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Lock, Mail, Phone, User, Users } from "lucide-react";
import { FormField } from "./FormField";
import { PasswordStrength } from "./PasswordStrength";
import { SubmitButton } from "./SubmitButton";
import { useSimpleForm } from "@/lib/useSimpleForm";
import { corporateRegisterSchema } from "@/lib/validation";
import {
  CORPORATE_MIN_STUDENTS,
  CORPORATE_PRICE_PER_STUDENT,
  calcCorporateTotal,
  corporateDurations,
  formatTaka,
  toBanglaNumber,
} from "@/lib/pricing";

const institutionTypes = [
  "কোচিং সেন্টার",
  "স্কুল / কলেজ",
  "প্রশিক্ষণ প্রতিষ্ঠান",
  "অন্যান্য",
];

type Props = {
  defaultStudents: number;
  defaultMonths: number;
};

export function CorporateRegisterForm({ defaultStudents, defaultMonths }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { values, errors, setValue, validate } = useSimpleForm(
    {
      institutionName: "",
      institutionType: "",
      contactName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      students: String(defaultStudents),
      months: String(defaultMonths),
      agree: false,
    },
    corporateRegisterSchema,
  );

  const students = Number(values.students) || 0;
  const months = Number(values.months) || 1;
  const total = calcCorporateTotal(students, months);
  const validCount = students >= CORPORATE_MIN_STUDENTS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: ব্যাকএন্ডে প্রতিষ্ঠানের অ্যাকাউন্ট ও পেমেন্ট অনুরোধ তৈরি হবে
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    }, 600);
  };

  const selectClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-muted px-3 py-2.5 text-sm outline-none focus:border-primary ${
      hasError ? "border-red-500" : "border-border"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* প্রতিষ্ঠানের তথ্য */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold">প্রতিষ্ঠানের তথ্য</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="প্রতিষ্ঠানের নাম"
            name="institutionName"
            icon={Building2}
            placeholder="যেমন: ABC কোচিং সেন্টার"
            value={values.institutionName}
            onChange={(v) => setValue("institutionName", v)}
            error={errors.institutionName}
          />
          <div>
            <label htmlFor="institutionType" className="mb-1.5 block text-xs font-medium">
              প্রতিষ্ঠানের ধরন
            </label>
            <select
              id="institutionType"
              value={values.institutionType}
              onChange={(e) => setValue("institutionType", e.target.value)}
              className={selectClass(Boolean(errors.institutionType))}
            >
              <option value="">বেছে নিন</option>
              {institutionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.institutionType && (
              <p className="mt-1 text-xs text-red-500">{errors.institutionType}</p>
            )}
          </div>
          <FormField
            label="যোগাযোগকারী ব্যক্তির নাম"
            name="contactName"
            icon={User}
            value={values.contactName}
            onChange={(v) => setValue("contactName", v)}
            error={errors.contactName}
          />
          <FormField
            label="মোবাইল নম্বর"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="017XXXXXXXX"
            value={values.phone}
            onChange={(v) => setValue("phone", v)}
            error={errors.phone}
          />
        </div>
      </fieldset>

      {/* লগইনের তথ্য */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold">লগইনের তথ্য</legend>
        <FormField
          label="ইমেইল"
          name="email"
          type="email"
          icon={Mail}
          placeholder="institution@email.com"
          autoComplete="email"
          value={values.email}
          onChange={(v) => setValue("email", v)}
          error={errors.email}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="পাসওয়ার্ড"
            name="password"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            value={values.password}
            onChange={(v) => setValue("password", v)}
            error={errors.password}
          />
          <FormField
            label="পাসওয়ার্ড আবার লিখুন"
            name="confirmPassword"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(v) => setValue("confirmPassword", v)}
            error={errors.confirmPassword}
          />
        </div>
        <PasswordStrength password={values.password} />
      </fieldset>

      {/* সাবস্ক্রিপশন */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold">সাবস্ক্রিপশন</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="শিক্ষার্থীর সংখ্যা"
            name="students"
            type="number"
            icon={Users}
            value={values.students}
            onChange={(v) => setValue("students", v)}
            error={errors.students}
            hint={`ন্যূনতম ${toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন`}
          />
          <div>
            <label htmlFor="months" className="mb-1.5 block text-xs font-medium">
              মেয়াদ
            </label>
            <select
              id="months"
              value={values.months}
              onChange={(e) => setValue("months", e.target.value)}
              className={selectClass(false)}
            >
              {corporateDurations.map((d) => (
                <option key={d.months} value={d.months}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-muted p-4">
          <div className="text-sm text-muted-foreground">
            {toBanglaNumber(students)} জন × {toBanglaNumber(months)} মাস ×{" "}
            {formatTaka(CORPORATE_PRICE_PER_STUDENT)}
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-sm font-medium">মোট</span>
            <span className="font-display text-2xl font-bold text-primary">
              {validCount ? formatTaka(total) : "—"}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          অ্যাকাউন্ট খোলার পর ড্যাশবোর্ড থেকে ইমেইল, CSV ফাইল বা মোবাইল নম্বর
          দিয়ে শিক্ষার্থী যুক্ত করতে পারবেন।
        </p>
      </fieldset>

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

      <SubmitButton loading={loading}>কর্পোরেট অ্যাকাউন্ট খুলুন</SubmitButton>
    </form>
  );
}