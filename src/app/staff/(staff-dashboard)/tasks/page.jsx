"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function StaffTasks() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/staff/my-tasks");
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      } else {
        toast.error(data.error || "Failed to load task history");
      }
    } catch (error) {
      toast.error("Network error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Transaction History</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          A permanent ledger of all processed orders and inventory movements.
        </p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 rounded-2xl shadow-xl overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((txn, idx) => (
              <motion.div
                key={txn._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-slate-900/50 border border-blue-900/20 hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    txn.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                    txn.type === 'INCOMING' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {txn.status === 'REJECTED' ? (
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : txn.type === 'INCOMING' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        txn.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {txn.status}
                      </span>
                      <span className="text-slate-500 text-xs font-medium">
                        {new Date(txn.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-white font-bold text-base">
                      {txn.type} <span className="text-slate-400 font-normal">for</span> {txn.productId?.name || 'Unknown'}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Entity: <span className="text-slate-200">{txn.customerOrSupplier}</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Notes: <span className="text-slate-300 italic">"{txn.notes}"</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 border-blue-900/30 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Quantity</p>
                    <p className={`text-xl font-black ${
                      txn.status === 'REJECTED' ? 'text-slate-500' :
                      txn.type === 'INCOMING' ? 'text-emerald-400' : 'text-purple-400'
                    }`}>
                      {txn.status === 'REJECTED' ? '0' : txn.type === 'INCOMING' ? '+' : '-'}{txn.quantity}
                    </p>
                  </div>
                  <div className="text-right mt-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Handled By</p>
                    <p className="text-sm text-cyan-300 font-medium">{txn.handledBy}</p>
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
