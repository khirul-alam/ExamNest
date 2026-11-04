// frontend/src/components/static/LegalDocument.tsx
import { formatBanglaDate } from "@/lib/format";
import type { LegalSection } from "@/lib/legal-content";
import { toBanglaNumber } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";

type Props = {
  sections: LegalSection[];
};

// আইনি পেজের বিভাগগুলো ক্রমিক নম্বরসহ দেখায়
export function LegalDocument({ sections }: Props) {
  return (
    <div>
      {siteConfig.showDraftNotice && (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
          এটি একটি খসড়া। সাইট চালুর আগে আইনজীবীর পরামর্শ নিয়ে চূড়ান্ত করা হবে।
        </p>
      )}
      <p className="mb-8 font-mono text-xs text-muted-foreground">
        সর্বশেষ হালনাগাদ: {formatBanglaDate(siteConfig.legalLastUpdated)}
      </p>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className="mb-3 font-display text-lg font-bold">
              {toBanglaNumber(index + 1)}. {section.heading}
            </h2>
            {section.paragraphs?.map((text) => (
              <p key={text} className="mb-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            ))}
            {section.items && (
              <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}