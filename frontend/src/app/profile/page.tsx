// frontend/src/app/profile/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = { title: "প্রোফাইল" };

export default function ProfilePage() {
  return (
    <RequireLogin title="প্রোফাইল দেখতে লগইন করুন">
      <ProfileView />
    </RequireLogin>
  );
}