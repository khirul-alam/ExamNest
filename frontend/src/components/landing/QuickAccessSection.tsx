// frontend/src/components/landing/QuickAccessSection.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { quickAccessItems } from "@/lib/quick-access";

// Hero-র নিচের ছোট Quick Access Bar: নতুন ব্যবহারকারী এক ক্লিকে কাজ শুরু করতে পারেন
export function QuickAccessSection() {
  const { isLoggedIn, isReady } = useAuthPreview();

  return (
    // -mt: Hero-র নিচের অংশের ওপর সামান্য উঠে বসে
    <section className="relative z-10 -mt-8 px-4 sm:-mt-10">
      <h2 className="sr-only">দ্রুত শুরু করুন</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg sm:grid-cols-3 lg:grid-cols-5">
        {quickAccessItems.map((item, index) => {
          const Icon = item.icon;
          // লগইন ছাড়া ভিজিটরকে শুধু লগইন-লাগা আইটেমে তালা দেখানো হয়
          const showLock = isReady && !isLoggedIn && item.requiresLogin;

          return (
            <Link
              key={item.href}
              href={item.href}
              // মোবাইলে ৫ম আইটেম একা পড়লে পুরো প্রস্থ নেয়
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted ${
                index === quickAccessItems.length - 1 ? "max-sm:col-span-2" : ""
              }`}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}1a`, color: item.color }}
              >
                <Icon size={18} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <span className="truncate">{item.label}</span>
                  {showLock && (
                    <Lock
                      size={12}
                      className="shrink-0 text-muted-foreground"
                      aria-label="লগইন প্রয়োজন"
                    />
                  )}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.hint}
                </span>
              </span>

              <ArrowRight
                size={14}
                className="hidden shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:block"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}