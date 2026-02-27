"use client";

import { SplineScene } from "./splite";
import { Card, CardContent } from "./card";
import { Spotlight } from "./spotlight";
import { motion } from "framer-motion";

export function SplineDemo() {
  return (
    <section id="robo" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="w-full border-0 overflow-hidden" style={{ background: "var(--gradient-card)" }}>
            <Spotlight className="rounded-xl" fill="hsl(217, 91%, 60%, 0.15)">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {/* Left content */}
                  <div className="flex flex-col justify-center p-8 md:p-12 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Smart Hiring Platform
                      </span>

                      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                        <span className="text-foreground">JobMitra — </span>
                        <span className="gradient-text">Intelligent Hiring</span>
                        <br />
                        <span className="text-foreground">Starts Here</span>
                      </h2>

                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
                        Smart hiring platform for job seekers and recruiters.
                        Discover smarter matches, streamlined workflows, and faster results.
                      </p>
                    </motion.div>
                  </div>

                  {/* Right robot */}
                  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Spotlight>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default {
  SplineDemo,
};
