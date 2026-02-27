"use client";

import { motion } from "framer-motion";
import {
  BentoGrid,
  BentoCard,
  TypeTester,
  LayoutAnimation,
  GlobalNetwork,
  SpeedIndicator,
  MobileReady,
} from "@/components/ui/bento-grid";

const features = [
  {
    title: "AI Job Matching",
    description:
      "Intelligent AI recommends the most relevant opportunities instantly.",
    animatedContent: <TypeTester />,
  },
  {
    title: "Recruiter Dashboard",
    description:
      "Manage candidates, jobs, and hiring workflows in one place.",
    animatedContent: <LayoutAnimation />,
  },
  {
    title: "Global Talent Network",
    description:
      "Connect job seekers and recruiters worldwide with real-time hiring.",
    animatedContent: <GlobalNetwork />,
  },
  {
    title: "Fast Applications",
    description:
      "Apply to jobs instantly with optimized secure workflows.",
    animatedContent: <SpeedIndicator />,
  },
  {
    title: "Mobile Friendly",
    description:
      "Fully responsive experience across mobile, tablet, and desktop.",
    animatedContent: <MobileReady />,
  },
];

export function BentoDemo() {
  return (
    <section id="why-us" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Platform Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="gradient-text">JobMitra</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Everything you need for modern hiring — powered by AI, secured by
            design, and built for scale.
          </p>
        </motion.div>

        {/* Row 1: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
          {features.slice(0, 2).map((feature, i) => (
            <BentoCard
              key={feature.title}
              index={i}
              title={feature.title}
              description={feature.description}
              animatedContent={feature.animatedContent}
            />
          ))}
        </div>
        {/* Row 2: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.slice(2).map((feature, i) => (
            <BentoCard
              key={feature.title}
              index={i + 2}
              title={feature.title}
              description={feature.description}
              animatedContent={feature.animatedContent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
