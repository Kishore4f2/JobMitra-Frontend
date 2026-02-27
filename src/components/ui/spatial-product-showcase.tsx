'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    FileSearch,
    ChevronRight,
    Zap,
    BrainCircuit,
    Users,
    TrendingUp,
    BarChart3,
    CheckCircle,
    LucideIcon,
} from 'lucide-react';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'seeker' | 'recruiter';

export interface FeatureMetric {
    label: string;
    value: number;
    icon: LucideIcon;
}

export interface ProductData {
    id: ProductId;
    label: string;
    title: string;
    description: string;
    image: string;
    colors: {
        gradient: string;
        glowColor: string;
        barColor: string;
        textAccent: string;
        borderGlow: string;
    };
    stats: {
        tagline: string;
        successRate: number;
    };
    features: FeatureMetric[];
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
    seeker: {
        id: 'seeker',
        label: 'Job Seeker',
        title: 'Land Your Dream Job',
        description:
            'AI-powered resume analysis, ATS scoring, and smart job matching — all in one place. Get personalized insights to move faster in your career journey.',
        image: '/jobseeker-avatar.png',
        colors: {
            gradient: 'from-blue-600 to-indigo-900',
            glowColor: 'rgba(59,130,246,0.18)',
            barColor: 'hsl(217, 91%, 60%)',
            textAccent: 'text-blue-400',
            borderGlow: 'hsl(217, 91%, 60%, 0.35)',
        },
        stats: { tagline: 'Ready to Apply', successRate: 87 },
        features: [
            { label: 'ATS Match Score', value: 92, icon: FileSearch },
            { label: 'AI Career Insights', value: 88, icon: BrainCircuit },
            { label: 'Job Readiness', value: 85, icon: Zap },
        ],
    },
    recruiter: {
        id: 'recruiter',
        label: 'Recruiter',
        title: 'Hire the Right Talent',
        description:
            'Smart candidate screening, resume ranking, and interview pipeline management. Find the best candidates 10× faster with JobMitra\'s AI-driven recruitment tools.',
        image: '/recruiter-avatar.png',
        colors: {
            gradient: 'from-violet-600 to-purple-900',
            glowColor: 'rgba(139,92,246,0.18)',
            barColor: 'hsl(250, 80%, 65%)',
            textAccent: 'text-violet-400',
            borderGlow: 'hsl(250, 80%, 65%, 0.35)',
        },
        stats: { tagline: 'Hiring Active', successRate: 94 },
        features: [
            { label: 'Candidate Quality', value: 94, icon: Users },
            { label: 'Screening Speed', value: 97, icon: TrendingUp },
            { label: 'Pipeline Fill Rate', value: 91, icon: BarChart3 },
        ],
    },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    },
    item: {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
        exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
    },
    image: (isSeeker: boolean): Variants => ({
        initial: {
            opacity: 0,
            scale: 1.4,
            filter: 'blur(15px)',
            rotate: isSeeker ? -20 : 20,
            x: isSeeker ? -60 : 60,
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            rotate: 0,
            x: 0,
            transition: { type: 'spring', stiffness: 240, damping: 22 },
        },
        exit: {
            opacity: 0,
            scale: 0.7,
            filter: 'blur(20px)',
            transition: { duration: 0.25 },
        },
    }),
};

