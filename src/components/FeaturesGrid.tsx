import { motion } from "framer-motion";
import { Brain, ShieldCheck, LayoutDashboard, Zap, BarChart3, FileText } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Job Matching", description: "Intelligent algorithms pair candidates with their ideal roles." },
  { icon: ShieldCheck, title: "Secure Login & JWT", description: "Enterprise-grade authentication protects every account." },
  { icon: LayoutDashboard, title: "Smart Dashboard", description: "Unified view for managing jobs, applications, and analytics." },
  { icon: Zap, title: "Instant Applications", description: "Apply to multiple roles with a single click." },
  { icon: BarChart3, title: "Recruiter Insights", description: "Data-driven hiring analytics and candidate pipelines." },
  { icon: FileText, title: "Resume Intelligence", description: "AI-parsed resumes for smarter candidate screening." },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 px-4 section-glow">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-3 block">Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Everything you need to <span className="gradient-text">hire smarter</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-7 group transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/20"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
