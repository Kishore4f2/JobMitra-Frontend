import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import { SplineDemo } from "@/components/ui/demo";
import { RadialOrbitalTimelineDemo } from "@/components/ui/radial-orbital-timeline-demo";
import ResumeAnalyzerSection from "@/components/ResumeAnalyzerSection";
import JobMitraShowcase from "@/components/ui/spatial-product-showcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import { BentoDemo } from "@/components/ui/bento-demo";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/ui/modem-animated-footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MarqueeSection />
      <SplineDemo />
      <RadialOrbitalTimelineDemo />
      <ResumeAnalyzerSection />
      <JobMitraShowcase />
      <TestimonialsSection />
      <BentoDemo />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