// =========================================
// CSS KEYFRAME INJECTION (once, at module level)
// =========================================
if (typeof document !== 'undefined') {
    const STYLE_ID = 'jm-avatar-keyframes';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
      @keyframes jmBreath {
        0%,100% { transform: scaleY(1)   scaleX(1); }
        50%       { transform: scaleY(1.012) scaleX(0.998); }
      }
      @keyframes jmFloat {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-10px); }
      }
      @keyframes jmSway {
        0%,100% { transform: rotateZ(0deg); }
        35%      { transform: rotateZ(-0.6deg); }
        70%      { transform: rotateZ(0.5deg); }
      }
      @keyframes jmTiltSeeker {
        0%,100% { transform: rotateX(0deg) rotateY(0deg); }
        25%      { transform: rotateX(1.5deg) rotateY(-1.5deg); }
        60%      { transform: rotateX(-1deg) rotateY(1deg); }
        80%      { transform: rotateX(2deg) rotateY(-0.5deg); }
      }
      @keyframes jmTiltRecruiter {
        0%,100% { transform: rotateX(0deg) rotateY(0deg); }
        30%      { transform: rotateX(-1deg) rotateY(1.2deg); }
        65%      { transform: rotateX(0.8deg) rotateY(-1deg); }
      }
      @keyframes jmGlowPulseBlue {
        0%,100% { box-shadow: 0 0 0 0 transparent, 0 0 32px 6px hsl(217 91% 60% / 0.22); }
        50%      { box-shadow: 0 0 0 0 transparent, 0 0 48px 14px hsl(217 91% 60% / 0.38); }
      }
      @keyframes jmGlowPulseViolet {
        0%,100% { box-shadow: 0 0 0 0 transparent, 0 0 32px 6px hsl(250 80% 65% / 0.22); }
        50%      { box-shadow: 0 0 0 0 transparent, 0 0 48px 14px hsl(250 80% 65% / 0.38); }
      }
      .jm-avatar-wrap {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        perspective: 600px;
      }
      .jm-avatar-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border-radius: 50%;
        pointer-events: none;
        user-select: none;
        will-change: transform;
        transition: transform 0.5s ease;
      }
      .jm-avatar-wrap:hover img {
        transform: scale(1.04) rotateY(-3deg) rotateX(2deg);
      }
      .jm-float  { animation: jmFloat 5s ease-in-out infinite; }
      .jm-sway   { animation: jmSway  7s ease-in-out infinite; }
      .jm-breath { animation: jmBreath 3.5s ease-in-out infinite; }
      .jm-tilt-seeker    { animation: jmTiltSeeker   8s ease-in-out infinite; }
      .jm-tilt-recruiter { animation: jmTiltRecruiter 9s ease-in-out infinite; }
      .jm-glow-blue   { animation: jmGlowPulseBlue   4s ease-in-out infinite; }
      .jm-glow-violet { animation: jmGlowPulseViolet 4s ease-in-out infinite; }
    `;
        document.head.appendChild(style);
    }
}

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ isSeeker }: { isSeeker: boolean }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.div
            animate={{
                background: isSeeker
                    ? 'radial-gradient(circle at 20% 50%, hsl(217 91% 60% / 0.12), transparent 55%)'
                    : 'radial-gradient(circle at 80% 50%, hsl(250 80% 65% / 0.12), transparent 55%)',
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
        />
    </div>
);

const ProductVisual = ({ data, isSeeker }: { data: ProductData; isSeeker: boolean }) => (
    <motion.div layout="position" className="relative group shrink-0">
        {/* Spinning outer ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-12%] rounded-full border border-dashed"
            style={{ borderColor: data.colors.borderGlow }}
        />
        {/* Inner glow blob */}
        <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-35`}
        />

        {/* Avatar container - layered CSS micro-animations */}
        <div
            className={`relative h-64 w-64 md:h-80 md:w-80 rounded-full border flex items-center justify-center overflow-hidden backdrop-blur-sm ${isSeeker ? 'jm-glow-blue' : 'jm-glow-violet'}`}
            style={{
                background: 'hsl(222 40% 8% / 0.7)',
                borderColor: data.colors.borderGlow,
            }}
        >
            {/* Layer 1 — float (translateY -10px over 5s) */}
            <div className="jm-avatar-wrap jm-float">
                {/* Layer 2 — gentle sway (rotateZ ±0.6deg over 7s) */}
                <div className="jm-avatar-wrap jm-sway">
                    {/* Layer 3 — breathing (scaleY ±1.2% over 3.5s) */}
                    <div className="jm-avatar-wrap jm-breath">
                        {/* Layer 4 — 3D head tilt (rotateX/Y small values, per-persona timing) */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={data.id}
                                variants={ANIMATIONS.image(isSeeker)}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className={`jm-avatar-wrap ${isSeeker ? 'jm-tilt-seeker' : 'jm-tilt-recruiter'}`}
                            >
                                <img
                                    src={data.image}
                                    alt={data.title}
                                    draggable={false}
                                    style={{
                                        filter: 'brightness(1.05) contrast(1.02) saturate(1.06)',
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>

        {/* Status pill */}
        <motion.div layout="position" className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div
                className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur"
                style={{
                    background: 'hsl(222 40% 8% / 0.85)',
                    borderColor: 'hsl(222 30% 20% / 0.5)',
                    color: 'hsl(215 20% 55%)',
                }}
            >
                <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: data.colors.barColor }}
                />
                {data.stats.tagline}
            </div>
        </motion.div>
    </motion.div>
);

