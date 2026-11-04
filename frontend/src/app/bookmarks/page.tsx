// frontend/src/app/bookmarks/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { BookmarksView } from "@/components/bookmarks/BookmarksView";

export const metadata: Metadata = { title: "বুকমার্ক" };

export default function BookmarksPage() {
  return (
    <RequireLogin title="বুকমার্ক দেখতে লগইন করুন">
      <BookmarksView />
    </RequireLogin>
  );
}