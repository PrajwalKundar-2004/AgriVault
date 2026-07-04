"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/vault-admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Staff Management", href: "/vault-admin/staff", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { name: "Inventory", href: "/vault-admin/inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { name: "Settings", href: "/vault-admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.1 }
  },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const itemVariants = {
  open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  closed: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

export default function Sidebar({ isOpen, setIsOpen }) {
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
      {/* Mobile Backdrop overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={shouldBeOpen ? "open" : "closed"}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-surface/95 backdrop-blur-2xl border-r border-border-subtle flex flex-col h-full shadow-2xl lg:shadow-none"
      >
        <div className="h-16 flex items-center px-6 border-b border-border-subtle/50 bg-brand-bg/30">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-brand-primary/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-text-main font-bold tracking-tight text-lg">AgriVault</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link href={item.href} onClick={() => isMobile && setIsOpen(false)}>
                  <div
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? "text-brand-primary font-semibold shadow-lg shadow-brand-primary/10" 
                        : "text-text-muted hover:text-text-main hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent border-l-2 border-brand-primary"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <svg className={`w-5 h-5 mr-3 z-10 transition-transform duration-300 ${isActive ? "text-brand-primary scale-110" : "text-text-muted group-hover:scale-110 group-hover:text-brand-secondary"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <span className="z-10 text-sm tracking-wide">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div variants={itemVariants} className="p-4 border-t border-border-subtle/50 bg-brand-bg/20">
          <div className="bg-brand-surface/40 rounded-xl p-4 border border-border-subtle/30 text-center backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5">System Status</p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse"></span>
              <span className="text-xs text-text-main font-medium tracking-wide">All systems operational</span>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