const ProductDetails = ({ data, isSeeker }: { data: ProductData; isSeeker: boolean }) => {
    const alignClass = isSeeker ? 'items-start text-left' : 'items-end text-right';
    const flexDir = isSeeker ? 'flex-row' : 'flex-row-reverse';

    return (
        <motion.div
            variants={ANIMATIONS.container}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex flex-col ${alignClass}`}
        >
            {/* Badge */}
            <motion.span
                variants={ANIMATIONS.item}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-4 border"
                style={{
                    background: 'hsl(222 40% 8% / 0.6)',
                    borderColor: 'hsl(222 30% 20% / 0.5)',
                    color: 'hsl(215 20% 55%)',
                }}
            >
                <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: data.colors.barColor }}
                />
                {data.label} Platform
            </motion.span>

            {/* Heading */}
            <motion.h2
                variants={ANIMATIONS.item}
                className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #ffffff 0%, hsl(215 20% 65%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {data.title}
            </motion.h2>

            {/* Description */}
            <motion.p
                variants={ANIMATIONS.item}
                className={`text-sm leading-relaxed mb-7 max-w-sm ${isSeeker ? 'mr-auto' : 'ml-auto'}`}
                style={{ color: 'hsl(215 20% 55%)' }}
            >
                {data.description}
            </motion.p>

            {/* Metrics card */}
            <motion.div
                variants={ANIMATIONS.item}
                className="w-full space-y-5 p-5 rounded-2xl border backdrop-blur-sm"
                style={{
                    background: 'hsl(222 40% 8% / 0.5)',
                    borderColor: 'hsl(222 30% 18% / 0.6)',
                }}
            >
                {data.features.map((feature, idx) => (
                    <div key={feature.label}>
                        <div className={`flex items-center justify-between mb-2.5 text-sm ${flexDir}`}>
                            <div
                                className="flex items-center gap-2"
                                style={{ color: 'hsl(210 40% 82%)' }}
                            >
                                <feature.icon size={14} style={{ color: data.colors.barColor }} />
                                <span>{feature.label}</span>
                            </div>
                            <span className="font-mono text-xs" style={{ color: 'hsl(215 20% 45%)' }}>
                                {feature.value}%
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div
                            className="relative h-1.5 w-full rounded-full overflow-hidden"
                            style={{ background: 'hsl(222 30% 14%)' }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${feature.value}%` }}
                                transition={{ duration: 1.1, delay: 0.35 + idx * 0.12, ease: 'easeOut' }}
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ background: data.colors.barColor }}
                            />
                        </div>
                    </div>
                ))}

                <div className={`pt-3 flex ${isSeeker ? 'justify-start' : 'justify-end'}`}>
                    <button
                        type="button"
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors group"
                        style={{ color: 'hsl(210 40% 75%)' }}
                    >
                        <CheckCircle size={13} style={{ color: data.colors.barColor }} />
                        Explore Features
                        <ChevronRight
                            size={13}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </div>
            </motion.div>

            {/* Success rate */}
            <motion.div
                variants={ANIMATIONS.item}
                className={`mt-5 flex items-center gap-3 ${flexDir}`}
                style={{ color: 'hsl(215 20% 45%)' }}
            >
                <TrendingUp size={15} style={{ color: data.colors.barColor }} />
                <span className="text-sm font-medium">
                    {data.stats.successRate}% success rate on JobMitra
                </span>
            </motion.div>
        </motion.div>
    );
};

