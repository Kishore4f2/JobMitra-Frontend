import { motion } from "framer-motion";
import { UserPlus, Search, Send, Rocket } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Profile", description: "Set up your professional profile in minutes." },
  { icon: Search, title: "Discover Jobs", description: "AI matches you with relevant opportunities." },
  { icon: Send, title: "Apply Smartly", description: "One-click applications with tailored resumes." },
  { icon: Rocket, title: "Get Hired Faster", description: "Track progress and land your dream role." },
];

const HowItWorks = () => {
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
          <span className="text-sm font-medium text-primary mb-3 block">How It Works</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Four steps to your <span className="gradient-text">next opportunity</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 text-center group transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="text-xs font-mono text-primary/60 mb-4">0{i + 1}</div>
              <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-5 bg-secondary transition-all duration-300 group-hover:bg-primary/10">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
