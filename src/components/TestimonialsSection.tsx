import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Users, TrendingUp, Award, X } from "lucide-react";
import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere";

// ─── Testimonial data (30 users) ───────────────────────────────────────────
const TESTIMONIALS: ImageData[] = [
    {
        id: "t1",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Arjun Mehta",
        title: "Arjun Mehta",
        role: "Software Engineer · Placed at TCS",
        rating: 5,
        description: "JobMitra's AI resume analyzer completely transformed my profile. My ATS score jumped from 42% to 91% in one session. Got 3 interview calls within a week!",
    },
    {
        id: "t2",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Priya Sharma",
        title: "Priya Sharma",
        role: "HR Manager · MNC Recruiter",
        rating: 5,
        description: "The recruiter dashboard is exceptional. I shortlisted 40 candidates in 2 hours instead of 2 days. The AI-ranked profiles are remarkably accurate.",
    },
    {
        id: "t3",
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Rahul Verma",
        title: "Rahul Verma",
        role: "MBA Fresher · Placed at Deloitte",
        rating: 5,
        description: "I was struggling for 6 months with zero callbacks. After JobMitra's resume overhaul and career guidance, I landed my dream job in 3 weeks. Pure game-changer.",
    },
    {
        id: "t4",
        src: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Sneha Pillai",
        title: "Sneha Pillai",
        role: "UI/UX Designer · Startup",
        rating: 5,
        description: "JobMitra told me exactly what recruiters want to see. The design-specific feedback on my portfolio and resume was incredibly detailed and spot-on.",
    },
    {
        id: "t5",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Karan Singh",
        title: "Karan Singh",
        role: "Data Analyst · Analytics Firm",
        rating: 5,
        description: "The skill gap analysis pointed out things I never noticed. Added 2 skills, restructured my bullets, and received an offer 10 days later. Absolutely love this platform.",
    },
    {
        id: "t6",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Ananya Krishnan",
        title: "Ananya Krishnan",
        role: "Content Strategist",
        rating: 4,
        description: "Finally a platform that gives real feedback, not generic tips. The AI understood my creative background and tailored suggestions specifically for content roles.",
    },
    {
        id: "t7",
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Mohammed Farhan",
        title: "Mohammed Farhan",
        role: "Civil Engineer · L&T",
        rating: 5,
        description: "Even for non-IT roles, JobMitra's resume scoring was brilliant. My application went from getting no responses to consistent recruiter calls. Highly recommend!",
    },
    {
        id: "t8",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Divya Nair",
        title: "Divya Nair",
        role: "Clinical Pharmacist",
        rating: 5,
        description: "JobMitra helped me understand how ATS filters actually work. Restructured my healthcare resume based on their AI feedback. Got into my dream hospital.",
    },
    {
        id: "t10",
        src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Vikram Reddy",
        title: "Vikram Reddy",
        role: "Full Stack Developer",
        rating: 5,
        description: "Clean, fast, and the most accurate AI feedback I've seen for tech resumes. Keywords, project framing, skill ordering — the analysis was laser precise.",
    },
    {
        id: "t11",
        src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Ritika Joshi",
        title: "Ritika Joshi",
        role: "Product Manager · SaaS",
        rating: 5,
        description: "I switched careers from engineering to product management. JobMitra's AI guided me on how to reframe my technical experience for PM roles. Invaluable!",
    },
    {
        id: "t12",
        src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Aditya Kumar",
        title: "Aditya Kumar",
        role: "Business Analyst · Wipro",
        rating: 4,
        description: "Job-matching is incredibly accurate. The platform matched me to roles I hadn't even thought of but were perfect for my skillset. Found my current job here.",
    },
    {
        id: "t13",
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Pooja Desai",
        title: "Pooja Desai",
        role: "Digital Marketing Lead",
        rating: 5,
        description: "The platform understands marketing metrics. It told me to quantify my campaigns and show ROAS figures. That small change got me 5 calls in one week.",
    },
    {
        id: "t15",
        src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Rohit Bansal",
        title: "Rohit Bansal",
        role: "Cybersecurity Analyst",
        rating: 5,
        description: "Niche field, but JobMitra's AI knew exactly what certifications and keywords matter for cybersecurity roles. Placed within 2 weeks of using the platform.",
    },
    {
        id: "t16",
        src: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Ishaan Malhotra",
        title: "Ishaan Malhotra",
        role: "Cloud Engineer · AWS",
        rating: 5,
        description: "The AI flagged missing cloud-specific keywords I overlooked. After applying the suggestions, I went from 0 responses to 4 interview invites in 5 days. Unreal!",
    },
    {
        id: "t17",
        src: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Gaurav Tiwari",
        title: "Gaurav Tiwari",
        role: "Mechanical Engineer",
        rating: 4,
        description: "Simple, clean, and effective. The resume scoring helped me see why my applications were getting filtered out. Fixed the issues and secured a great position.",
    },
    {
        id: "t18",
        src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Kavitha Rajan",
        title: "Kavitha Rajan",
        role: "Talent Acquisition · IT",
        rating: 5,
        description: "Using JobMitra from the recruiter side, the candidate ranking saves me enormous time. Profiles are well-curated. We've hired 15 people through this platform.",
    },
    {
        id: "t19",
        src: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Meera Chandran",
        title: "Meera Chandran",
        role: "Graphic Designer",
        rating: 5,
        description: "JobMitra helped me craft a resume for creative roles where presentation and skill articulation matter. The feedback was very different from generic tools. Loved it.",
    },
    {
        id: "t20",
        src: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Sameer Patel",
        title: "Sameer Patel",
        role: "Sales Manager · FMCG",
        rating: 5,
        description: "I never understood why my resume wasn't working until JobMitra showed me the data. Numbers-first approach for sales roles. Immediate improvement in responses.",
    },
    {
        id: "t22",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Abhishek Rao",
        title: "Abhishek Rao",
        role: "Machine Learning Engineer",
        rating: 5,
        description: "The AI scored my resume against actual ML job descriptions from FAANG companies. The targeted optimization was something I couldn't find anywhere else.",
    },
    {
        id: "t23",
        src: "https://images.unsplash.com/photo-1614289371518-722f2615943d?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Nisha Agarwal",
        title: "Nisha Agarwal",
        role: "HR Business Partner",
        rating: 4,
        description: "JobMitra helps me find candidates who genuinely match the JD. The quality of applicants has improved since we started posting here. Very satisfied.",
    },
    {
        id: "t24",
        src: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Deepak Srivastava",
        title: "Deepak Srivastava",
        role: "DevOps Engineer · Startups",
        rating: 5,
        description: "The platform understood startup culture and adjusted my resume recommendations accordingly. Got 6 calls from funded startups within 10 days. Excellent tool.",
    },
    {
        id: "t25",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Lakshmi Naik",
        title: "Lakshmi Naik",
        role: "Research Scientist",
        rating: 5,
        description: "Academia-to-industry transition is hard. JobMitra's AI reframed my research publications into impactful industry achievements. My confidence skyrocketed.",
    },
    {
        id: "t26",
        src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Yash Thosar",
        title: "Yash Thosar",
        role: "Software Developer · Infosys",
        rating: 4,
        description: "Being a fresher, I had no idea how to position my projects. JobMitra's detailed bullet-point rewriting showed me how to make projects sound impactful. Hired!",
    },
    {
        id: "t28",
        src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Ravi Shankar",
        title: "Ravi Shankar",
        role: "Java Backend Developer",
        rating: 5,
        description: "I specifically needed Java + microservices keywords prioritized. JobMitra customized entirely around the target job description. Best ATS optimization tool available.",
    },
    {
        id: "t29",
        src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Asha Fernandes",
        title: "Asha Fernandes",
        role: "Event Manager · Hospitality",
        rating: 5,
        description: "Non-conventional field but the platform nailed it. Restructured my event ROI metrics perfectly. Received 4 offers from top hospitality chains. Thrilled!",
    },
    {
        id: "t30",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format",
        alt: "Nikhil Chaudhari",
        title: "Nikhil Chaudhari",
        role: "Blockchain Developer",
        rating: 5,
        description: "Web3 is a niche space. JobMitra was the only platform that actually understood blockchain-specific resume requirements. Placed at a top Web3 company.",
    },
];

