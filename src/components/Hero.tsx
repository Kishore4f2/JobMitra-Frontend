import { motion } from "framer-motion";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import jobmitraLogo from "@/assets/jobmitra-logo.png";
import jobmitraText from "@/assets/jobmitra-text.png";
import MacBook3D from "@/components/MacBook3D";

const rotatingWords = ["Smart", "Fast", "Secure", "AI-Driven"];

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 h-[calc(100vh-80px)]">
      {/* Logo top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-[72px] left-4 sm:left-6 z-20 flex items-center gap-2"
      >
        <img src={jobmitraLogo} alt="JobMitra logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
        <img src={jobmitraText} alt="JobMitra" className="h-8 sm:h-10 object-contain" />
      </motion.div>

      {/* Auth buttons top-right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-[72px] right-4 sm:right-6 z-20 flex items-center gap-2 sm:gap-3"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 sm:gap-2 glass-card rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:scale-105"
        >
          <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Login</span>
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ background: "var(--gradient-primary)" }}
        >
          <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Sign Up</span>
        </Link>
      </motion.div>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* 3D MacBook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <MacBook3D />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-center"
        >
          <span className="text-foreground">Hiring Made </span>
          <AnimatedHero words={rotatingWords} />
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm md:text-base text-muted-foreground max-w-xl text-center text-balance leading-relaxed"
        >
          JobMitra connects talent with opportunity through intelligent AI matching, 
          streamlined workflows, and data-driven insights — making recruitment faster, 
          smarter, and effortless for everyone.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
