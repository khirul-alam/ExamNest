// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import {
  Hind_Siliguri,
  Inter,
  JetBrains_Mono,
  Roboto_Slab,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthPreviewProvider } from "@/components/providers/AuthPreviewProvider";
import { StudyProgressPreviewProvider } from "@/components/providers/StudyProgressPreviewProvider";
import { NoticeBar } from "@/components/layout/NoticeBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// বাংলা ফন্ট
const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

// ইংরেজি টেক্সট ফন্ট
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// শিরোনামের ফন্ট
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

// সংখ্যা ও কোডের ফন্ট
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ExamNest — বাংলাদেশের স্মার্ট BCS ও চাকরি প্রস্তুতি প্ল্যাটফর্ম",
    template: "%s | ExamNest",
  },
  description:
    "MCQ Practice, Model Test, Current Affairs, Previous Year Questions, Performance Analysis এবং Smart Learning System — সবকিছু এক জায়গায়।",
};

// পেজ লোডের আগেই সেভ করা থিম বসিয়ে দেওয়া হয়, যাতে স্ক্রিন ঝলকায় না
const themeScript = `
  try {
    var saved = localStorage.getItem("examnest-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${hind.variable} ${inter.variable} ${robotoSlab.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-bengali">
        <ThemeProvider>
          <AuthPreviewProvider>
            <StudyProgressPreviewProvider>
              <NoticeBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </StudyProgressPreviewProvider>
          </AuthPreviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
