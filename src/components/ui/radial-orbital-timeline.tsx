"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

const ROTATION_SPEED = 0.02;
const RADIUS = 200;

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  // Track active node position for card overlay
  const [activeNodePos, setActiveNodePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeElRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const angleRef = useRef(0);
  const autoRotateRef = useRef(true);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const total = timelineData.length;

  const baseAngles = useMemo(
    () => timelineData.map((_, i) => (i / total) * Math.PI * 2),
    [timelineData, total]
  );

  const relatedMap = useMemo(() => {
    const map: Record<number, number[]> = {};
    timelineData.forEach((item) => {
      map[item.id] = item.relatedIds;
    });
    return map;
  }, [timelineData]);

  const getRelatedItems = useCallback(
    (id: number) => relatedMap[id] ?? [],
    [relatedMap]
  );

  const updateNodePositions = useCallback(() => {
    const angle = angleRef.current;
    for (let i = 0; i < total; i++) {
      const item = timelineData[i];
      const el = nodeElRefs.current[item.id];
      if (!el) continue;

      const nodeAngle = baseAngles[i] + angle;
      const x = RADIUS * Math.cos(nodeAngle);
      const y = RADIUS * Math.sin(nodeAngle);
      const cosVal = Math.cos(nodeAngle);
      const sinVal = Math.sin(nodeAngle);
      const zIndex = Math.round(20 + 10 * cosVal);
      const opacity = Math.max(0.4, 0.4 + 0.6 * ((1 + sinVal) / 2));

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.zIndex = String(zIndex);
      el.style.opacity = String(opacity);
    }
  }, [baseAngles, timelineData, total]);

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (autoRotateRef.current) {
        angleRef.current =
          (angleRef.current + delta * ROTATION_SPEED * 360 * (Math.PI / 180)) %
          (Math.PI * 2);
      }

      updateNodePositions();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateNodePositions]);

  // Calculate the position of the active node relative to the container
  const computeActiveNodePosition = useCallback(
    (nodeId: number) => {
      const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
      if (nodeIndex === -1) return { x: 0, y: 0 };
      const nodeAngle = baseAngles[nodeIndex] + angleRef.current;
      const x = RADIUS * Math.cos(nodeAngle);
      const y = RADIUS * Math.sin(nodeAngle);
      return { x, y };
    },
    [baseAngles, timelineData]
  );

  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
      const targetAngle = baseAngles[nodeIndex];
      angleRef.current = (3 * Math.PI) / 2 - targetAngle;
      updateNodePositions();
      // Update position for the card overlay
      const pos = computeActiveNodePosition(nodeId);
      setActiveNodePos(pos);
    },
    [baseAngles, timelineData, updateNodePositions, computeActiveNodePosition]
  );

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      autoRotateRef.current = true;
    }
  }, []);

  const toggleItem = useCallback(
    (id: number) => {
      setExpandedItems((prev) => {
        const newState: Record<number, boolean> = {};
        const wasExpanded = prev[id];
        newState[id] = !wasExpanded;

        if (!wasExpanded) {
          setActiveNodeId(id);
          autoRotateRef.current = false;

          const related = getRelatedItems(id);
          const pulse: Record<number, boolean> = {};
          related.forEach((r) => (pulse[r] = true));
          setPulseEffect(pulse);
          centerViewOnNode(id);
        } else {
          setActiveNodeId(null);
          autoRotateRef.current = true;
          setPulseEffect({});
        }

        return newState;
      });
    },
    [centerViewOnNode, getRelatedItems]
  );

  const isRelatedToActive = useCallback(
    (itemId: number): boolean => {
      if (!activeNodeId) return false;
      return getRelatedItems(activeNodeId).includes(itemId);
    },
    [activeNodeId, getRelatedItems]
  );

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-primary-foreground bg-primary border-primary";
      case "in-progress":
        return "text-foreground bg-accent border-accent";
      case "pending":
        return "text-muted-foreground bg-muted border-border";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  // Find the active expanded item
  const activeItem = activeNodeId ? timelineData.find((item) => item.id === activeNodeId) : null;
  const isCardVisible = activeItem && expandedItems[activeItem.id];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center cursor-pointer"
      style={{ minHeight: "700px" }}
      onClick={handleContainerClick}
    >
      <div
        ref={orbitRef}
        className="relative"
        style={{
          width: "500px",
          height: "500px",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Central core — z-10 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
          style={{ zIndex: 10, opacity: activeNodeId ? 0.5 : 1 }}
        >
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center"
              style={{ background: "var(--gradient-card)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div
              className="absolute inset-[-60px] rounded-full border pointer-events-none transition-opacity duration-500"
              style={{ borderColor: "hsl(var(--border) / 0.3)", opacity: activeNodeId ? 0.15 : 1 }}
            />
            <div
              className="absolute inset-[-120px] rounded-full border pointer-events-none transition-opacity duration-500"
              style={{ borderColor: "hsl(var(--border) / 0.2)", opacity: activeNodeId ? 0.15 : 1 }}
            />
            <div
              className="absolute inset-[-180px] rounded-full border pointer-events-none transition-opacity duration-500"
              style={{ borderColor: "hsl(var(--border) / 0.1)", opacity: activeNodeId ? 0.15 : 1 }}
            />
          </div>
        </div>

        {/* Nodes — z-20 range */}
        {timelineData.map((item) => {
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;
          const isInactive = activeNodeId !== null && activeNodeId !== item.id && !isRelated;

          return (
            <div
              key={item.id}
              ref={(el) => (nodeElRefs.current[item.id] = el)}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                willChange: "transform, opacity",
                marginLeft: "-24px",
                marginTop: "-24px",
                zIndex: isExpanded ? 40 : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {(isPulsing || isRelated) && !isExpanded && (
                <div className="absolute inset-[-8px] rounded-full border-2 border-primary/50 animate-ping" />
              )}

              <div
                className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isExpanded
                    ? "scale-125 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : isRelated
                    ? "scale-110 border-accent"
                    : "border-border hover:border-primary/50 hover:scale-110"
                }`}
                style={{
                  background: "var(--gradient-card)",
                  opacity: isInactive ? 0.35 : 1,
                  transition: "opacity 0.5s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <Icon className="w-5 h-5 text-primary" />
              </div>

              <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-500"
                style={{ top: "56px", opacity: isInactive ? 0.35 : 1 }}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          EXPANDED CARD — Rendered OUTSIDE the orbit div
          as a separate overlay so it never gets clipped
          ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCardVisible && activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex items-center justify-center"
            style={{
              top: "50%",
              left: "50%",
              width: "400px",
              height: "400px",
              marginLeft: "-200px",
              marginTop: "-200px",
              zIndex: 50,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-xl border p-5 space-y-4 w-full max-w-sm"
              style={{
                background: "hsl(222, 47%, 4% / 0.95)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderColor: "hsl(215, 20%, 27%)",
                boxShadow:
                  "0 0 40px rgba(56, 189, 248, 0.12), 0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <Badge
                  className={getStatusStyles(activeItem.status)}
                  variant="outline"
                >
                  {activeItem.status === "completed"
                    ? "COMPLETE"
                    : activeItem.status === "in-progress"
                    ? "IN PROGRESS"
                    : "PENDING"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activeItem.date}
                </span>
              </div>

              <h3 className="text-base font-display font-semibold text-foreground">
                {activeItem.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeItem.content}
              </p>

              {/* Energy bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="w-3 h-3 text-primary" />
                    Energy Level
                  </span>
                  <span className="text-foreground font-medium">
                    {activeItem.energy}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeItem.energy}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  />
                </div>
              </div>

              {/* Connected nodes */}
              {activeItem.relatedIds.length > 0 && (
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: "hsl(215, 20%, 27% / 0.5)" }}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <Link className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Connected Nodes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.relatedIds.map((relatedId) => {
                      const relatedItem = timelineData.find(
                        (i) => i.id === relatedId
                      );
                      return (
                        <Button
                          key={relatedId}
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs glass-card hover:border-primary/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(relatedId);
                          }}
                        >
                          {relatedItem?.title}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
