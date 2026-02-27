import { motion } from "framer-motion";
import { Brain, Shield, LayoutDashboard, Zap } from "lucide-react";

const badges = [
  { icon: Brain, label: "AI Matching" },
  { icon: Shield, label: "Secure Applications" },
  { icon: LayoutDashboard, label: "Recruiter Dashboard" },
  { icon: Zap, label: "Real-time Hiring" },
];

const TrustStrip = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 hover:border-primary/30"
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
