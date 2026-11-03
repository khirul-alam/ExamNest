// frontend/src/components/auth/PasswordStrength.tsx
import { CheckCircle2, Circle } from "lucide-react";
import { passwordRules } from "@/lib/validation";

// পাসওয়ার্ড লেখার সময় কোন নিয়ম পূরণ হলো তা দেখানো হয়
export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const passed = passwordRules.filter((rule) => rule.test(password)).length;
  const barColor =
    passed <= 2 ? "bg-red-500" : passed <= 4 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {passwordRules.map((rule, index) => (
          <div
            key={rule.id}
            className={`h-1 flex-1 rounded-full ${
              index < passed ? barColor : "bg-border"
            }`}
          />
        ))}
      </div>
      <ul className="grid gap-1 text-xs sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-1.5 ${
                ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {ok ? <CheckCircle2 size={12} /> : <Circle size={12} />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}