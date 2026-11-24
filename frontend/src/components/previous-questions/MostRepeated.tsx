// frontend/src/components/previous-questions/MostRepeated.tsx
import { toBanglaDigits } from "@/lib/format";
import { getFrequency, optionLabels } from "@/lib/mcq";
import { getQuestionSources, previousQuestions } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";

const MAX_ITEMS = 5;

// একাধিক পরীক্ষায় আসা প্রশ্ন, বেশি বার আসা আগে (শুধু হুবহু একই প্রশ্ন)
const repeated = previousQuestions
  .map((question) => ({ question, sources: getQuestionSources(question.id) }))
  .filter((item) => item.sources.length >= 2)
  .sort((a, b) => b.sources.length - a.sources.length)
  .slice(0, MAX_ITEMS);

export function MostRepeated() {
  if (repeated.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        এখনও কোনো প্রশ্ন একাধিক পরীক্ষায় পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {repeated.map(({ question, sources }) => {
          const frequency = getFrequency(sources.length);
          return (
            <li key={question.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-medium ${frequency.className}`}>
                  {frequency.emoji} {toBanglaNumber(sources.length)}টি পরীক্ষায় এসেছে
                </span>
              </div>
              <p className="mb-1 text-sm font-medium">{question.text}</p>
              <p className="mb-2 text-xs text-emerald-600 dark:text-emerald-400">
                উত্তর: {optionLabels[question.correctIndex]}. {question.options[question.correctIndex]}
              </p>
              <p className="text-xs text-muted-foreground">
                {sources
                  .map((s) => `${s.exam.organization} ${toBanglaDigits(s.exam.year)}`)
                  .join(" · ")}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        এখানে শুধু হুবহু একই প্রশ্ন দেখানো হয়। একই ধারণার ভিন্ন প্রশ্ন শনাক্ত করা Admin Panel ও পরের
        পর্যায়ে হবে।
      </p>
    </div>
  );
}