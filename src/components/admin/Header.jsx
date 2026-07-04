"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Header({ setIsOpen }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.replace("/vault-admin/login");
      } else {
        toast.error("Failed to logout");
        setIsLoggingOut(false);
      }
    } catch (err) {
      toast.error("Network error during logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-16 flex items-center justify-between px-4 lg:px-8 bg-brand-surface/80 backdrop-blur-xl border-b border-border-subtle sticky top-0 z-30"
    >
      
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 -ml-2 text-text-muted hover:text-brand-primary rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
        
        <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile / Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all text-sm font-bold tracking-wide"
        >
          {isLoggingOut ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
          Logout
        </motion.button>
      </div>

    </motion.header>
  );
}
