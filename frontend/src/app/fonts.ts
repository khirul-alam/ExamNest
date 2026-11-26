// frontend/src/app/fonts.ts
import { Inter, JetBrains_Mono, Noto_Sans_Bengali, Roboto_Slab } from "next/font/google";

// বাংলা ও বাংলার পাশের ইংরেজি লেখার মূল ফন্ট।
// Noto Sans Bengali একটি ভেরিয়েবল ফন্ট, তাই এক ফাইলেই সব ওজন (হালকা থেকে মোটা) পাওয়া যায়।
export const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-noto-bengali",
  display: "swap",
});

// ইংরেজি টেক্সট ফন্ট
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// শিরোনামের ইংরেজি ফন্ট
export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

// সংখ্যা ও কোডের ফন্ট
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// html ট্যাগে বসানোর জন্য সব ফন্টের CSS ভেরিয়েবল-ক্লাস
export const fontVariableClasses = [notoBengali, inter, robotoSlab, jetbrains]
  .map((font) => font.variable)
  .join(" ");