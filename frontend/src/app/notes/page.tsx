// frontend/src/app/notes/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { NotesManager } from "@/components/notes/NotesManager";

export const metadata: Metadata = { title: "আমার নোট" };

export default function NotesPage() {
  return (
    <RequireLogin title="নোট দেখতে লগইন করুন">
      <NotesManager />
    </RequireLogin>
  );
}
