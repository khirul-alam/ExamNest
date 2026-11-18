// frontend/src/app/model-test/attempts/[id]/page.tsx
import type { Metadata } from "next";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { AttemptView } from "@/components/model-test/AttemptView";

export const metadata: Metadata = { title: "পরীক্ষার ফলাফল" };

type Props = { params: Promise<{ id: string }> };

export default async function AttemptPage({ params }: Props) {
  const { id } = await params;

  return (
    <RequireLogin title="ফলাফল দেখতে লগইন করুন">
      <AttemptView id={id} />
    </RequireLogin>
  );
}