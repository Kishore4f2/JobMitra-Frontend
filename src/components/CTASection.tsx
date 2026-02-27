import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          style={{ background: "var(--gradient-cta)" }}
        >
          {/* Overlay noise */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your career journey?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals already using JobMitra to find their next opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 font-semibold text-gray-900 transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 font-medium text-white transition-all duration-300 hover:bg-white/10">
                Post a Job
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
