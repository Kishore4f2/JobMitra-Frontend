"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Bot,
  Orbit,
  FileSearch,
  HelpCircle,
  Star,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const MOBILE_LABEL_WIDTH = 72;
const NAVBAR_OFFSET = 120; // offset to determine which section is "active"

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isManualScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToSection = (id: string) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Pause scroll-spy briefly so it doesn't fight with manual scroll
        isManualScrollRef.current = true;
        if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
        manualScrollTimeoutRef.current = setTimeout(() => {
          isManualScrollRef.current = false;
        }, 1000);

        const navbarHeight = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 500);
    } else {
      doScroll();
    }
  };

  const navItems = useMemo(() => {
    const isDashboard = location.pathname.startsWith("/dashboard");

    if (user && isDashboard) {
      return [
        { label: "Logout", icon: LogOut, path: "__logout" },
      ];
    }

    const base = [
      { label: "Home", icon: Home, path: "/" },
      { label: "Robo", icon: Bot, path: "#robo" },
      { label: "Timeline", icon: Orbit, path: "#timeline" },
      { label: "Resume", icon: FileSearch, path: "#resume-analyzer" },
      { label: "Platform", icon: Users, path: "#platform-showcase" },
      { label: "Reviews", icon: MessageSquare, path: "#testimonials" },
      { label: "Why Us", icon: Star, path: "#why-us" },
      { label: "FAQ", icon: HelpCircle, path: "#faq" },
    ];
    if (user) {
      let dashPath = "/dashboard/user";
      if (user.role === "RECRUITER") dashPath = "/dashboard/recruiter";
      if (user.role === "ADMIN") dashPath = "/dashboard/admin";

      return [
        { label: "Home", icon: Home, path: "/" },
        { label: "Jobs", icon: Briefcase, path: "/jobs" },
        { label: "Robo", icon: Bot, path: "#robo" },
        { label: "Timeline", icon: Orbit, path: "#timeline" },
        { label: "Resume", icon: FileSearch, path: "#resume-analyzer" },
        { label: "Platform", icon: Users, path: "#platform-showcase" },
        { label: "Reviews", icon: MessageSquare, path: "#testimonials" },
        { label: "Why Us", icon: Star, path: "#why-us" },
        { label: "FAQ", icon: HelpCircle, path: "#faq" },
        { label: "Dashboard", icon: LayoutDashboard, path: dashPath },
        { label: "Logout", icon: LogOut, path: "__logout" },
      ];
    }
    return base;
  }, [user, location.pathname]);

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);
  const [selected, setSelected] = useState(Math.max(activeIndex, 0));

  // Scroll-spy: watch which section is in view and update selected
  const handleScroll = useCallback(() => {
    if (location.pathname !== "/") return;
    if (isManualScrollRef.current) return;

    const scrollY = window.scrollY;

    // If near top, select Home
    if (scrollY < 200) {
      setSelected(0);
      return;
    }

    // Check each hash section from bottom to top to find the one in view
    const hashItems = navItems
      .map((item, idx) => ({ ...item, idx }))
      .filter((item) => item.path.startsWith("#"));

    for (let i = hashItems.length - 1; i >= 0; i--) {
      const sectionId = hashItems[i].path.slice(1);
      const el = document.getElementById(sectionId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= NAVBAR_OFFSET) {
          setSelected(hashItems[i].idx);
          return;
        }
      }
    }

    // If no section matched, default to Home
    setSelected(0);
  }, [location.pathname, navItems]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, handleScroll]);

  const handleClick = (idx: number) => {
    const item = navItems[idx];
    if (item.path === "__logout") {
      logout();
      navigate("/");
      return;
    }
    if (item.path.startsWith("#")) {
      scrollToSection(item.path.slice(1));
      setSelected(idx);
      return;
    }
    if (item.path === "/" && location.pathname === "/") {
      isManualScrollRef.current = true;
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
      manualScrollTimeoutRef.current = setTimeout(() => {
        isManualScrollRef.current = false;
      }, 1000);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSelected(idx);
      return;
    }
    setSelected(idx);
    navigate(item.path);
  };

  // Sync for route-based pages (not hash sections)
  useEffect(() => {
    if (location.pathname !== "/") {
      const routeIdx = navItems.findIndex(
        (item) => !item.path.startsWith("#") && item.path !== "__logout" && item.path === location.pathname
      );
      if (routeIdx >= 0) {
        setSelected(routeIdx);
      }
    }
  }, [location.pathname, navItems]);

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Main Navigation"
      className="fixed inset-x-0 top-4 mx-auto z-50 w-fit bg-card border border-border rounded-full flex items-center p-1.5 sm:p-2 shadow-xl space-x-0.5 sm:space-x-1 max-w-[95vw] h-[48px] sm:h-[52px]"
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = selected === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors duration-200 relative h-8 sm:h-10 min-w-[36px] sm:min-w-[44px] min-h-[32px] sm:min-h-[40px] max-h-[36px] sm:max-h-[44px]",
              isActive
                ? "bg-primary/10 text-primary gap-2"
                : "bg-transparent text-muted-foreground hover:bg-muted",
              "focus:outline-none focus-visible:ring-0",
            )}
            onClick={() => handleClick(idx)}
            aria-label={item.label}
            type="button"
          >
            <Icon size={18} strokeWidth={2} aria-hidden className="transition-colors duration-200 sm:[&]:w-[22px] sm:[&]:h-[22px]" />
            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className="overflow-hidden items-center max-w-[72px] hidden sm:flex"
            >
              <span
                className={cn(
                  "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-[1.9]",
                  isActive ? "text-primary" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default Navbar;
