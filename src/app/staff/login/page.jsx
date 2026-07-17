"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StaffLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretKey: "", // Added for login
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer((prev) => prev - 1), 1000);
    } else if (lockoutTimer === 0 && error && error.includes("Account locked")) {
      setError(""); 
    }
    return () => clearInterval(interval);
  }, [lockoutTimer, error]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back!");
        router.replace("/staff/dashboard");
        router.refresh(); 
      } else {
        if (data.lockUntil) {
          const remainingSeconds = Math.ceil((new Date(data.lockUntil) - new Date()) / 1000);
          setLockoutTimer(remainingSeconds > 0 ? remainingSeconds : 0);
          setError("Account locked due to too many failed attempts.");
        } else {
          setError(data.message || data.error || "Invalid credentials");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 sm:px-6 lg:px-8 font-sans text-slate-200">
      
      {/* Sapphire & Cyan Decorative Blobs for Staff Portal */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-cyan-400/15 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-700/50"
      >
        <div className="bg-slate-800/30 py-5 px-5 sm:px-6 text-center relative overflow-hidden border-b border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent" />
          
          <motion.div variants={itemVariants} className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30 relative z-10">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight relative z-10">Staff Portal</motion.h2>
          <motion.p variants={itemVariants} className="text-cyan-400/80 text-xs mt-1 relative z-10 font-medium">Securely log in to your account</motion.p>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleLogin} className="space-y-3">
            
            <motion.div variants={itemVariants}>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-800/50 text-white placeholder-slate-500 shadow-inner"
                placeholder="staff@agrivault.com"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-800/50 text-white placeholder-slate-500 shadow-inner pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[32px] text-slate-400 hover:text-blue-400 transition-colors">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-xs uppercase tracking-wider font-bold text-cyan-400 mb-2">Company Auth Key</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="secretKey"
                required 
                value={formData.secretKey}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cyan-500/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-cyan-950/30 text-white placeholder-slate-500 shadow-inner pr-10"
                placeholder="Required for login"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[32px] text-cyan-400/70 hover:text-cyan-400 transition-colors">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm text-center font-bold">
                {lockoutTimer > 0 ? `Account locked. Try again in ${Math.floor(lockoutTimer / 60)}:${(lockoutTimer % 60).toString().padStart(2, '0')}` : error}
              </motion.div>
            )}

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Secure Login'}
            </motion.button>
            
            <motion.div variants={itemVariants} className="pt-2 text-center">
              <span className="text-slate-400 text-sm font-medium">Don't have an account? </span>
              <Link href="/staff/register" className="text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors">
                Sign Up
              </Link>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
