"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    name: "Overview",
    href: "/staff/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "My Tasks",
    href: "/staff/tasks",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    name: "Inventory",
    href: "/staff/inventory",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    name: "Orders",
    href: "/staff/orders",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
  {
    name: "Profile",
    href: "/staff/profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const itemVariants = {
  open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  closed: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

export default function StaffSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldBeOpen = isMobile ? isOpen : true;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={shouldBeOpen ? "open" : "closed"}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-2xl border-r border-blue-900/30 flex flex-col h-full shadow-2xl lg:shadow-none"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-blue-900/30 bg-blue-950/20">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-base">AgriVault</span>
            <span className="block text-[10px] text-blue-400/80 font-semibold tracking-widest uppercase -mt-0.5">Staff Portal</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link href={item.href} onClick={() => isMobile && setIsOpen(false)}>
                  <div
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "text-cyan-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="staffActiveTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/15 to-transparent border-l-2 border-cyan-400"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 z-10 transition-transform duration-300 ${
                        isActive
                          ? "text-cyan-400 scale-110"
                          : "text-slate-500 group-hover:scale-110 group-hover:text-blue-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <span className="z-10 text-sm tracking-wide">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Status Footer */}
        <motion.div variants={itemVariants} className="p-4 border-t border-blue-900/30 bg-blue-950/10">
          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-blue-900/20 text-center backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Portal Status</p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium tracking-wide">Connected</span>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
