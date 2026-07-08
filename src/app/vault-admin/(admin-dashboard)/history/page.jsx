"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState(new Set());
  const tableRef = useRef(null);

  const scrollTable = (direction) => {
    if (tableRef.current) {
      const scrollAmount = 300;
      tableRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleNote = (id) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/transactions/history");
      const data = await res.json();
      if (res.ok) {
        setLogs(data.historyLogs || []);
      } else {
        toast.error("Failed to fetch transaction history");
      }
    } catch (err) {
      toast.error("Network error fetching history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getTypeStyle = (type, status) => {
    if (status === "REJECTED") {
      return "bg-light-rose text-dark-rose border-dark-rose/20";
    }
    switch (type) {
      case "INCOMING":
        return "bg-light-emerald text-dark-emerald border-dark-emerald/20";
      case "OUTGOING":
        return "bg-light-amber text-dark-amber border-dark-amber/20";
      default:
        return "bg-brand-bg text-text-muted border-border-subtle";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[95%] lg:max-w-[100%] mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/80 p-5 rounded-2xl shadow-sm border border-border-subtle/50 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Transaction History</h1>
          <p className="text-sm text-text-muted mt-1">Audit log of all incoming and outgoing warehouse movements.</p>
        </div>
        <button
          onClick={fetchHistory}
          className="bg-brand-bg/50 px-4 py-2 rounded-xl border border-border-subtle/30 text-sm font-medium text-text-main hover:bg-brand-bg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh Logs
        </button>
      </div>

      {/* History Table */}
      <div className="relative group/table w-full">
        {/* Sticky Scroll Arrows */}
        <div className="sticky top-[50vh] z-20 w-full h-0 flex justify-between px-2 pointer-events-none -translate-y-1/2 hidden sm:flex">
          <button
            onClick={() => scrollTable('left')}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-brand-surface/90 backdrop-blur-md border border-border-subtle/50 rounded-full shadow-xl text-text-main opacity-0 group-hover/table:opacity-100 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-110 transition-all duration-300 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scrollTable('right')}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-brand-surface/90 backdrop-blur-md border border-border-subtle/50 rounded-full shadow-xl text-text-main opacity-0 group-hover/table:opacity-100 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-110 transition-all duration-300 mr-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="bg-brand-surface rounded-2xl shadow-sm border border-border-subtle/50 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide" ref={tableRef}>
            <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
              <thead className="bg-brand-bg/50 text-text-muted font-semibold uppercase tracking-wider text-[11px] border-b border-border-subtle/50">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/30 text-xs sm:text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                      <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-brand-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading transaction history...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                      No transactions found in the database.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={log._id}
                      className="hover:bg-brand-bg/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-text-main">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs text-text-muted">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border ${getTypeStyle(log.type, log.status)}`}>
                          <div className="flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            {log.type === "INCOMING" && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>}
                            {log.type === "OUTGOING" && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                            {log.type}
                          </div>
                          <div className="text-[9px] font-semibold opacity-80 mt-0.5">
                            ({log.status === "REJECTED" ? "Rejected" : "Accepted"})
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {log.productId ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-text-main">{log.productId.name}</span>
                            <span className="text-xs text-brand-primary">{log.quantity} {log.productId.unit}</span>
                          </div>
                        ) : (
                          <span className="text-text-muted italic">Product Deleted</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-main">
                        {log.customerOrSupplier}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-[10px] font-bold">
                            {log.handledBy.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-text-muted">{log.handledBy}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-sm max-w-[200px] whitespace-normal break-words">
                        {log.notes ? (
                          expandedNotes.has(log._id) || log.notes.length <= 40 ? (
                            <div>
                              {log.notes}
                              {log.notes.length > 40 && (
                                <button onClick={() => toggleNote(log._id)} className="ml-1 text-brand-primary font-bold text-xs hover:underline inline-block">
                                  Less
                                </button>
                              )}
                            </div>
                          ) : (
                            <div>
                              {log.notes.substring(0, 40)}...
                              <button onClick={() => toggleNote(log._id)} className="ml-1 text-brand-primary font-bold text-xs hover:underline inline-block">
                                More
                              </button>
                            </div>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
