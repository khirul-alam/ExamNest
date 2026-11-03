// frontend/src/components/auth/FormField.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: LucideIcon;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
};

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  autoComplete,
  hint,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        )}
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-muted py-2.5 text-sm outline-none transition-colors focus:border-primary ${
            Icon ? "pl-9" : "pl-3"
          } ${isPassword ? "pr-10" : "pr-3"} ${
            error ? "border-red-500" : "border-border"
          }`}
        />
        {/* পাসওয়ার্ড দেখা/লুকানোর বাটন */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}