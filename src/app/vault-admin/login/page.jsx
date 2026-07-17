"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { toast } from "sonner";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretKey: "",
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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully!");
        router.replace("/vault-admin/dashboard");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg relative overflow-hidden px-4 font-sans text-text-main">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-72 h-72 bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[380px] bg-brand-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-border-subtle"
      >
        <div className="bg-slate-950 py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent" />
          
          {/* Logo Container */}
          <div className="w-12 h-12 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/30 relative z-10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-main tracking-tight relative z-10">AgriVault Admin</h2>
          <p className="text-text-muted text-xs mt-1.5 relative z-10">Authorized personnel only</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-bg/50 text-text-main"
                placeholder="admin@agrivault.com"
              />
            </div>

            <div className="relative">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1.5">Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-bg/50 text-text-main pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[32px] text-text-muted hover:text-brand-primary transition-colors">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>

            <div className="relative">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1.5">Security Key</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="secretKey"
                required 
                value={formData.secretKey}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-bg/50 text-text-main pr-10"
                placeholder="Enter Secret Key"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[32px] text-text-muted hover:text-brand-primary transition-colors">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm text-center font-bold"
              >
                {lockoutTimer > 0 ? `Account locked. Try again in ${Math.floor(lockoutTimer / 60)}:${(lockoutTimer % 60).toString().padStart(2, '0')}` : error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2.5 cursor-pointer bg-brand-primary text-white rounded-lg text-sm font-bold tracking-wide hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Secure Login'}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