const Switcher = ({
    activeId,
    onToggle,
}: {
    activeId: ProductId;
    onToggle: (id: ProductId) => void;
}) => {
    const options = (Object.values(PRODUCT_DATA) as ProductData[]).map((p) => ({
        id: p.id,
        label: p.label,
        bar: p.colors.barColor,
    }));

    return (
        <div className="flex justify-center mt-14 z-10">
            <motion.div
                layout
                className="flex items-center gap-1 p-1.5 rounded-full border"
                style={{
                    background: 'hsl(222 40% 7% / 0.9)',
                    borderColor: 'hsl(222 30% 18% / 0.6)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {options.map((opt) => (
                    <motion.button
                        key={opt.id}
                        onClick={() => onToggle(opt.id)}
                        whileTap={{ scale: 0.96 }}
                        className="relative px-6 h-11 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-colors"
                    >
                        {activeId === opt.id && (
                            <motion.div
                                layoutId="jm-switcher-active"
                                className="absolute inset-0 rounded-full"
                                style={{ background: 'hsl(222 40% 12% / 0.9)' }}
                                transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                            />
                        )}
                        <span
                            className="relative z-10 transition-colors duration-300 flex items-center gap-2"
                            style={{
                                color: activeId === opt.id ? 'hsl(210 40% 93%)' : 'hsl(215 20% 45%)',
                            }}
                        >
                            {activeId === opt.id && (
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: opt.bar }}
                                />
                            )}
                            {opt.label}
                        </span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

// =========================================
// 4. MAIN EXPORT
// =========================================

export default function JobMitraShowcase() {
    const [activeId, setActiveId] = useState<ProductId>('seeker');
    const currentData = PRODUCT_DATA[activeId];
    const isSeeker = activeId === 'seeker';

    return (
        <section
            id="platform-showcase"
            className="relative py-16 lg:py-24 overflow-hidden"
            style={{ background: 'transparent' }}
        >
            {/* Section header */}
            <div className="container mx-auto max-w-7xl px-6 mb-14 text-center">
                <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs border mb-5"
                    style={{
                        background: 'hsl(222 40% 8% / 0.6)',
                        borderColor: 'hsl(222 30% 18% / 0.5)',
                        color: 'hsl(215 20% 55%)',
                    }}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Built for Everyone
                </span>
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: 'hsl(210 40% 93%)',
                    }}
                >
                    One Platform.{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(250,80%,65%))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Two Superpowers.
                    </span>
                </h2>
                <p
                    className="text-base max-w-xl mx-auto leading-relaxed"
                    style={{ color: 'hsl(215 20% 55%)' }}
                >
                    Whether you're searching for your dream job or building your dream team,
                    JobMitra gives you the AI advantage.
                </p>
            </div>

            {/* Main showcase */}
            <div className="container mx-auto max-w-7xl px-6">
                <div
                    className="relative rounded-3xl border p-8 md:p-12 overflow-hidden"
                    style={{
                        background: 'hsl(222 40% 7% / 0.6)',
                        borderColor: 'hsl(222 30% 15% / 0.5)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <BackgroundGradient isSeeker={isSeeker} />

                    <motion.div
                        layout
                        transition={{ type: 'spring', bounce: 0, duration: 0.85 }}
                        className={`relative z-10 flex flex-col md:flex-row items-center justify-center gap-14 md:gap-24 lg:gap-36 w-full ${isSeeker ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                    >
                        {/* Visual */}
                        <ProductVisual data={currentData} isSeeker={isSeeker} />

                        {/* Content */}
                        <motion.div layout="position" className="w-full max-w-md">
                            <AnimatePresence mode="wait">
                                <ProductDetails key={activeId} data={currentData} isSeeker={isSeeker} />
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                    {/* Tab switcher */}
                    <Switcher activeId={activeId} onToggle={setActiveId} />
                </div>
            </div>
        </section>
    );
}
