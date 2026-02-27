import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, Mail, Briefcase } from "lucide-react";
import jobmitraLogo from "@/assets/jobmitra-logo.png";
import jobmitraText from "@/assets/jobmitra-text.png";

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

const navLinks = [
  "Features",
  "How It Works",
  "AI Matching",
  "FAQ",
  "Contact",
  "Privacy Policy",
  "Terms",
];

const JobMitraFooter = () => {
  return (
    <footer className="relative overflow-hidden bg-[#020617] border-t border-white/5" style={{ paddingBottom: 0 }}>
      {/* Top content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24">
        {/* Logo + Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-3 mb-5">
            <img src={jobmitraLogo} alt="JobMitra logo" className="h-10 w-10 object-contain" />
            <img src={jobmitraText} alt="JobMitra" className="h-8 object-contain" />
          </div>
          <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Smart hiring platform connecting job seekers and recruiters
            through intelligent matching, secure workflows, and real-time hiring
            insights.
          </p>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-6 mt-8"
        >
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-zinc-500 hover:text-blue-400 transition-all duration-300"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bottom area with giant text + glow icon */}
      <div className="relative mt-16 h-[300px] sm:h-[360px]">
        {/* Giant background word — vertically centered, horizontally full */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="font-extrabold uppercase leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(120px, 18vw, 320px)",
              letterSpacing: "0.12em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(59,130,246,0.08)",
              backgroundImage: "linear-gradient(to bottom, rgba(59,130,246,0.13) 0%, rgba(59,130,246,0.06) 50%, rgba(2,6,23,0) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              transform: "translateY(10%)",
            }}
          >
            JOBMITRA
          </span>
        </div>

        {/* Radial glow behind icon */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

        {/* Glowing center icon — centered on the text */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 0 60px rgba(59,130,246,0.4), 0 0 120px rgba(99,102,241,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          >
            <Briefcase className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Copyright — bottom left */}
        <div className="absolute bottom-5 left-6 z-10">
          <p className="text-xs text-zinc-600">
            © 2026 JobMitra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default JobMitraFooter;
