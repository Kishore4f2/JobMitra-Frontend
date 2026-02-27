"use client";

import { motion } from "framer-motion";
import { Compare } from "@/components/ui/compare";
import resumeFront from "@/assets/resume-sample.png";
import resumeAnalyzed from "@/assets/resume-analyzed.png";
import {
  CheckCircle,
  UserCheck,
  Code2,
  Trophy,
  XCircle,
  BarChart3,
  FileSearch,
} from "lucide-react";

const analysisResults = [
  {
    label: "Shortlisted",
    status: "pass",
    icon: CheckCircle,
    detail: "Profile matches 92% of job requirements",
  },
  {
    label: "Selected for HR Round",
    status: "pass",
    icon: UserCheck,
    detail: "Communication & soft skills verified",
  },
  {
    label: "Technical Round",
    status: "pass",
    icon: Code2,
    detail: "Java, React, SQL — strong technical fit",
  },
  {
    label: "Got Placed",
    status: "success",
    icon: Trophy,
    detail: "Offer extended — Full Stack Developer",
  },
  {
    label: "Rejection Risk",
    status: "low",
    icon: XCircle,
    detail: "Low — strong overall candidacy",
  },
];

const hackLines = [
  { text: "> JOBMITRA RESUME ANALYZER v2.0 ............ INITIALIZED ............ READY", color: "text-green-500" },
  { text: "> INITIALIZING SCAN .................. LOADING MODULES .................. OK", color: "text-green-400" },
  { text: "> Loading Resume Data ................ Parsing PDF ................ COMPLETE", color: "text-green-500/80" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> Name: Rahul Sharma .......................... ID: JM-2024-00847 ........", color: "text-cyan-400" },
  { text: "> Email: rahul.dev@gmail.com .................. VERIFIED ✓ ................", color: "text-cyan-300" },
  { text: "> Phone: +91 98XXX XXXXX ..................... VERIFIED ✓ ................", color: "text-cyan-300/80" },
  { text: "> Location: Bangalore, India ................. REGION: South .............", color: "text-cyan-200/70" },
  { text: "> LinkedIn: linkedin.com/in/rahulsharma ...... PROFILE ACTIVE ✓ ..........", color: "text-cyan-400/60" },
  { text: "> GitHub: github.com/rahul-sharma-dev ........ 247 CONTRIBUTIONS .........", color: "text-cyan-300/60" },
  { text: "> Portfolio: rahulsharma.dev ................. ONLINE ✓ ..................", color: "text-cyan-300/50" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> PROFILE SUMMARY ........................... EXTRACTING TEXT ............", color: "text-yellow-400" },
  { text: "> Result-driven Full Stack Developer with 2.5 years of hands-on experience", color: "text-green-300" },
  { text: "> Specializing in React, Java, and cloud-native microservice architecture.", color: "text-green-300/80" },
  { text: "> Built scalable apps serving 10K+ users with 99.9% uptime guarantee.....", color: "text-green-300/70" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> SKILLS DETECTED ........................... 12 SKILLS FOUND ............", color: "text-yellow-400" },
  { text: ">   React.js .... ████████████████░░░░ 85% ......... STRONG MATCH ✓ .....", color: "text-blue-400" },
  { text: ">   Java ........ █████████████████░░░ 78% ......... STRONG MATCH ✓ .....", color: "text-blue-300" },
  { text: ">   SQL ......... ████████████████░░░░ 82% ......... STRONG MATCH ✓ .....", color: "text-blue-400" },
  { text: ">   Python ...... ██████████████░░░░░░ 70% ......... MODERATE MATCH .....", color: "text-blue-200" },
  { text: ">   Node.js ..... ███████████████░░░░░ 76% ......... STRONG MATCH ✓ .....", color: "text-blue-300" },
  { text: ">   TypeScript .. ████████████████░░░░ 84% ......... STRONG MATCH ✓ .....", color: "text-blue-400" },
  { text: ">   MongoDB ..... █████████████░░░░░░░ 65% ......... MODERATE MATCH .....", color: "text-blue-200/80" },
  { text: ">   Docker ...... ██████████████░░░░░░ 68% ......... MODERATE MATCH .....", color: "text-blue-300/80" },
  { text: ">   AWS ......... ███████████████░░░░░ 74% ......... STRONG MATCH ✓ .....", color: "text-blue-300" },
  { text: ">   Git ......... ██████████████████░░ 90% ......... EXCELLENT ✓ ........", color: "text-blue-400" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> EDUCATION ................................. SCANNING RECORDS ...........", color: "text-yellow-400" },
  { text: "> B.Tech Computer Science — VIT University Vellore — 2018 to 2022 .......", color: "text-emerald-400" },
  { text: "> CGPA: 8.7/10 ......... Dean's List 2020, 2021 ......... VERIFIED ✓ ...", color: "text-emerald-300" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> WORK EXPERIENCE ........................... 2 POSITIONS FOUND ..........", color: "text-yellow-400" },
  { text: "> Software Engineer @ TCS Digital (Jun 2022 - Present) ... CURRENT ROLE ..", color: "text-green-300" },
  { text: ">   Built microservices handling 50K+ daily API requests across 3 regions.", color: "text-green-300/80" },
  { text: "> Intern @ Infosys (Jan 2021 - May 2022) ........... COMPLETED ✓ ........", color: "text-green-300/70" },
  { text: ">   Developed REST APIs and integrated CI/CD pipelines with Jenkins .....", color: "text-green-300/60" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> PROJECTS: 8 Verified ...................... ANALYZING CODEBASE .........", color: "text-yellow-400" },
  { text: ">   Car Rental System — Java, JDBC, MySQL ......... 2.4K lines ... ✓ ....", color: "text-emerald-200/80" },
  { text: ">   E-Commerce Platform — React, Node, Stripe ..... 5.1K lines ... ✓ ....", color: "text-emerald-200/80" },
  { text: ">   AI Chat Bot — Python, TensorFlow, NLP ......... 1.8K lines ... ✓ ....", color: "text-emerald-200/80" },
  { text: ">   Portfolio Site — Next.js, Tailwind, Framer ..... 1.2K lines ... ✓ ....", color: "text-emerald-200/80" },
  { text: ">   Weather App — JavaScript, OpenWeather API ...... 800 lines .... ✓ ....", color: "text-emerald-200/70" },
  { text: ">   Task Manager — React, Firebase, Auth .......... 2.1K lines ... ✓ ....", color: "text-emerald-200/70" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> CERTIFICATIONS ............................ 3 VERIFIED .................", color: "text-yellow-400" },
  { text: ">   AWS Certified Developer Associate .............. VALID UNTIL 2026 ...", color: "text-emerald-300/80" },
  { text: ">   Google Cloud Associate Engineer ................ VALID UNTIL 2025 ...", color: "text-emerald-300/80" },
  { text: ">   Meta Frontend Developer Professional .......... VALID UNTIL 2026 ...", color: "text-emerald-300/80" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> ATS COMPATIBILITY SCAN ..................... RUNNING ANALYSIS ...........", color: "text-yellow-400" },
  { text: ">   ATS Score: 92/100 ........................ EXCELLENT .................", color: "text-green-500" },
  { text: ">   Keywords Match: 87% ...................... ABOVE THRESHOLD ✓ .........", color: "text-green-400" },
  { text: ">   Formatting: Optimized .................... PARSEABLE ✓ ...............", color: "text-green-300" },
  { text: ">   Readability Index: 94 .................... EXCELLENT ✓ ...............", color: "text-green-400" },
  { text: ">   Section Headers: 8 Detected .............. STRUCTURED ✓ ..............", color: "text-green-300/80" },
  { text: ">   Bullet Points: 24 Found .................. CONSISTENT ✓ ..............", color: "text-green-300/70" },
  { text: ">   Action Verbs: 18 Detected ................ STRONG ✓ ..................", color: "text-green-300/60" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> PREDICTION ENGINE .......................... COMPUTING RESULTS ..........", color: "text-red-400" },
  { text: ">   Shortlist Probability: 94% ............... ████████████████████ HIGH .", color: "text-red-300" },
  { text: ">   HR Round Chance: 91% ..................... ███████████████████░ HIGH .", color: "text-red-300/80" },
  { text: ">   Technical Round: 88% ..................... ██████████████████░░ HIGH .", color: "text-red-300/70" },
  { text: ">   Final Selection: 85% ..................... █████████████████░░░ HIGH .", color: "text-red-300/60" },
  { text: ">   Rejection Risk: LOW ...................... MINIMAL CONCERNS ..........", color: "text-emerald-400" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "text-green-800" },
  { text: "> STATUS: SHORTLISTED ✓ ...................... CANDIDATE APPROVED ........", color: "text-yellow-400" },
  { text: "> Recommendation: STRONG HIRE ................ FORWARDED TO HR TEAM ......", color: "text-yellow-300" },
  { text: "> ANALYSIS COMPLETE ■ ........................ ALL MODULES PASSED ........", color: "text-green-500" },
  { text: "> ========================================================================", color: "text-green-800" },
  { text: "> END OF REPORT ............................. JOBMITRA AI ENGINE v2.0 ...", color: "text-green-600" },
];

const ResumeEncryptedOverlay = () => (
  <div className="w-full h-full bg-black/95 rounded-2xl overflow-hidden relative">
    {/* Scanline effect */}
    <div className="absolute inset-0 z-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]" />
    {/* Top/bottom fade */}
    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/90 to-transparent z-20 pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/90 to-transparent z-20 pointer-events-none" />
    {/* Scrolling marquee */}
    <div className="animate-marquee-up font-mono px-3 py-2 flex flex-col gap-[5px]">
      {[...hackLines, ...hackLines].map((line, i) => (
        <p key={i} className={`text-[9px] md:text-[11px] ${line.color} leading-tight whitespace-nowrap`}>
          {line.text}
        </p>
      ))}
    </div>
  </div>
);

const ResumeAnalyzerSection = () => {
  return (
    <section id="resume-analyzer" className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Smart Resume Analysis
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Resume </span>
            <span className="gradient-text">Analyzer</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Upload your resume and let our intelligent engine evaluate, score,
            and predict your hiring journey — from shortlisting to placement.
          </p>
        </motion.div>

        {/* Content: Left resume, Right analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
          {/* Left — Resume Compare Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="rounded-2xl border border-border bg-card p-2 shadow-xl w-full max-w-[480px]">
              <Compare
                firstImage={resumeFront}
                secondImage={resumeAnalyzed}
                className="w-full h-[500px] md:h-[600px] rounded-xl"
                slideMode="hover"
                autoplay
                autoplayDuration={4000}
                showHandlebar
                secondImageOverlay={<ResumeEncryptedOverlay />}
              />
              <p className="text-center text-xs text-muted-foreground mt-3 mb-1">
                <FileSearch className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                Hover to compare — Original vs Analyzed
              </p>
            </div>
          </motion.div>

          {/* Right — Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Score card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg">
                    Overall Match Score
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Based on skills, experience & projects
                  </p>
                </div>
              </div>
              <div className="relative w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "92%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                />
              </div>
              <p className="text-right text-sm font-semibold text-primary mt-2">
                92%
              </p>
            </div>

            {/* Status pipeline */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex-1 flex flex-col">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-foreground font-semibold text-sm tracking-wide uppercase">
                  Hiring Pipeline
                </h3>
              </div>
              <div className="divide-y divide-border flex-1 flex flex-col">
                {analysisResults.map((item, i) => {
                  const Icon = item.icon;
                  const color =
                    item.status === "success"
                      ? "text-emerald-400"
                      : item.status === "pass"
                      ? "text-primary"
                      : "text-muted-foreground";

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 * i }}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-muted/40 transition-colors flex-1"
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${color}`}>
                          {item.label}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">
                          {item.detail}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          item.status === "success"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : item.status === "pass"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status === "success"
                          ? "✓ PLACED"
                          : item.status === "pass"
                          ? "✓ PASS"
                          : "LOW RISK"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalyzerSection;
