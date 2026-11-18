// frontend/src/components/model-test/ModelTestHub.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Loader2, Lock } from "lucide-react";
import { CustomTestBuilder } from "./CustomTestBuilder";
import { OverallSummary } from "./OverallSummary";
import { RecentHistory } from "./RecentHistory";
import { RecommendedPractice } from "./RecommendedPractice";
import { StrongWeakSection } from "./StrongWeakSection";
import { SubjectAnalytics } from "./SubjectAnalytics";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import {
  computeSubjectStats,
  getOverview,
  getQuestionHistory,
  getRecommendations,
} from "@/lib/analytics";
import { allSubjects } from "@/lib/subjects-data";
import { useAttempts } from "@/lib/useAttempts";

// সেকশনের শিরোনাম (নম্বরসহ)
function SectionTitle({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-bold">
        <span className="mr-2 font-mono text-primary">{number}</span>
        {title}
      </h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function ModelTestHub() {
  const { isLoggedIn, isReady } = useAuthPreview();
  const { attempts, ready } = useAttempts();
  const studyProgress = useStudyProgress();

  const history = useMemo(() => getQuestionHistory(attempts), [attempts]);
  const overview = useMemo(() => getOverview(attempts), [attempts]);
  const subjectStats = useMemo(() => computeSubjectStats(attempts), [attempts]);
  const recommendations = useMemo(
    () => getRecommendations(subjectStats, history, attempts.length),
    [subjectStats, history, attempts.length],
  );
  // ইতিহাস নতুন থেকে পুরনো ক্রমে দেখানো হয়
  const recentFirst = useMemo(() => [...attempts].reverse(), [attempts]);

  // সব বিষয় মিলিয়ে প্রস্তুতির অগ্রগতি (সম্পন্ন টপিক ÷ মোট টপিক)
  const allTopics = allSubjects.flatMap((s) =>
    s.chapters.flatMap((c) => c.topics.map((t) => ({ subject: s.slug, topic: t.slug }))),
  );
  const prepTotal = allTopics.length;
  const prepDone = allTopics.filter((x) => studyProgress.isCompleted(x.subject, x.topic)).length;

  const showAnalytics = isReady && isLoggedIn && ready;
  const isGuest = isReady && !isLoggedIn;

  // লগইন ছাড়া ভিজিটর শুধু কাস্টম টেস্ট দেখেন, তাই সেটিই "০১" হয়
  const customNumber = showAnalytics ? "০৪" : "০১";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">মডেল টেস্ট</h1>
        <p className="text-sm text-muted-foreground">
          পরীক্ষা, প্রস্তুতি ও পারফরম্যান্স বিশ্লেষণ
        </p>
        <p className="mt-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          আপনার ফলাফল আপাতত এই ব্রাউজারে জমা থাকে এবং এখান থেকেই বিশ্লেষণ হয়। ব্যাকএন্ড যুক্ত হলে
          আপনার অ্যাকাউন্টে সংরক্ষিত হবে। প্রশ্ন-ভান্ডারের সংখ্যা এখন ডেমো।
        </p>
      </div>

      <div className="space-y-12">
        {/* লগইন করা ব্যবহারকারীর বিশ্লেষণ */}
        {!isReady || (isLoggedIn && !ready) ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : isGuest ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Lock size={28} className="mx-auto mb-2 text-primary" />
            <h2 className="mb-1 font-display text-lg font-bold">আপনার পারফরম্যান্স দেখতে লগইন করুন</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              লগইন করলে বিষয়ভিত্তিক অগ্রগতি, শক্তিশালী ও দুর্বল বিষয়, পরীক্ষার ইতিহাস এবং ব্যক্তিগত
              অনুশীলনের পরামর্শ এখানে দেখতে পাবেন।
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/login" className="rounded-lg border border-border px-5 py-2 text-sm font-medium">
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
              >
                ফ্রি রেজিস্ট্রেশন
              </Link>
            </div>
          </div>
        ) : null}

        {showAnalytics && (
          <>
            <section>
              <SectionTitle number="০১" title="সামগ্রিক পারফরম্যান্স" />
              <OverallSummary overview={overview} prepDone={prepDone} prepTotal={prepTotal} />
            </section>

            <section>
              <SectionTitle
                number="০২"
                title="বিষয়ভিত্তিক বিশ্লেষণ"
                subtitle="প্রতিটি বিষয়ের অগ্রগতি, MCQ পরিসংখ্যান, সফলতা ও Accuracy আলাদাভাবে"
              />
              <SubjectAnalytics stats={subjectStats} />
            </section>

            <section>
              <SectionTitle number="০৩" title="শক্তিশালী ও দুর্বল বিষয়" />
              <StrongWeakSection stats={subjectStats} />
            </section>
          </>
        )}

        {/* কাস্টম মডেল টেস্ট (সবার জন্য দৃশ্যমান, শুরু করতে লগইন লাগে) */}
        <section>
          <SectionTitle number={customNumber} title="কাস্টম মডেল টেস্ট" />
          <CustomTestBuilder history={history} isLoggedIn={isLoggedIn} isReady={isReady} />
        </section>

        {showAnalytics && (
          <>
            <section>
              <SectionTitle
                number="০৫"
                title="প্রস্তাবিত অনুশীলন"
                subtitle="আপনার ফলাফল দেখে নিয়মভিত্তিক পরামর্শ"
              />
              <RecommendedPractice items={recommendations} />
            </section>

            <section>
              <SectionTitle number="০৬" title="সাম্প্রতিক পরীক্ষা" />
              <RecentHistory attempts={recentFirst} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}