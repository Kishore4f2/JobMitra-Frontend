"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface AccordionItem {
  id: number;
  number: string;
  title: string;
  content: string;
}

interface UniqueAccordionProps {
  items: AccordionItem[];
}

export function UniqueAccordion({ items }: UniqueAccordionProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = activeId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-xl border transition-colors duration-300"
            style={{
              borderColor: isOpen
                ? "hsl(var(--primary) / 0.3)"
                : "hsl(var(--border) / 0.5)",
              background: isOpen
                ? "hsl(var(--card) / 0.8)"
                : "transparent",
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center gap-4 p-5 text-left group"
            >
              {/* Animated circle with number */}
              <motion.div
                animate={{
                  scale: isOpen ? 1.15 : 1,
                  backgroundColor: isOpen
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <span
                  className="text-sm font-semibold transition-colors duration-300"
                  style={{
                    color: isOpen
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {item.number}
                </span>
              </motion.div>

              {/* Title with sliding motion */}
              <motion.span
                animate={{ x: isOpen ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex-1 text-base font-medium text-foreground"
              >
                {item.title}
              </motion.span>

              {/* Rotating plus icon */}
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </button>

            {/* Animated underline */}
            <div className="px-5">
              <motion.div
                animate={{
                  scaleX: isOpen ? 1 : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-px origin-left"
                style={{ background: "var(--gradient-primary)" }}
              />
            </div>

            {/* Expandable content with spring */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { type: "spring", stiffness: 200, damping: 25 },
                    opacity: { duration: 0.25, delay: 0.05 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-3 pl-[4.5rem]">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
