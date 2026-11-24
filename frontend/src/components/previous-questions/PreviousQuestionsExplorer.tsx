// frontend/src/components/previous-questions/PreviousQuestionsExplorer.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { MostRepeated } from "./MostRepeated";
import { PyqBrowse } from "./PyqBrowse";
import { PyqExamBuilder } from "./PyqExamBuilder";
import { PyqExamList } from "./PyqExamList";
import { PyqFilters } from "./PyqFilters";
import { PyqReadMode } from "./PyqReadMode";
import { useQuestionProgress } from "./useQuestionProgress";
import { useStartSession } from "@/components/model-test/useStartSession";
import { ReportErrorModal } from "@/components/subjects/ReportErrorModal";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { estimateDurationMin, getQuestionHistory } from "@/lib/analytics";
import { sessionFromQuestionIds } from "@/lib/custom-test";
import { getQuestionById } from "@/lib/exam-data";
import {
  examTypes,
  getPyqExam,
  previousQuestions,
  pyqExams,
  type PyqExam,
} from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { buildSingleExamSession } from "@/lib/pyq-exam";
import {
  ALL,
  applyFilterChange,
  emptyFilters,
  getFilterOptions,
  getVisibleExams,
  getVisibleQuestionIds,
  type PyqFilterKey,
  type PyqFilters as PyqFilterState,
} from "@/lib/pyq-filters";
import { useAttempts } from "@/lib/useAttempts";

type Tab = "read" | "exam";

// ভুল প্রশ্ন নিয়ে পরীক্ষায় একবারে সর্বোচ্চ এতগুলো প্রশ্ন
const WRONG_PRACTICE_MAX = 20;

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

