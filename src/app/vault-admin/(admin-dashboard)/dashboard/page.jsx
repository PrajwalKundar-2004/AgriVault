"use client";
import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardOverview() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-main">Welcome back, Admin!</h2>
          <p className="text-text-muted mt-1.5 text-sm font-medium">Here is a real-time overview of your AgriVault system.</p>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Animated Stats Cards */}
        {[
          { title: "Total Users", value: "1,234", trend: "+12%" },
          { title: "Active Staff", value: "48", trend: "0%" },
          { title: "Inventory Alerts", value: "12", trend: "-5%" },
          { title: "System Health", value: "99.9%", trend: "Stable" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-border-subtle/50 p-6 rounded-2xl shadow-xl group"
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-transparent to-transparent opacity-0 group-hover:from-brand-primary/10 group-hover:opacity-100 transition-all duration-500" />
            
            <h3 className="text-sm font-bold text-text-muted tracking-wide uppercase">{stat.title}</h3>
            <div className="mt-3 flex items-baseline gap-3 relative z-10">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text-main to-slate-300 drop-shadow-sm">{stat.value}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : stat.trend.startsWith('-') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-8 bg-brand-surface/40 backdrop-blur-xl border border-border-subtle/50 rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden group shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <svg className="w-12 h-12 text-text-muted mb-3 group-hover:text-brand-primary transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-text-muted font-bold tracking-wide">Interactive Analytics Chart Placeholder</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
