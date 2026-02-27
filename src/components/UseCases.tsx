import { motion } from "framer-motion";
import { User, Users, Rocket, Building2 } from "lucide-react";

const cases = [
  { icon: User, title: "Job Seekers", description: "Discover roles matched to your skills and aspirations." },
  { icon: Users, title: "Recruiters", description: "Streamline pipelines and find top talent in minutes." },
  { icon: Rocket, title: "Startups", description: "Scale your team fast with intelligent hiring tools." },
  { icon: Building2, title: "Enterprises", description: "Manage large-scale recruitment with enterprise controls." },
];

const UseCases = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary mb-3 block">Use Cases</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Built for <span className="gradient-text">everyone</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="glass-card rounded-2xl p-7 text-center group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5 bg-secondary group-hover:bg-primary/10 transition-colors duration-300">
                <c.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
