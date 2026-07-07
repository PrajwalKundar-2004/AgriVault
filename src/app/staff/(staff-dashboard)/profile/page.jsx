"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function StaffProfile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/staff/logout", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.replace("/staff/login");
        router.refresh();
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      toast.error("Network error during logout");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-10">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Your Profile</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          Manage your account and active sessions.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1">Staff Member</h3>
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/20 mb-8">
            Authorized Personnel
          </span>

          <div className="w-full space-y-4">
            <div className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Role Access Level</p>
                <p className="text-slate-300 font-medium">Inventory & Order Processing</p>
              </div>
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>

            <div className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Security Status</p>
                <p className="text-slate-300 font-medium">Session is secured (JWT)</p>
              </div>
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="mt-8 w-full md:w-auto px-10 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Secure Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
