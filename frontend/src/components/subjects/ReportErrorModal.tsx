// frontend/src/components/subjects/ReportErrorModal.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ImagePlus, X } from "lucide-react";

const errorTypes = ["প্রশ্নে ভুল", "উত্তরে ভুল", "ব্যাখ্যায় ভুল", "বানান ভুল", "অন্যান্য"];
const MAX_SIZE_MB = 2;

type Props = {
  open: boolean;
  // কোন প্রশ্ন বা টপিকের বিষয়ে রিপোর্ট হচ্ছে তার সংক্ষিপ্ত বিবরণ
  targetLabel: string;
  onClose: () => void;
};

export function ReportErrorModal({ open, targetLabel, onClose }: Props) {
  const [type, setType] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Esc চাপলে বন্ধ হবে
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // সফল হলে কিছুক্ষণ পর নিজে বন্ধ হবে এবং ফর্ম খালি হবে
  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => {
      onClose();
      setSent(false);
      setType("");
      setComment("");
      setFile(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [sent, onClose]);

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      setError("শুধু ছবি (PNG/JPG/WebP) আপলোড করা যাবে");
      return;
    }
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`ছবির আকার ${MAX_SIZE_MB}MB-এর বেশি হতে পারবে না`);
      return;
    }
    setError("");
    setFile(picked);
  };

  const handleSubmit = () => {
    if (!type) {
      setError("ভুলের ধরন বেছে নিন");
      return;
    }
    // TODO: ব্যাকএন্ড তৈরি হলে এখানে রিপোর্ট ও স্ক্রিনশট পাঠানো হবে
    setError("");
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ভুল রিপোর্ট করুন"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-card p-5"
      >
        {sent ? (
          <div className="py-4 text-center">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-primary" />
            <p className="text-sm leading-relaxed">
              ধন্যবাদ। আপনার রিপোর্ট সফলভাবে জমা হয়েছে। আমরা বিষয়টি পর্যালোচনা
              করে দ্রুত প্রয়োজনীয় ব্যবস্থা গ্রহণ করব।
            </p>
          </div>
        ) : (
          <>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold">ভুল রিপোর্ট করুন</h3>
              <button onClick={onClose} aria-label="বন্ধ করুন">
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">{targetLabel}</p>

            <div className="mb-4 space-y-2">
              {errorTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setError("");
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="বিস্তারিত লিখুন..."
              className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
            />

            {/* স্ক্রিনশট আপলোড (ঐচ্ছিক) */}
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary/50">
              <ImagePlus size={16} />
              <span className="truncate">
                {file ? file.name : "স্ক্রিনশট যুক্ত করুন (ঐচ্ছিক)"}
              </span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              রিপোর্ট পাঠান
            </button>
          </>
        )}
      </div>
    </div>
  );
}