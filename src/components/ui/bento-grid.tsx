"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain,
  ShieldCheck,
  Shield,
  LayoutDashboard,
  Zap,
  Globe,
  Smartphone,
} from "lucide-react";

/* ─── Grid Shell ─── */

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Card Shell ─── */

interface BentoCardProps {
  title: string;
  description: string;
  animatedContent: ReactNode;
  className?: string;
  index?: number;
}

export function BentoCard({
  title,
  description,
  animatedContent,
  className,
  index = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-xl glass-card p-6 transition-all duration-300 overflow-hidden",
        "hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30",
        className
      )}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.08), transparent 70%)",
        }}
      />

      {/* Animated content area */}
      <div className="relative z-10 h-32 mb-4 rounded-lg flex items-center justify-center overflow-hidden border border-border/30" style={{ background: "var(--gradient-card)" }}>
        {animatedContent}
      </div>

      <div className="relative z-10">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   ANIMATED CARD INTERNALS
   ═══════════════════════════════════════════════ */

/* ─── 1. TypeTester — "Aa" scaling loop ─── */
export function TypeTester() {
  const [big, setBig] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBig((v) => !v), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div className="flex items-baseline gap-1">
        <motion.span
          animate={{ scale: big ? 1.5 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="font-display text-5xl font-bold text-primary"
        >
          A
        </motion.span>
        <motion.span
          animate={{ scale: big ? 1 : 1.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="font-display text-3xl font-bold text-primary/60"
        >
          a
        </motion.span>
      </motion.div>
      <Brain className="w-5 h-5 text-primary/40 ml-4" />
    </div>
  );
}

/* ─── 2. LayoutAnimation — Grid morph ─── */
export function LayoutAnimation() {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const id = setInterval(() => setCols((c) => (c === 2 ? 3 : 2)), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <LayoutGroup>
      <div
        className="grid gap-1.5 w-full h-full p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-md border border-border/40"
            style={{ background: "hsl(var(--primary) / 0.12)" }}
          />
        ))}
      </div>
      <LayoutDashboard className="absolute bottom-2 right-2 w-4 h-4 text-primary/30" />
    </LayoutGroup>
  );
}

/* ─── 3. GlobalNetwork — Pulse rings ─── */
export function GlobalNetwork() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Expanding pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/30"
          initial={{ width: 20, height: 20, opacity: 0.7 }}
          animate={{
            width: [20, 100],
            height: [20, 100],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
      <Globe className="w-8 h-8 text-primary relative z-10" />
    </div>
  );
}

/* ─── 4. SpeedIndicator — Skeleton → 100ms ─── */
export function SpeedIndicator() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loop = () => {
      setLoaded(false);
      const t = setTimeout(() => setLoaded(true), 1200);
      return t;
    };
    let t = loop();
    const id = setInterval(() => {
      t = loop();
    }, 3500);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3 px-6">
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-2"
          >
            <div className="h-3 rounded-full bg-muted animate-pulse w-full" />
            <div className="h-3 rounded-full bg-muted animate-pulse w-3/4" />
            <div className="h-3 rounded-full bg-muted animate-pulse w-1/2" />
          </motion.div>
        ) : (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-baseline gap-1">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-display text-3xl font-bold text-foreground">
                100
              </span>
              <span className="text-sm text-muted-foreground">ms</span>
            </div>
            <motion.div
              className="h-1.5 rounded-full w-24 origin-left"
              style={{ background: "var(--gradient-primary)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── 5. SecurityBadge — Sequential shield activation ─── */
export function SecurityBadge() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % 4),
      800
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 w-full h-full">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: active === i ? 1.3 : 1,
            opacity: active === i ? 1 : 0.3,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {active === i ? (
            <ShieldCheck className="w-7 h-7 text-primary" />
          ) : (
            <Shield className="w-6 h-6 text-muted-foreground" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── 6. MobileReady — Floating phone icon ─── */
export function MobileReady() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Smartphone className="w-10 h-10 text-primary" />
      </motion.div>
      <motion.div
        className="absolute w-20 h-20 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
