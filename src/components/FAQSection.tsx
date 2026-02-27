"use client";

import { motion } from "framer-motion";
import { UniqueAccordion } from "@/components/ui/interactive-accordion";

const faqItems = [
  {
    id: 1,
    number: "01",
    title: "How does AI job matching work?",
    content:
      "JobMitra's AI matching engine analyzes your skills, experience, and career goals to suggest the most relevant opportunities. It continuously improves by learning from your interactions and hiring market trends to save you time in your job search.",
  },
  {
    id: 2,
    number: "02",
    title: "How secure is my personal data?",
    content:
      "We prioritize your privacy above all else. JobMitra uses enterprise-level encryption and secure JWT authentication to ensure that your personal information and documents are protected and only accessible to authorized recruiters.",
  },
  {
    id: 3,
    number: "03",
    title: "Can I track my job applications?",
    content:
      "Yes! Your personalized dashboard provides real-time status updates for every application you submit. You can see when a recruiter views your profile, shortlists your application, or schedules an interview.",
  },
  {
    id: 4,
    number: "04",
    title: "How do recruiters find me on JobMitra?",
    content:
      "Recruiters use our advanced search and AI tools to find talent that matches their requirements. Keeping your profile updated and using our Resume Analyzer helps ensure your profile stands out to the right employers.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Frequently Asked </span>
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about JobMitra's intelligent hiring
            platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <UniqueAccordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