export function PreviousQuestionsExplorer() {
  const { isLoggedIn, isReady } = useAuthPreview();
  const { attempts } = useAttempts();
  const progress = useQuestionProgress();
  const startSession = useStartSession();

  const [filters, setFilters] = useState<PyqFilterState>(emptyFilters);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("read");
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  // লগইন করা থাকলেই পড়া, বুকমার্ক ও পরীক্ষা চলে
  const canAct = isReady && isLoggedIn;
  const showLock = isReady && !isLoggedIn;

  const options = useMemo(() => getFilterOptions(filters), [filters]);
  const exams = useMemo(() => getVisibleExams(filters), [filters]);
  const baseIds = useMemo(() => getVisibleQuestionIds(filters), [filters]);

  // সার্চ শব্দ প্রশ্ন, অপশন বা ব্যাখ্যায় মেলে কিনা
  const scopeIds = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return baseIds;
    return baseIds.filter((id) => {
      const question = getQuestionById(id);
      if (!question) return false;
      return [question.text, ...question.options, question.explanation]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [baseIds, search]);

  const wrongSet = useMemo(() => getQuestionHistory(attempts).wrong, [attempts]);
  const singleExam = filters.exam !== ALL ? (getPyqExam(filters.exam) ?? null) : null;

  const hasFilter = search !== "" || Object.values(filters).some((value) => value !== ALL);
  const organizationCount = examTypes.filter((org) =>
    pyqExams.some((exam) => exam.organization === org),
  ).length;
  const yearCount = new Set(pyqExams.map((exam) => exam.year)).size;

  const changeFilter = (key: PyqFilterKey, value: string) =>
    setFilters((prev) => applyFilterChange(prev, key, value));

  const scrollToModes = () =>
    document.getElementById("pyq-modes")?.scrollIntoView({ behavior: "smooth", block: "start" });

  // কোনো পরীক্ষার "প্রশ্ন পড়ুন" চাপলে সেই পরীক্ষা বেছে পড়ার মোডে যাওয়া
  const handleReadExam = (examId: string) => {
    setFilters((prev) => applyFilterChange(prev, "exam", examId));
    setTab("read");
    // ফিল্টার বসার পর স্ক্রল করার জন্য সামান্য অপেক্ষা
    setTimeout(scrollToModes, 50);
  };

  const handleTakeExam = (exam: PyqExam) => {
    const session = buildSingleExamSession(exam);
    if (session) startSession(session);
  };

  // ভুল করা প্রশ্ন নিয়ে অনুশীলন শুরু
  const handleTakeWrong = (ids: string[]) => {
    const picked = ids.slice(0, WRONG_PRACTICE_MAX);
    const session = sessionFromQuestionIds({
      title: "বিগত প্রশ্ন — ভুল করা প্রশ্ন",
      mode: "practice",
      durationMin: estimateDurationMin(picked.length),
      questionIds: picked,
    });
    if (session) startSession(session);
  };

  const overview = [
    { label: "স্বতন্ত্র প্রশ্ন", value: previousQuestions.length },
    { label: "পরীক্ষা", value: pyqExams.length },
    { label: "প্রতিষ্ঠান", value: organizationCount },
    { label: "বছর", value: yearCount },
  ];

  return (
    <div className="space-y-12">
      {/* ০১: প্রশ্নভান্ডারের সারাংশ */}
      <section>
        <SectionTitle number="০১" title="প্রশ্নভান্ডার" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {overview.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="font-mono text-2xl font-bold text-primary">{toBanglaNumber(item.value)}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          পরীক্ষার নাম, পদ, সাল এবং কোন প্রশ্ন কোন পরীক্ষায় এসেছে, সবই ডেমো। প্রশ্ন ও উত্তর সত্য
          তথ্যের, তবে এগুলো আসল প্রশ্নপত্রের উৎস নয়। আসল ডাটা Admin Panel থেকে আসবে।
        </p>
      </section>

      {/* ০২: খোঁজা ও ফিল্টার */}
      <section>
        <SectionTitle
          number="০২"
          title="খুঁজুন ও ফিল্টার করুন"
          subtitle="ফিল্টারগুলো পরস্পর-সংযুক্ত: একটি বাছলে বাকিগুলোর অপশন ছোট হয়ে আসে"
        />
        <PyqFilters
          filters={filters}
          options={options}
          search={search}
          hasFilter={hasFilter}
          examCount={exams.length}
          questionCount={scopeIds.length}
          onChange={changeFilter}
          onSearch={setSearch}
          onReset={() => {
            setFilters(emptyFilters);
            setSearch("");
          }}
        />
      </section>

      {/* ০৩: বছর ও প্রতিষ্ঠান অনুযায়ী */}
      <section>
        <SectionTitle number="০৩" title="বছর ও প্রতিষ্ঠান অনুযায়ী দেখুন" />
        <PyqBrowse
          selectedYear={filters.year}
          selectedOrganization={filters.organization}
          onPickYear={(year) => changeFilter("year", filters.year === year ? ALL : year)}
          onPickOrganization={(org) =>
            changeFilter("organization", filters.organization === org ? ALL : org)
          }
        />
      </section>

      {/* ০৪: পরীক্ষার তালিকা */}
      <section>
        <SectionTitle
          number="০৪"
          title="পরীক্ষা"
          subtitle="প্রতিটি পরীক্ষার নিজস্ব পরিচয়: একই প্রতিষ্ঠান ও বছরেও আলাদা পদের আলাদা পরীক্ষা"
        />
        <PyqExamList
          exams={exams}
          selectedExamId={filters.exam}
          canAct={canAct}
          showLock={showLock}
          readCount={(exam) => exam.questionIds.filter((id) => progress.isRead(id)).length}
          onRead={handleReadExam}
          onTake={handleTakeExam}
        />
      </section>

      {/* ০৫: পড়া ও পরীক্ষার মোড */}
      <section id="pyq-modes" className="scroll-mt-24">
        <SectionTitle number="০৫" title="পড়ুন অথবা পরীক্ষা দিন" />

        <div className="mb-5 flex gap-1 rounded-xl border border-border bg-muted p-1">
          {(
            [
              { id: "read", label: "পড়ার মোড" },
              { id: "exam", label: "পরীক্ষার মোড" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                tab === item.id ? "bg-card text-primary shadow" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {needLogin && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              <Lock size={14} /> এই সুবিধা পেতে লগইন করতে হবে।
            </span>
            <span className="flex gap-2">
              <Link href="/login" className="rounded-md border border-border bg-card px-3 py-1 font-medium">
                লগইন
              </Link>
              <Link href="/register" className="rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground">
                ফ্রি রেজিস্ট্রেশন
              </Link>
            </span>
          </div>
        )}

        {tab === "read" ? (
          <PyqReadMode
            ids={scopeIds}
            singleExam={singleExam}
            progress={progress}
            wrongSet={wrongSet}
            canAct={canAct}
            showLock={showLock}
            onNeedLogin={() => setNeedLogin(true)}
            onReport={setReportTarget}
            onTakeWrong={handleTakeWrong}
          />
        ) : (
          <PyqExamBuilder canAct={canAct} showLock={showLock} />
        )}
      </section>

      {/* ০৬: বারবার আসা প্রশ্ন */}
      <section>
        <SectionTitle
          number="০৬"
          title="বারবার আসা প্রশ্ন"
          subtitle="যে প্রশ্ন একাধিক পরীক্ষায় এসেছে"
        />
        <MostRepeated />
      </section>

      <ReportErrorModal
        open={reportTarget !== null}
        targetLabel={reportTarget ?? ""}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}