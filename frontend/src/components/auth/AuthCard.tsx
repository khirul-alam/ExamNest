// frontend/src/components/auth/AuthCard.tsx
import Link from "next/link";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
};

// সব Auth পেজের সাধারণ কার্ড (লোগো, শিরোনাম, কনটেন্ট)
export function AuthCard({ title, subtitle, children, wide = false }: AuthCardProps) {
  return (
    <div
      className={`mx-auto w-full rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8 ${
        wide ? "max-w-2xl" : "max-w-md"
      }`}
    >
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-800 font-display text-sm font-bold text-white"
        >
          EN
        </Link>
        <h1 className="font-display text-xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}