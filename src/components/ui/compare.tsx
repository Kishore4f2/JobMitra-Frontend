"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  secondImageOverlay?: React.ReactNode;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  secondImageOverlay,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetPercentRef = useRef(initialSliderPercentage);
  const currentPercentRef = useRef(initialSliderPercentage);

  // Ultra-smooth lerp animation loop
  useEffect(() => {
    let running = true;
    const smoothFactor = 0.08; // Lower = smoother/slower follow

    const tick = () => {
      if (!running) return;
      const diff = targetPercentRef.current - currentPercentRef.current;
      if (Math.abs(diff) > 0.01) {
        currentPercentRef.current += diff * smoothFactor;
        setSliderXPercent(currentPercentRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Autoplay with smooth sine easing
  const autoplayRafRef = useRef<number | null>(null);
  const isMouseOverRef = useRef(false);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      // Sine wave for ultra-smooth back-and-forth
      const t = (elapsed % (autoplayDuration * 2)) / (autoplayDuration * 2);
      const percentage = (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2 * 100;
      targetPercentRef.current = percentage;
      autoplayRafRef.current = requestAnimationFrame(animate);
    };
    autoplayRafRef.current = requestAnimationFrame(animate);
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRafRef.current) {
      cancelAnimationFrame(autoplayRafRef.current);
      autoplayRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    isMouseOverRef.current = true;
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    isMouseOverRef.current = false;
    if (slideMode === "hover") {
      targetPercentRef.current = initialSliderPercentage;
    }
    if (slideMode === "drag") setIsDragging(false);
    startAutoplay();
  }

  const handleStart = useCallback(
    (_clientX: number) => {
      if (slideMode === "drag") setIsDragging(true);
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") setIsDragging(false);
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        targetPercentRef.current = Math.max(0, Math.min(100, percent));
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => { if (!autoplay) handleStart(e.touches[0].clientX); },
    [handleStart, autoplay]
  );
  const handleTouchEnd = useCallback(() => { if (!autoplay) handleEnd(); }, [handleEnd, autoplay]);
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => { if (!autoplay) handleMove(e.touches[0].clientX); },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("w-[400px] h-[400px] overflow-hidden select-none", className)}
      style={{ position: "relative", cursor: slideMode === "drag" ? "grab" : "col-resize" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Slider line */}
      <div
        className="h-full w-px absolute top-0 m-auto z-40 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-primary to-transparent will-change-transform"
        style={{ left: `${sliderXPercent}%` }}
      >
        <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent z-20" />
        <div className="w-36 h-full [mask-image:radial-gradient(100px_at_right,white,transparent)] absolute top-1/2 -translate-y-1/2 right-0 bg-gradient-to-l from-primary/10 via-transparent to-transparent z-20" />
        {showHandlebar && (
          <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-card border border-border shadow-md z-30 -right-2.5 absolute flex items-center justify-center">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* First image (clipped) */}
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        {firstImage ? (
          <div
            className={cn("absolute inset-0 z-20 rounded-2xl w-full h-full select-none overflow-hidden will-change-[clip-path]", firstImageClassName)}
            style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
          >
            <img
              alt="first comparison"
              src={firstImage}
              className={cn("absolute inset-0 z-20 rounded-2xl w-full h-full select-none object-cover", firstImageClassName)}
              draggable={false}
            />
          </div>
        ) : null}
      </div>

      {/* Second image (background) */}
      {secondImage ? (
        <img
          className={cn("absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none object-cover", secondImageClassname)}
          alt="second comparison"
          src={secondImage}
          draggable={false}
        />
      ) : null}
      {secondImageOverlay && (
        <div className="absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none pointer-events-none">
          {secondImageOverlay}
        </div>
      )}
    </div>
  );
};
