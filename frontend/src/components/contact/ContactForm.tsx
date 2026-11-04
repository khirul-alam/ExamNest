// frontend/src/components/contact/ContactForm.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, Mail, User } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import {
  CONTACT_MESSAGE_MAX,
  contactSchema,
  contactSubjects,
} from "@/lib/contact-validation";
import { toBanglaNumber } from "@/lib/pricing";
import { useSimpleForm } from "@/lib/useSimpleForm";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { values, errors, setValue, validate } = useSimpleForm(
    { name: "", email: "", subject: "", message: "" },
    contactSchema,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;
    setLoading(true);
    // TODO: ব্যাকএন্ড তৈরি হলে এখানে বার্তা পাঠানোর API কল হবে
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-border bg-card p-5"
    >
      <FormField
        label="আপনার নাম"
        name="name"
        icon={User}
        autoComplete="name"
        value={values.name}
        onChange={(v) => setValue("name", v)}
        error={errors.name}
      />
      <FormField
        label="ইমেইল"
        name="email"
        type="email"
        icon={Mail}
        placeholder="example@email.com"
        autoComplete="email"
        value={values.email}
        onChange={(v) => setValue("email", v)}
        error={errors.email}
      />

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-medium">
          বিষয়
        </label>
        <select
          id="subject"
          value={values.subject}
          onChange={(e) => setValue("subject", e.target.value)}
          aria-invalid={Boolean(errors.subject)}
          className={`w-full rounded-lg border bg-muted px-3 py-2.5 text-sm outline-none focus:border-primary ${
            errors.subject ? "border-red-500" : "border-border"
          }`}
        >
          <option value="">বেছে নিন</option>
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium">
          বার্তা
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValue("message", e.target.value)}
          maxLength={CONTACT_MESSAGE_MAX}
          aria-invalid={Boolean(errors.message)}
          className={`w-full resize-y rounded-lg border bg-muted px-3 py-2.5 text-sm outline-none focus:border-primary ${
            errors.message ? "border-red-500" : "border-border"
          }`}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          {errors.message ? (
            <p className="text-xs text-red-500">{errors.message}</p>
          ) : (
            <span />
          )}
          <span className="font-mono text-xs text-muted-foreground">
            {toBanglaNumber(values.message.length)}/{toBanglaNumber(CONTACT_MESSAGE_MAX)}
          </span>
        </div>
      </div>

      {sent && (
        <p className="flex items-start gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
          বার্তাটি যাচাই করা হয়েছে (ডেমো: এখনও পাঠানো হয়নি, ব্যাকএন্ড যুক্ত হলে সত্যিই পৌঁছাবে)।
        </p>
      )}

      <SubmitButton loading={loading}>বার্তা পাঠান</SubmitButton>
    </form>
  );
}