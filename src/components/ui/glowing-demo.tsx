"use client";

import { motion } from "framer-motion";
import { GlowingEffect } from "./glowing-effect";
import { Brain, Lock, LayoutDashboard, Send, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Job Matching",
    description: "Intelligent algorithms match candidates to the perfect roles based on skills, experience, and preferences.",
    colors: ["#ec4899", "#f472b6", "#db2777"],
    span: "md:col-span-2",
  },
  {
    icon: Lock,
    title: "Secure JWT Login",
    description: "Enterprise-grade authentication with encrypted tokens and session management.",
    colors: ["#3b82f6", "#60a5fa", "#2563eb"],
    span: "",
  },
  {
    icon: LayoutDashboard,
    title: "Recruiter Dashboard",
    description: "Comprehensive analytics and tools to manage candidates and job postings effortlessly.",
    colors: ["#8b5cf6", "#a78bfa", "#7c3aed"],
    span: "",
  },
  {
    icon: Send,
    title: "Smart Applications",
    description: "One-click applications with AI-optimized resume formatting and cover letters.",
    colors: ["#06b6d4", "#22d3ee", "#0891b2"],
    span: "",
  },
  {
    icon: TrendingUp,
    title: "Real-time Hiring Insights",
    description: "Live analytics on application status, market trends, and hiring velocity.",
    colors: ["#10b981", "#34d399", "#059669"],
    span: "md:col-span-2",
  },
];

export function GlowingDemo() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-accent/5 blur-[80px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Powerful Features</span>
            <span className="text-foreground"> Built for Scale</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Every tool you need to hire smarter and get hired faster — powered by cutting-edge AI.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={feature.span}
            >
              <div className="group relative h-full rounded-xl glass-card p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                <GlowingEffect
                  blur={12}
                  spread={15}
                  glow
                  borderWidth={1}
                  proximity={200}
                  inactiveZone={0.5}
                  colors={feature.colors}
                />
                <div className="relative z-10">
                  <div
                    className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${feature.colors[0]}20, ${feature.colors[1]}10)`,
                      border: `1px solid ${feature.colors[0]}30`,
                    }}
                  >
                    <feature.icon
                      className="w-6 h-6"
                      style={{ color: feature.colors[0] }}
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
