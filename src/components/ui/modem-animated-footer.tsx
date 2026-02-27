"use client";
import React from "react";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import jobmitraLogo from "@/assets/jobmitra-logo.png";
import jobmitraText from "@/assets/jobmitra-text.png";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <Github className="w-5 h-5" />, href: "https://github.com", label: "GitHub" },
  { icon: <Mail className="w-5 h-5" />, href: "mailto:contact@jobmitra.ai", label: "Email" },
];

const defaultNavLinks: FooterLink[] = [
  { label: "Features", href: "#" },
  { label: "AI Matching", href: "#" },
  { label: "Recruiter Dashboard", href: "/dashboard/recruiter" },
  { label: "Smart Applications", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export const Footer = ({
  brandName = "JobMitra",
  brandDescription = "Smart hiring platform connecting job seekers and recruiters through intelligent matching, secure workflows, and real-time hiring insights.",
  socialLinks = defaultSocialLinks,
  navLinks = defaultNavLinks,
  creatorName = "JobMitra Team",
  creatorUrl = "#",
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-[#020617] border-t border-white/5",
        className
      )}
    >
      {/* ── Main wrapper ── */}
      <div className="relative z-10 flex flex-col">
        {/* ── Top content area ── */}
        <div className="max-w-7xl w-full mx-auto px-6 pt-16 pb-6">
          <div className="flex flex-col items-center">
            {/* Brand block */}
            <div className="flex flex-col items-center text-center mb-8">
              {/* Logo + text */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md" />
                  <img
                    src={jobmitraLogo}
                    alt="JobMitra logo"
                    className="relative h-10 w-10 object-contain"
                  />
                </div>
                <img
                  src={jobmitraText}
                  alt={brandName}
                  className="h-8 object-contain"
                />
              </div>

              {/* Description */}
              <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                {brandDescription}
              </p>
            </div>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3 mb-7">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-blue-500/20 bg-blue-500/5 text-zinc-400 transition-all duration-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {link.icon}
                    </span>
                    <span className="sr-only">{link.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Nav links */}
            {navLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-[13px] text-zinc-500 transition-colors duration-300 hover:text-blue-400"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Cinematic bottom area ── */}
        <div className="relative h-[180px] sm:h-[230px]">
          {/* Large background text — visible at top, fades into bg at bottom */}
          <div
            className="absolute inset-x-0 top-0 flex items-start justify-center pointer-events-none select-none overflow-hidden pt-2"
            aria-hidden="true"
          >
            <span
              className="font-black uppercase whitespace-nowrap leading-none"
              style={{
                fontSize: "clamp(28px, 9vw, 260px)",
                letterSpacing: "0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(30,60,110,0.22)",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(30,60,110,0.28) 0%, rgba(30,60,110,0.14) 35%, rgba(20,40,80,0.04) 70%, transparent 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {brandName.toUpperCase()}
            </span>
            {/* Fade overlay — blends bottom of text into background */}
            <div
              className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, #020617 100%)",
              }}
            />
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full bg-blue-500/8 blur-[60px] pointer-events-none" />
            <div
              className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110"
              style={{
                background: "linear-gradient(145deg, #f1f5f9, #e2e8f0)",
                boxShadow:
                  "0 0 35px rgba(59,130,246,0.15), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {brandIcon || (
                <img
                  src={jobmitraLogo}
                  alt={brandName}
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              )}
            </div>
          </div>

          {/* Copyright — bottom left */}
          <div className="absolute bottom-3 left-6 z-10">
            <p className="text-[11px] text-zinc-600">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
