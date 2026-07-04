"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CustomerLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.user?.name || "there"}!`);
        router.replace("/customer/dashboard");
        router.refresh();
      } else {
        setError(data.message || data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.09 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 sm:px-6 font-sans text-slate-200">
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] bg-green-400/15 rounded-full blur-[110px] pointer-events-none" />

      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-700/50">
        <div className="bg-slate-800/30 py-5 px-5 sm:px-6 text-center relative overflow-hidden border-b border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 to-transparent" />
          <motion.div variants={itemVariants} className="w-11 h-11 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30 relative z-10">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight relative z-10">Welcome Back</motion.h2>
          <motion.p variants={itemVariants} className="text-emerald-400/80 text-xs mt-1 relative z-10 font-medium">Log in to your AgriVault account</motion.p>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleLogin} className="space-y-3">
            {[
              { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
            ].map((field) => (
              <motion.div key={field.name} variants={itemVariants}>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">{field.label}</label>
                <input type={field.type} name={field.name} required value={formData[field.name]} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-800/50 text-white placeholder-slate-500"
                  placeholder={field.placeholder} />
              </motion.div>
            ))}

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm text-center font-bold">{error}</motion.div>
            )}

            <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-xl text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-1">
              {isLoading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Logging in...</>) : "Log In"}
            </motion.button>

            <motion.div variants={itemVariants} className="pt-2 text-center">
              <span className="text-slate-400 text-sm">New to AgriVault? </span>
              <Link href="/customer/register" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors">Create Account</Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
