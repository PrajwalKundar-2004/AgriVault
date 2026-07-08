"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    recent: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/customer/my-requests");
      const data = await res.json();
      if (res.ok) {
        const pending = data.filter(r => r.status === 'PENDING').length;
        const approved = data.filter(r => r.status === 'APPROVED').length;
        setStats({
          total: data.length,
          pending,
          approved,
          recent: data.slice(0, 4) // top 4 most recent
        });
      } else {
        toast.error(data.error || "Failed to load dashboard data");
      }
    } catch (err) {
      toast.error("Network error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-500">Welcome Back!</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm lg:text-base font-medium max-w-2xl transition-colors duration-500">
          Manage your agricultural supply chain efficiently. Track your recent orders and deliveries in real-time.
        </p>
      </motion.div>

      {/* Action Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-500 rounded-3xl p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-emerald-500/20 dark:shadow-2xl border border-emerald-400/30 dark:border-white/10 transition-colors duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">Need to place a new request?</h3>
            <p className="text-emerald-50 text-sm lg:text-base opacity-90">Browse our live warehouse catalog to buy stock or supply goods.</p>
        </div>
        <Link href="/customer/catalog" className="relative z-10 mt-6 md:mt-0 px-8 py-3.5 bg-white text-emerald-700 hover:bg-slate-50 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 whitespace-nowrap">
            View Catalog
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-3">
        {[
          { title: "Total Requests", value: loading ? "-" : stats.total, desc: "Lifetime activity", color: "from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400", lightBg: "bg-blue-50" },
          { title: "Pending Review", value: loading ? "-" : stats.pending, desc: "Awaiting warehouse staff", color: "from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400", lightBg: "bg-amber-50" },
          { title: "Successfully Approved", value: loading ? "-" : stats.approved, desc: "Completed transactions", color: "from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400", lightBg: "bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 lg:p-8 rounded-3xl shadow-md dark:shadow-xl overflow-hidden transition-colors duration-500"
          >
            {/* Hover Glow Effect */}
            <div className={`absolute -inset-px opacity-0 group-hover:opacity-[0.15] bg-gradient-to-r ${stat.color} blur-lg transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-4 transition-colors duration-500">{stat.title}</h3>
              <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </span>
              <p className={`text-xs font-semibold text-slate-600 dark:text-slate-500 mt-3 ${stat.lightBg} dark:bg-white/5 inline-block px-3 py-1 rounded-full transition-colors duration-500`}>{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 shadow-md dark:shadow-xl transition-colors duration-500">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-500">Recent Activity</h3>
            <Link href="/customer/requests" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1">
              View All 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : stats.recent.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-white/5 border-dashed transition-colors duration-500">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500">
               <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M8 16l-4-4 4-4" /></svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium transition-colors duration-500">No recent requests found.</p>
            <p className="text-slate-500 text-sm mt-1">Head to the catalog to place your first order!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {stats.recent.map((req) => (
              <div key={req._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-white/10 transition-colors flex justify-between items-center group">
                <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-transparent' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-transparent' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-transparent'
                    }`}>
                        {req.status}
                    </span>
                    <p className="text-slate-900 dark:text-white font-bold mt-3 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">{req.requestType.replace('_', ' ')}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 transition-colors duration-500">{req.productId?.name || 'Unknown Product'}</p>
                    {req.notes && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 italic line-clamp-1">Note: {req.notes}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-200 transition-colors duration-500">{req.quantityRequested} <span className="text-sm font-medium text-slate-500">{req.productId?.unit}</span></p>
                    <p className="text-[10px] font-medium text-slate-500 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
