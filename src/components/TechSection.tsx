import { motion } from "framer-motion";
import { Server, Lock, Monitor, Database } from "lucide-react";

const techs = [
  { icon: Server, label: "Spring Boot Backend" },
  { icon: Lock, label: "JWT Security" },
  { icon: Monitor, label: "React Frontend" },
  { icon: Database, label: "MySQL Database" },
];

const TechSection = () => {
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
          <span className="text-sm font-medium text-primary mb-3 block">Tech Stack</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Powered by <span className="gradient-text">modern tech</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl px-6 py-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
            >
              <tech.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{tech.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
