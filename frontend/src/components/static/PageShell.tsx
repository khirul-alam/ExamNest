// frontend/src/components/static/PageShell.tsx

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

// সব স্ট্যাটিক পেজের সাধারণ কাঠামো (শিরোনাম ও মাঝের কলাম)
export function PageShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </div>
  );
}