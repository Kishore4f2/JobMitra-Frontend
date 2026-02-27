import { motion } from "framer-motion";
import { SearchX, Clock } from "lucide-react";

const problems = [
  {
    icon: SearchX,
    title: "Job Seekers Struggle",
    description: "Finding the right role in a sea of irrelevant listings wastes hours and leads to frustration.",
  },
  {
    icon: Clock,
    title: "Recruiters Lose Time",
    description: "Inefficient hiring pipelines, scattered applications, and manual screening slow everything down.",
  },
];

const ProblemSection = () => {
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
          <span className="text-sm font-medium text-primary mb-3 block">The Problem</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Hiring is <span className="gradient-text">broken</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-8 transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--gradient-primary)" }}>
                <problem.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
