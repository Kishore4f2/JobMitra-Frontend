"use client";

import { motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  ShieldCheck,
  Send,
  Globe,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "AI Matching Engine",
    date: "Step 1",
    content:
      "Our AI engine analyzes skills, experience, and preferences to surface the most relevant job opportunities in real-time.",
    category: "Discovery",
    icon: Brain,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Recruiter Dashboard",
    date: "Step 2",
    content:
      "Powerful analytics and candidate management tools that streamline the entire hiring pipeline.",
    category: "Manage",
    icon: LayoutDashboard,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Secure JWT Auth",
    date: "Step 3",
    content:
      "Enterprise-level JWT authentication with encrypted data protection for every user and transaction.",
    category: "Security",
    icon: ShieldCheck,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Smart Applications",
    date: "Step 4",
    content:
      "One-click applications with AI-optimized resumes tailored to each job listing for maximum impact.",
    category: "Apply",
    icon: Send,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "Global Job Network",
    date: "Step 5",
    content:
      "Connect with job seekers and recruiters worldwide through a real-time global hiring network.",
    category: "Network",
    icon: Globe,
    relatedIds: [4, 1],
    status: "pending" as const,
    energy: 20,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <section id="timeline" className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />

      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Platform Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">How </span>
            <span className="gradient-text">JobMitra</span>
            <span className="text-foreground"> Works</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            An intelligent orbital workflow connecting every step of the hiring
            journey — from discovery to hire.
          </p>
        </motion.div>

        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  );
}
