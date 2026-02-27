import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target, Zap, TrendingUp, Lightbulb, ChevronDown, Sparkles, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roleData: Record<string, { score: number; matched: number; total: number; strength: "Strong" | "Medium" | "Weak"; tips: string[]; keywords: string[] }> = {
  "Frontend Developer": {
    score: 85, matched: 14, total: 20, strength: "Strong",
    tips: ["Add React performance optimization experience", "Include accessibility (a11y) expertise", "Mention CI/CD pipeline familiarity", "Quantify UI performance improvements"],
    keywords: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Jest", "Webpack", "GraphQL"],
  },
  "Java Full Stack": {
    score: 62, matched: 9, total: 20, strength: "Medium",
    tips: ["Add Spring Boot microservices experience", "Include database optimization skills", "Mention REST API design patterns", "Add cloud deployment experience (AWS/GCP)"],
    keywords: ["Spring Boot", "Hibernate", "REST APIs", "MySQL", "Docker", "Kubernetes", "Maven", "JUnit"],
  },
  "AI Engineer": {
    score: 45, matched: 6, total: 20, strength: "Weak",
    tips: ["Add deep learning frameworks (PyTorch/TensorFlow)", "Include ML model deployment experience", "Mention data pipeline tools", "Add research paper publications if any"],
    keywords: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "MLOps", "Pandas", "Scikit-learn"],
  },
  "Embedded Engineer": {
    score: 38, matched: 4, total: 20, strength: "Weak",
    tips: ["Add RTOS experience", "Include hardware debugging tools", "Mention communication protocols (I2C, SPI)", "Add firmware development experience"],
    keywords: ["C/C++", "RTOS", "ARM Cortex", "I2C", "SPI", "UART", "PCB Design", "Linux Kernel"],
  },
};

const strengthConfig = {
  Strong: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", barColor: "from-blue-500 to-indigo-500" },
  Medium: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", barColor: "from-amber-500 to-orange-500" },
  Weak: { color: "bg-red-500/20 text-red-400 border-red-500/30", barColor: "from-red-500 to-rose-500" },
};

const CircularProgress = ({ score, size = 140 }: { score: number; size?: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    let current = 0;
    const step = () => {
      current += 1.2;
      if (current >= score) {
        setAnimatedScore(score);
        return;
      }
      setAnimatedScore(Math.floor(current));
      frame = requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(step); }, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [score]);

  const scoreColor = score >= 75 ? "#3b82f6" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ filter: `drop-shadow(0 0 12px ${scoreColor}40)` }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={`url(#scoreGradient)`}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-white">{animatedScore}</span>
        <span className="text-xs text-zinc-400 -mt-1">/ 100</span>
      </div>
    </div>
  );
};

const AtsScorePanel = () => {
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const data = roleData[selectedRole];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-5"
    >
      {/* Header + Role Selector */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0b1220]/80 backdrop-blur-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">AI Resume Analysis</h3>
              <p className="text-xs text-zinc-500">Powered by JobMitra ATS Engine</p>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-[#0a0f1a] border border-blue-500/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer"
            >
              {Object.keys(roleData).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Score + Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: Circular Score */}
          <motion.div
            key={selectedRole + "-score"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-6 flex flex-col items-center justify-center"
          >
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">ATS Score</p>
            <CircularProgress score={data.score} />
            <Badge className={`mt-4 text-xs border ${strengthConfig[data.strength].color}`}>
              {data.strength === "Strong" ? "🟢" : data.strength === "Medium" ? "🟡" : "🔴"} {data.strength}
            </Badge>
          </motion.div>

          {/* RIGHT: Insights */}
          <div className="lg:col-span-2 space-y-4">
            {/* Keyword Match */}
            <motion.div
              key={selectedRole + "-match"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Target className="w-4 h-4 text-blue-400" /> Keyword Match
                </span>
                <span className="text-sm font-display font-bold text-white">{data.matched} / {data.total}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-blue-500/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.matched / data.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full bg-gradient-to-r ${strengthConfig[data.strength].barColor}`}
                />
              </div>
            </motion.div>

            {/* Strength + Tips */}
            <motion.div
              key={selectedRole + "-tips"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-5"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" /> AI Improvement Tips
              </span>
              <ul className="space-y-2">
                {data.tips.map((tip, i) => (
                  <motion.li
                    key={tip}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <Zap className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Suggested Keywords */}
      <motion.div
        key={selectedRole + "-keywords"}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-blue-500/20 bg-[#0b1220]/80 backdrop-blur-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-blue-400" />
          <h4 className="font-display text-sm font-bold text-white">Suggested Keywords to Add</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((kw, i) => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 hover:bg-blue-500/20 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-default"
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Improvement Progress Mini */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-blue-500/20 bg-[#0b1220]/80 backdrop-blur-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h4 className="font-display text-sm font-bold text-white">Resume Improvement Progress</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Feb 10", score: 52 },
            { label: "Feb 16", score: 68 },
            { label: "Today", score: data.score },
          ].map((entry, i) => (
            <div key={entry.label} className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-4 text-center">
              <p className="text-xs text-zinc-500 mb-2">{entry.label}</p>
              <div className="w-full h-16 flex items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.score / 100) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="w-8 rounded-t-md bg-gradient-to-t from-blue-500 to-indigo-500"
                />
              </div>
              <p className="font-display text-sm font-bold text-white mt-2">{entry.score}%</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 px-1">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <p className="text-xs text-emerald-400 font-medium">+{data.score - 52}% improvement since first upload</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AtsScorePanel;
