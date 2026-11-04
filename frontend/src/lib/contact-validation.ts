// frontend/src/lib/contact-validation.ts
import { z } from "zod";
import { emailSchema } from "@/lib/validation";

export const contactSubjects = [
  "সাধারণ প্রশ্ন",
  "প্রযুক্তিগত সমস্যা",
  "পেমেন্ট ও সাবস্ক্রিপশন",
  "কর্পোরেট অ্যাকাউন্ট",
  "কনটেন্টে ভুল",
  "অন্যান্য",
] as const;

export const CONTACT_MESSAGE_MAX = 1000;

export const contactSchema = z.object({
  name: z.string().min(2, "আপনার নাম লিখুন").max(60, "নাম ৬০ অক্ষরের বেশি হতে পারবে না"),
  email: emailSchema,
  subject: z
    .string()
    .min(1, "বিষয় বেছে নিন")
    .refine(
      (value) => (contactSubjects as readonly string[]).includes(value),
      "তালিকা থেকে একটি বিষয় বেছে নিন",
    ),
  message: z
    .string()
    .min(10, "কমপক্ষে ১০ অক্ষরের বার্তা লিখুন")
    .max(CONTACT_MESSAGE_MAX, "বার্তা ১০০০ অক্ষরের বেশি হতে পারবে না"),
});