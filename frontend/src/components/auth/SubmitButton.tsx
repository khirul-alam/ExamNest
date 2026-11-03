// frontend/src/components/auth/SubmitButton.tsx
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
};

export function SubmitButton({ loading = false, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}