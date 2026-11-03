// frontend/src/app/(auth)/corporate/register/page.tsx
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { CorporateRegisterForm } from "@/components/auth/CorporateRegisterForm";
import { CORPORATE_MIN_STUDENTS, corporateDurations } from "@/lib/pricing";

export const metadata: Metadata = { title: "কর্পোরেট অ্যাকাউন্ট" };

type Props = {
  searchParams: Promise<{ students?: string; months?: string }>;
};

export default async function CorporateRegisterPage({ searchParams }: Props) {
  const params = await searchParams;

  // Landing পেজ থেকে আসা মান যাচাই করে নেওয়া হয়; ভুল হলে ডিফল্ট মান
  const students = Math.max(
    Number(params.students) || CORPORATE_MIN_STUDENTS,
    CORPORATE_MIN_STUDENTS,
  );
  const monthsParam = Number(params.months);
  const months = corporateDurations.some((d) => d.months === monthsParam)
    ? monthsParam
    : 1;

  return (
    <AuthCard
      wide
      title="কর্পোরেট অ্যাকাউন্ট খুলুন"
      subtitle="কোচিং সেন্টার বা প্রতিষ্ঠানের নামে অ্যাকাউন্ট তৈরি করুন"
    >
      <CorporateRegisterForm defaultStudents={students} defaultMonths={months} />
    </AuthCard>
  );
}