"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/customer/my-requests");
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        toast.error(data.error || "Failed to load requests");
      }
    } catch (err) {
      toast.error("Network error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-500">My Requests</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-sm font-medium transition-colors duration-500">
          Track the real-time status of your orders and deliveries.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl shadow-md dark:shadow-xl overflow-hidden p-6 lg:p-8 transition-colors duration-500">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24 text-slate-500 font-medium border border-slate-300 dark:border-white/5 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-800/20 transition-colors duration-500">
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500">
               <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            You haven't placed any requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, idx) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-300 group shadow-sm dark:shadow-none"
              >
                <div className="flex items-start gap-5">
                  <div className={`mt-1 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md dark:shadow-lg ${
                    req.status === 'REJECTED' ? 'bg-gradient-to-br from-red-100 to-rose-50 dark:from-red-500/20 dark:to-rose-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                    req.status === 'APPROVED' ? 'bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                  }`}>
                    {req.status === 'REJECTED' ? (
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : req.status === 'APPROVED' ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                        req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                        'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold">
                        {new Date(req.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-slate-900 dark:text-white font-black text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {req.requestType.replace('_', ' ')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors duration-500">
                      Product: <span className="text-slate-800 dark:text-slate-200 font-bold">{req.productId?.name || 'Unknown'}</span>
                    </p>
                    {req.handledBy && (
                        <p className="text-slate-600 dark:text-slate-500 text-xs mt-2 bg-slate-100 dark:bg-slate-900/50 inline-block px-3 py-1 rounded-md border border-slate-200 dark:border-white/5 transition-colors duration-500">
                        Processed by Staff: <span className="text-slate-800 dark:text-slate-300 font-bold dark:font-medium">{req.handledBy}</span>
                        </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-5 md:mt-0 md:text-right flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 border-slate-200 dark:border-white/5 pt-5 md:pt-0 transition-colors duration-500">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">Quantity</p>
                    <p className={`text-3xl font-black transition-colors duration-500 ${
                      req.status === 'REJECTED' ? 'text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white'
                    }`}>
                      {req.quantityRequested}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
