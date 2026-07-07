"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    inventoryCount: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/staff/dashboard");
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        toast.error(data.error || "Failed to load dashboard stats");
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
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Good to see you!</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          Here is a summary of your tasks and activity today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Tasks Assigned", value: loading ? "-" : stats.pendingOrders, trend: "Requires Action" },
          { title: "Inventory Items", value: loading ? "-" : stats.inventoryCount, trend: `${stats.lowStockCount} low stock` },
          { title: "Orders Pending", value: loading ? "-" : stats.pendingOrders, trend: "Needs Processing" },
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

      {/* Activity Feed */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-50 pointer-events-none" />
        <h3 className="text-lg font-bold text-white mb-4 relative z-10">Recent Activity</h3>
        
        {loading ? (
          <div className="flex justify-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : stats.recentActivity.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium relative z-10">
            No recent activity found.
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {stats.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-blue-900/20">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'INCOMING' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {activity.type === 'INCOMING' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {activity.type} <span className="text-slate-400">for</span> {activity.productId?.name || 'Unknown Product'}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">Handled by: {activity.handledBy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">
                    {activity.type === 'INCOMING' ? '+' : '-'}{activity.quantity}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
