"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSupportInbox() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      if (res.ok) {
        setTickets(data);
      } else {
        toast.error(data.error || "Failed to load support tickets");
      }
    } catch (err) {
      toast.error("Network error fetching support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, replyMessage: replyText })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Reply successfully sent to customer!");
        setActiveReplyId(null);
        setReplyText("");
        fetchTickets();
      } else {
        toast.error(data.error || "Failed to send reply");
      }
    } catch (err) {
      toast.error("Network error while sending reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Support Inbox</h2>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">
          View and manage support messages submitted by customers.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24 text-slate-500 font-medium border border-slate-200 border-dashed rounded-2xl bg-slate-50">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            Inbox is zero! No support tickets have been submitted.
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket, idx) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black">
                      {ticket.customerId?.name ? ticket.customerId.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{ticket.customerId?.name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500 font-medium">{ticket.customerId?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {ticket.message}
                  </p>
                </div>

                {/* Reply Section */}
                {ticket.status !== 'RESOLVED' ? (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    {activeReplyId === ticket._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply to the customer..."
                          rows={3}
                          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText("");
                            }}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(ticket._id)}
                            disabled={isSubmitting || !replyText.trim()}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? "Sending..." : "Send Reply Email"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveReplyId(ticket._id);
                          setReplyText("");
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        Reply to Customer
                      </button>
                    )}
                  </div>
                ) : (
                  ticket.adminNotes && (
                    <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 border-l-4 border-l-emerald-500">
                      <p className="text-[10px] uppercase font-black tracking-wider text-emerald-800 mb-1">Your Reply:</p>
                      <p className="text-sm text-emerald-900 whitespace-pre-wrap">{ticket.adminNotes}</p>
                    </div>
                  )
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