// ─── Stats display ──────────────────────────────────────────────────────────
const STATS = [
    { icon: Users, label: "Active Users", value: "12,000+" },
    { icon: Star, label: "Average Rating", value: "4.9 / 5" },
    { icon: TrendingUp, label: "Placement Rate", value: "94%" },
    { icon: Award, label: "Success Stories", value: "8,500+" },
];

// ─── Component ──────────────────────────────────────────────────────────────
const TestimonialsSection = () => {
    const [activeCard, setActiveCard] = useState<ImageData | null>(null);

    return (
        <section id="testimonials" className="relative py-16 lg:py-24 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'hsl(250 80% 65% / 0.06)', filter: 'blur(80px)' }} />

            <div className="container mx-auto max-w-7xl px-6">
                {/* ── Section header ── */}
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs border mb-5"
                        style={{
                            background: 'hsl(222 40% 8% / 0.6)',
                            borderColor: 'hsl(222 30% 18% / 0.5)',
                            color: 'hsl(215 20% 55%)',
                        }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Community Stories
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: 'hsl(210 40% 93%)',
                        }}
                    >
                        Loved by{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(250,80%,65%))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Job Seekers &amp; Recruiters
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base max-w-2xl mx-auto"
                        style={{ color: 'hsl(215 20% 55%)' }}
                    >
                        Thousands of freshers, professionals, and recruiters trust JobMitra every day.
                        Tap any profile on the globe to read their story.
                    </motion.p>
                </div>

                {/* ── Main two-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* LEFT — info + stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Quote card */}
                        <div
                            className="relative rounded-2xl border p-7 overflow-hidden"
                            style={{
                                background: 'hsl(222 40% 8% / 0.5)',
                                borderColor: 'hsl(222 30% 16% / 0.6)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <Quote
                                className="absolute top-5 right-5 opacity-10"
                                size={48}
                                style={{ color: 'hsl(217 91% 60%)' }}
                            />
                            <div className="flex items-center gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm font-medium" style={{ color: 'hsl(210 40% 82%)' }}>
                                    4.9 / 5 — from 3,200+ reviews
                                </span>
                            </div>
                            <p className="text-base leading-relaxed italic mb-5" style={{ color: 'hsl(210 40% 80%)' }}>
                                "JobMitra is the most intelligent career platform I've used. The AI feedback is
                                like having a personal career coach available 24/7."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden border-2" style={{ borderColor: 'hsl(217 91% 60% / 0.4)' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=100&h=100&fit=crop&crop=face&auto=format"
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: 'hsl(210 40% 90%)' }}>Sameer Kapoor</p>
                                    <p className="text-xs" style={{ color: 'hsl(215 20% 45%)' }}>Senior Engineer · Microsoft India</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                                    className="rounded-xl border p-4 flex flex-col gap-2"
                                    style={{
                                        background: 'hsl(222 40% 8% / 0.5)',
                                        borderColor: 'hsl(222 30% 16% / 0.5)',
                                        backdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: 'hsl(217 91% 60% / 0.12)' }}
                                    >
                                        <stat.icon size={16} style={{ color: 'hsl(217 91% 60%)' }} />
                                    </div>
                                    <p className="text-2xl font-bold" style={{ color: 'hsl(210 40% 93%)', fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs" style={{ color: 'hsl(215 20% 48%)' }}>{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-sm flex items-center gap-2"
                            style={{ color: 'hsl(215 20% 45%)' }}
                        >
                            <span className="inline-block w-5 h-px" style={{ background: 'hsl(217 91% 60%)' }} />
                            🌐 Drag the globe · Tap any face to read their story
                        </motion.p>
                    </motion.div>

                    {/* RIGHT — 3D Sphere */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="flex justify-center items-center"
                    >
                        <div className="relative">
                            {/* Ambient glow behind sphere */}
                            <div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, hsl(217 91% 60% / 0.08) 0%, transparent 70%)',
                                    transform: 'scale(1.2)',
                                }}
                            />
                            <SphereImageGrid
                                images={TESTIMONIALS}
                                containerSize={480}
                                sphereRadius={185}
                                dragSensitivity={0.7}
                                momentumDecay={0.96}
                                maxRotationSpeed={5}
                                baseImageScale={0.11}
                                hoverScale={1.25}
                                perspective={1000}
                                autoRotate={true}
                                autoRotateSpeed={0.18}
                                darkMode={true}
                                onImageClick={(img) => setActiveCard(img)}
                                className="relative z-10"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Testimonial modal ── */}
            <AnimatePresence>
                {activeCard && (
                    <motion.div
                        key="testimonial-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                        onClick={() => setActiveCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="relative max-w-sm w-full rounded-2xl border overflow-hidden"
                            style={{
                                background: 'hsl(222 40% 8% / 0.97)',
                                borderColor: 'hsl(222 30% 20% / 0.7)',
                                backdropFilter: 'blur(24px)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div
                                className="flex items-start gap-4 p-5 border-b"
                                style={{ borderColor: 'hsl(222 30% 16% / 0.6)' }}
                            >
                                <div
                                    className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2"
                                    style={{ borderColor: 'hsl(217 91% 60% / 0.4)' }}
                                >
                                    <img src={activeCard.src} alt={activeCard.alt} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-base truncate" style={{ color: 'hsl(210 40% 92%)' }}>
                                        {activeCard.title}
                                    </p>
                                    {activeCard.role && (
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(215 20% 50%)' }}>
                                            {activeCard.role}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-0.5 mt-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className={i < (activeCard.rating ?? 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                            />
                                        ))}
                                        <span className="ml-1.5 text-xs" style={{ color: 'hsl(215 20% 45%)' }}>
                                            Verified user
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveCard(null)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-white/5"
                                    style={{ color: 'hsl(215 20% 45%)' }}
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Feedback body */}
                            <div className="p-5">
                                <Quote size={20} className="mb-3 opacity-40" style={{ color: 'hsl(217 91% 60%)' }} />
                                <p className="text-sm leading-relaxed" style={{ color: 'hsl(215 20% 65%)' }}>
                                    {activeCard.description}
                                </p>
                            </div>

                            {/* Footer badge */}
                            <div
                                className="px-5 pb-5 flex items-center justify-between"
                            >
                                <span
                                    className="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1 border"
                                    style={{
                                        background: 'hsl(217 91% 60% / 0.1)',
                                        borderColor: 'hsl(217 91% 60% / 0.25)',
                                        color: 'hsl(217 91% 70%)',
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    JobMitra Success Story
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TestimonialsSection;
