"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

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
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeStaff: 0,
    inventoryAlerts: 0,
    openTickets: 0
  });
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
        setChartData(data.chartData);
        setCategoryData(data.categoryData || []);
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-main">Welcome back, Admin!</h2>
          <p className="text-text-muted mt-1.5 text-sm font-medium">Here is a real-time overview of your AgriVault system.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <>
          <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Animated Stats Cards */}
            {[
              { title: "Total Customers", value: metrics.totalUsers, trend: "Live" },
              { title: "Active Staff", value: metrics.activeStaff, trend: "Live" },
              { title: "Inventory Alerts", value: metrics.inventoryAlerts, trend: "Stock < 10" },
              { title: "Open Tickets", value: metrics.openTickets, trend: "Live" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-border-subtle/50 p-6 rounded-2xl shadow-xl group flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-transparent to-transparent opacity-0 group-hover:from-brand-primary/10 group-hover:opacity-100 transition-all duration-500" />
                
                <h3 className="text-sm font-bold text-text-muted tracking-wide uppercase">{stat.title}</h3>
                <div className="mt-3 flex items-baseline gap-3 relative z-10">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text-main to-slate-400 drop-shadow-sm">{stat.value}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 uppercase rounded-full ${stat.title === 'Inventory Alerts' && stat.value > 0 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <motion.div 
              variants={itemVariants}
              className="bg-brand-surface/40 backdrop-blur-xl border border-border-subtle/50 rounded-3xl p-6 shadow-xl lg:col-span-2"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-main">Transaction Volume (Last 7 Days)</h3>
                <p className="text-sm text-text-muted font-medium">Overview of incoming and outgoing inventory quantities.</p>
              </div>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 1)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area 
                      type="monotone" 
                      dataKey="incoming" 
                      name="Incoming Stock" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorIncoming)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outgoing" 
                      name="Outgoing Stock" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorOutgoing)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-brand-surface/40 backdrop-blur-xl border border-border-subtle/50 rounded-3xl p-6 shadow-xl lg:col-span-1 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-main">Inventory Composition</h3>
                <p className="text-sm text-text-muted font-medium">Distribution of stock by category.</p>
              </div>
              
              <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
                {categoryData && categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(226, 232, 240, 1)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        itemStyle={{ fontWeight: 600, color: '#1e293b' }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M12 20V4" /></svg>
                    <p className="text-sm font-medium">No inventory data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
