"use client";
import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function StaffDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Good to see you!</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          Here is a summary of your tasks and activity today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Tasks Assigned", value: "8", trend: "2 due today" },
          { title: "Inventory Items", value: "124", trend: "3 low stock" },
          { title: "Orders Pending", value: "5", trend: "+2 new" },
          { title: "Profile Status", value: "Active", trend: "Verified" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 p-6 rounded-2xl shadow-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-transparent to-transparent opacity-0 group-hover:from-blue-600/10 group-hover:opacity-100 transition-all duration-500" />
            <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">{stat.title}</h3>
            <div className="mt-3 flex items-baseline gap-3 z-10 relative">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                {stat.value}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Placeholder */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden group shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <svg
            className="w-12 h-12 text-slate-600 mb-3 group-hover:text-cyan-400 transition-colors duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-slate-500 font-bold tracking-wide">Activity Feed Placeholder</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
