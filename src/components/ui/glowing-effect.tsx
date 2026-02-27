"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
  colors?: string[];
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
    colors,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();

          const mouseX = e ? ("clientX" in e ? e.clientX : e.x) : lastPosition.current.x;
          const mouseY = e ? ("clientY" in e ? e.clientY : e.y) : lastPosition.current.y;

          lastPosition.current = { x: mouseX, y: mouseY };

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - center[0], 2) + Math.pow(mouseY - center[1], 2)
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          let intensity =
            1.0 -
            Math.min(
              Math.max(distanceFromCenter - inactiveRadius, 0) /
                (proximity === 0 ? Math.max(width, height) : proximity),
              1
            );

          intensity = Math.pow(intensity, 2);

          const maxMovement = spread;
          const rawX = mouseX - center[0];
          const rawY = mouseY - center[1];

          const maxDistance = Math.max(
            Math.sqrt(rawX * rawX + rawY * rawY),
            1
          );
          const limitedX = (rawX / maxDistance) * Math.min(maxDistance, maxMovement);
          const limitedY = (rawY / maxDistance) * Math.min(maxDistance, maxMovement);

          element.style.setProperty("--glow-x", `${limitedX}px`);
          element.style.setProperty("--glow-y", `${limitedY}px`);
          element.style.setProperty("--glow-intensity", `${intensity}`);
          element.style.setProperty("--glow-blur", `${blur}px`);
          element.style.setProperty("--glow-spread", `${spread}px`);
          element.style.setProperty("--glow-border-width", `${borderWidth}px`);
          element.style.setProperty("--glow-movement-duration", `${movementDuration}s`);
        });
      },
      [blur, inactiveZone, proximity, spread, movementDuration, borderWidth]
    );

    useEffect(() => {
      if (disabled) return;

      const handleMouseMove = (e: MouseEvent) => handleMove(e);
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [handleMove, disabled]);

    const defaultColors = variant === "white"
      ? ["#FFFFFF", "#E0E0E0", "#FFFFFF"]
      : colors || ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"];

    return (
      <div
        ref={containerRef}
        className={cn("pointer-events-none absolute -inset-px rounded-xl", className)}
      >
        <div
          className="absolute inset-0 rounded-[inherit] opacity-100 transition-opacity duration-500"
          style={{
            opacity: "var(--glow-intensity, 0)",
            background: `
              radial-gradient(
                300px circle at calc(50% + var(--glow-x, 0px)) calc(50% + var(--glow-y, 0px)),
                ${defaultColors[0]}33 0%,
                ${defaultColors[1]}1a 25%,
                ${defaultColors[2]}0d 50%,
                transparent 80%
              )
            `,
          }}
        />
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            opacity: "var(--glow-intensity, 0)",
            background: `
              radial-gradient(
                200px circle at calc(50% + var(--glow-x, 0px)) calc(50% + var(--glow-y, 0px)),
                ${defaultColors[0]}66 0%,
                transparent 70%
              )
            `,
            filter: `blur(${blur}px)`,
          }}
        />
        {glow && (
          <div
            className="absolute -inset-1 rounded-[inherit]"
            style={{
              opacity: "calc(var(--glow-intensity, 0) * 0.5)",
              background: `
                radial-gradient(
                  400px circle at calc(50% + var(--glow-x, 0px)) calc(50% + var(--glow-y, 0px)),
                  ${defaultColors[0]}26 0%,
                  ${defaultColors[1]}1a 30%,
                  transparent 70%
                )
              `,
              filter: `blur(${blur * 2}px)`,
            }}
          />
        )}
        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            opacity: "var(--glow-intensity, 0)",
            boxShadow: `inset 0 0 0 var(--glow-border-width, 1px) ${defaultColors[0]}40`,
          }}
        />
      </div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
