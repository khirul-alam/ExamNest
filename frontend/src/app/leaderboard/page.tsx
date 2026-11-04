// frontend/src/app/leaderboard/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export const metadata: Metadata = { title: "লিডারবোর্ড" };

export default function LeaderboardPage() {
  return (
    <RequireLogin title="লিডারবোর্ড দেখতে লগইন করুন">
      <LeaderboardView />
    </RequireLogin>
  );
}