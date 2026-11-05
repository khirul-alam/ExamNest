// frontend/src/app/page.tsx
import { HeroSection } from "@/components/landing/HeroSection";
import { QuickAccessSection } from "@/components/landing/QuickAccessSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { LatestUpdatesSection } from "@/components/landing/LatestUpdatesSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickAccessSection />
      <FeaturesSection />
      <SubjectsSection />
      <PricingSection />
      <LatestUpdatesSection />
      <CtaSection />
    </>
  );
}