// frontend/src/app/dashboard/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "ড্যাশবোর্ড" };

export default function DashboardPage() {
  return (
    <RequireLogin title="ড্যাশবোর্ড দেখতে লগইন করুন">
      <DashboardView />
    </RequireLogin>
  );
}