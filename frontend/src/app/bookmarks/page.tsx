// frontend/src/app/bookmarks/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { BookmarksView } from "@/components/bookmarks/BookmarksView";

export const metadata: Metadata = { title: "বুকমার্ক" };

type Props = {
  // /bookmarks?tab=questions হলে সরাসরি প্রশ্নের ট্যাব খোলে
  searchParams: Promise<{ tab?: string }>;
};

export default async function BookmarksPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab = tab === "questions" ? "questions" : "topics";

  return (
    <RequireLogin title="বুকমার্ক দেখতে লগইন করুন">
      {/* key: ট্যাব বদলের লিংকে গেলে কম্পোনেন্ট নতুন করে বসে */}
      <BookmarksView key={initialTab} initialTab={initialTab} />
    </RequireLogin>
  );
}