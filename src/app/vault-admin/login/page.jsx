"use client";
import React, { useState } from "react";
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
  const router = useRouter();

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
        setError(data.message || data.error || "Invalid credentials");
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

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1.5">Password</label>
              <input 
                type="password"
                name="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-bg/50 text-text-main"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1.5">Security Key</label>
              <input 
                type="password" 
                name="secretKey"
                required 
                value={formData.secretKey}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-brand-bg/50 text-text-main"
                placeholder="Enter Secret Key"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-red-950/50 text-red-400 border border-red-900/50 rounded-lg text-xs text-center font-semibold"
              >
                {error}
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
