"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CustomerProfile() {
  const router = useRouter();
  const [identity, setIdentity] = useState({ name: "Loading...", email: "" });

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const res = await fetch("/api/customer/me");
        if (res.ok) {
          const data = await res.json();
          setIdentity(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile info");
      }
    };
    fetchIdentity();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/customer/logout", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.replace("/customer/login");
        router.refresh();
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      toast.error("Network error during logout");
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto mt-4 lg:mt-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 transition-colors duration-500">Account Settings</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium transition-colors duration-500">
          Manage your enterprise profile and active sessions.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] p-6 lg:p-8 relative overflow-hidden transition-colors duration-500"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

        <div className="flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full p-1.5 mb-4 shadow-xl dark:shadow-2xl dark:shadow-emerald-500/10 border border-slate-200 dark:border-white/5 transition-colors duration-500">
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-lime-500 dark:from-emerald-500 dark:to-lime-400 rounded-full flex items-center justify-center">
              <span className="text-3xl font-black text-white dark:text-slate-900 uppercase tracking-widest">
                {identity.name !== "Loading..." ? identity.name.charAt(0) : "?"}
              </span>
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 transition-colors duration-500">{identity.name}</h3>
          {identity.email && <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3 transition-colors duration-500">{identity.email}</p>}
          <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-6 transition-colors duration-500">
            Verified Partner
          </span>

          <div className="w-full space-y-3">
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-300 dark:hover:border-white/10 transition-colors duration-500">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 transition-colors duration-500">Account Type</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold transition-colors duration-500">Buyer / Supplier</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-500">
                 <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-300 dark:hover:border-white/10 transition-colors duration-500">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 transition-colors duration-500">Security Status</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold transition-colors duration-500">Session is secured</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-500">
                 <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="mt-8 w-full px-8 py-3 bg-red-50 hover:bg-red-100 dark:bg-gradient-to-r dark:from-red-500/10 dark:to-rose-500/10 dark:hover:from-red-500/20 dark:hover:to-rose-500/20 text-red-600 dark:text-red-400 font-bold rounded-2xl border border-red-200 dark:border-red-500/20 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm dark:hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Secure Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
