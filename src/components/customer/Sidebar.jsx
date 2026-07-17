"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SupportModal from "./SupportModal";

const navItems = [
  {
    name: "Overview",
    href: "/customer/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Market Catalog",
    href: "/customer/catalog",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "My Requests",
    href: "/customer/requests",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "My Profile",
    href: "/customer/profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: "About AgriVault",
    href: "/customer/about",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const navContainerVariants = {
    open: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const navItemVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { opacity: 0, x: -20 },
  };

  const mobileSidebarVariants = {
    open: { x: 0, transition: { type: "tween", ease: "easeInOut", duration: 0.3 } },
    closed: { x: "-100%", transition: { type: "tween", ease: "easeInOut", duration: 0.3 } },
  };

  const SidebarContent = ({ isMobile }) => (
    <>
      {/* Subtle Background Glow in Sidebar */}
      <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/10 blur-2xl lg:blur-[100px] pointer-events-none rounded-full dark:opacity-50" />

      {/* Logo Section */}
      <div className="h-24 flex items-center px-8 border-b border-slate-200 dark:border-white/5 relative z-10 transition-colors duration-500">
        <Link href="/customer/dashboard" onClick={() => isMobile && setIsOpen(false)} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
          </div>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-widest uppercase transition-colors duration-500">AgriVault</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <motion.nav 
        variants={navContainerVariants}
        className="flex-1 overflow-y-auto py-8 px-5 space-y-2 relative z-10"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <motion.div key={item.name} variants={navItemVariants}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                  className="relative block group"
                >
                  <div className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ease-in-out
                    ${isActive 
                      ? "bg-slate-100 dark:bg-white/10 text-emerald-600 dark:text-white shadow-sm dark:shadow-lg dark:shadow-black/20" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-500 dark:hover:text-slate-200"
                    }
                  `}>
                    {/* Active Indicator Glow */}
                    {isActive && (
                      <motion.div
                        layoutId={isMobile ? "mobileActiveTabIndicator" : "desktopActiveTabIndicator"}
                        className="absolute left-0 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-lime-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <div className={`${isActive ? "text-emerald-500" : "group-hover:text-emerald-500"} transition-colors duration-300`}>
                        {item.icon}
                    </div>
                    <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  </div>
                </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Bottom Area: Help */}
      <div className="p-4 pb-16 lg:pb-6 lg:p-6 border-t border-slate-200 dark:border-white/5 relative z-10 space-y-4 transition-colors duration-500">
        
        {/* Help Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-900/40 dark:to-slate-900/40 rounded-xl lg:rounded-2xl p-3 lg:p-5 border border-emerald-500/20 dark:border-emerald-500/10 transition-colors duration-500">
          <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-xs lg:text-sm mb-0.5 lg:mb-1">Need Help?</h4>
          <p className="text-[10px] lg:text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-2 lg:mb-4">
            Contact support for assistance with your orders.
          </p>
          <button 
            onClick={() => setIsSupportOpen(true)} 
            className="w-full block text-center py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-white/10 dark:hover:bg-white/20 text-white text-[10px] lg:text-xs font-bold rounded-lg lg:rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. MOBILE TOP HEADER */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center px-4 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-slate-200 dark:border-white/5 transition-colors duration-500">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 dark:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             {isOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
             )}
          </svg>
        </button>
        <div className="ml-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white tracking-widest uppercase transition-colors duration-500">AgriVault</span>
        </div>
      </div>

      {/* 2. MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/60 z-40 lg:hidden"
            />
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileSidebarVariants}
              className="fixed top-0 left-0 z-50 h-[100dvh] w-[280px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 shadow-2xl flex flex-col lg:hidden transition-colors duration-500"
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. DESKTOP SIDEBAR */}
      <motion.aside
        initial="open"
        animate="open"
        className="hidden lg:flex fixed top-0 left-0 z-50 h-screen w-[280px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 shadow-xl flex-col relative transition-colors duration-500"
      >
         <SidebarContent isMobile={false} />
      </motion.aside>

      {/* 4. SUPPORT MODAL */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
}
