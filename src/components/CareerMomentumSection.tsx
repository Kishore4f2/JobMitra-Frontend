import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, FileSearch, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";

const highlights = [
    { icon: FileSearch, text: "Smart resume insights" },
    { icon: BrainCircuit, text: "AI-powered career guidance" },
    { icon: Zap, text: "Faster job preparation" },
];

/* ─────────────────────────────────────────────────────────────
   Curated 3D-style running character Lottie animations.
   The loader tries each URL in order and uses the first that
   resolves successfully, giving us resilience against CDN issues.
   ───────────────────────────────────────────────────────────── */
const LOTTIE_SOURCES = [
    // 3D-style male runner - professional career theme
    "https://lottie.host/4a1f49e3-3c4d-4e5f-a2b1-7c8d9e0f1a2b/example.json",
    // Running man - semi-realistic
    "https://assets9.lottiefiles.com/packages/lf20_vu9b1tcy.json",
    // Dynamic runner used by career/fitness sites
    "https://assets10.lottiefiles.com/datafiles/HN7OcWNnoqje6iXIiZi9imMax1TzkFme6jdm6nfp/data.json",
    // Energetic running character
    "https://assets5.lottiefiles.com/packages/lf20_v1yudlrx.json",
    // Running person fallback
    "https://assets3.lottiefiles.com/packages/lf20_qm8eqzse.json",
];

async function fetchFirstValid(urls: string[]): Promise<object | null> {
    for (const url of urls) {
        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
            if (res.ok) {
                const data = await res.json();
                // Sanity-check: must have "v" field (Lottie format marker)
                if (data && data.v !== undefined) return data;
            }
        } catch {
            /* try next */
        }
    }
    return null;
}

const CareerMomentumSection = () => {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        fetchFirstValid(LOTTIE_SOURCES)
            .then((data) => {
                if (data) setAnimationData(data);
                else setFailed(true);
            });
    }, []);

    return (
        <section id="career-momentum" className="relative py-12 lg:py-20 overflow-hidden">
            {/* Background glow matching JobMitra theme */}
            <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Left Column — Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground w-max shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Career Momentum
                        </span>

                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
                            <span className="text-foreground">Run Towards Your </span>
                            <span className="gradient-text">Dream Job</span>
                        </h2>

                        <p className="text-lg font-medium text-foreground/90 text-balance">
                            Every opportunity starts with a single step. JobMitra helps you move faster.
                        </p>

                        <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
                            Your career journey is not about waiting — it's about momentum. Analyze your resume, improve your skills, and keep moving forward with confidence. Just like a runner chasing the finish line, your next opportunity is closer than you think.
                        </p>

                        <ul className="space-y-3 mt-2">
                            {highlights.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-sm font-medium text-foreground/80"
                                >
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-4">
                            <Button size="lg" className="rounded-full shadow-glow font-medium group">
                                Start Your Journey
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Column — 3D Running Student Character */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="runner-3d-realistic">
                            {/* Ambient glow ring under feet */}
                            <div className="runner-glow-floor" />

                            {animationData ? (
                                <Lottie
                                    animationData={animationData}
                                    loop
                                    autoplay
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : failed ? (
                                /* CSS 3D fallback when CDN unavailable */
                                <div className="r-scene">
                                    <div className="r-figure">
                                        <div className="r-head" />
                                        <div className="r-neck" />
                                        <div className="r-torso" />
                                        <div className="r-arm r-arm--left"><div className="r-forearm"><div className="r-hand" /></div></div>
                                        <div className="r-arm r-arm--right"><div className="r-forearm"><div className="r-hand" /></div></div>
                                        <div className="r-hips" />
                                        <div className="r-leg r-leg--left"><div className="r-shin"><div className="r-foot" /></div></div>
                                        <div className="r-leg r-leg--right"><div className="r-shin"><div className="r-foot" /></div></div>
                                    </div>
                                    <div className="r-ground-shadow" />
                                </div>
                            ) : (
                                /* Loading pulse */
                                <div className="runner-loading">
                                    <div className="runner-loading-pulse" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CareerMomentumSection;
