// frontend/src/components/layout/Footer.tsx
import Link from "next/link";

// ফুটারের লিংকের তালিকা
const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-display text-lg font-bold text-primary">
            ExamNest
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            বাংলাদেশের স্মার্ট BCS ও চাকরি প্রস্তুতি প্ল্যাটফর্ম
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {footerLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ExamNest. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}