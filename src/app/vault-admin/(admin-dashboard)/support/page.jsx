"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSupportInbox() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Reply state
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

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    setIsModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTicket(null), 300);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket._id, replyMessage: replyText })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Reply successfully sent to customer!");
        
        // Optimistically update the selected ticket in the modal
        const newMsg = { sender: "ADMIN", text: replyText, createdAt: new Date().toISOString() };
        const updatedTicket = { 
          ...selectedTicket, 
          status: 'RESOLVED', 
          messages: [...(selectedTicket.messages || []), newMsg] 
        };
        setSelectedTicket(updatedTicket);
        
        // Optimistically update the ticket in the main list
        setTickets(prev => prev.map(t => t._id === selectedTicket._id ? updatedTicket : t));
        setReplyText("");
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
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24 text-slate-500 font-medium border border-slate-200 border-dashed rounded-2xl bg-slate-50">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            Inbox is zero! No support tickets have been submitted.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, idx) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                onClick={() => openTicketModal(ticket)}
                className="bg-brand-surface rounded-2xl p-6 border border-border-subtle/50 shadow-sm hover:shadow-md hover:border-brand-primary/40 cursor-pointer transition-all relative overflow-hidden group flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-secondary/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0">
                      {ticket.customerId?.name ? ticket.customerId.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-text-main text-base truncate">{ticket.customerId?.name || 'Unknown User'}</p>
                      <p className="text-xs text-text-muted font-medium truncate">{ticket.customerId?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-text-muted line-clamp-3 mb-4">
                    {ticket.messages && ticket.messages.length > 0 
                      ? ticket.messages[ticket.messages.length - 1].text 
                      : 'No messages'}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-border-subtle/50 flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    ticket.status === 'OPEN' ? 'bg-light-amber text-dark-amber border border-dark-amber/20' : 'bg-light-emerald text-dark-emerald border border-dark-emerald/20'
                  }`}>
                    {ticket.status}
                  </span>
                  
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeTicketModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm">
                    {selectedTicket.customerId?.name ? selectedTicket.customerId.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Message from {selectedTicket.customerId?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedTicket.customerId?.email}</p>
                  </div>
                </div>
                <button type="button" onClick={closeTicketModal} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm border border-slate-100 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Chat Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-brand-bg/50">
                {selectedTicket.messages && selectedTicket.messages.map((msg, i) => (
                  <div key={i}>
                    {msg.sender === 'CUSTOMER' ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                          {new Date(msg.createdAt || selectedTicket.createdAt).toLocaleString()}
                        </span>
                        <div className="bg-brand-surface border border-border-subtle/50 p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[90%] sm:max-w-[85%] relative">
                          <p className="text-sm text-text-main whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1 mt-4">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest pr-1">
                          Support Team Reply • {new Date(msg.createdAt).toLocaleString()}
                        </span>
                        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[90%] sm:max-w-[85%] relative">
                          <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Input Area */}
              <div className="p-4 sm:p-6 border-t border-border-subtle/50 bg-brand-surface shrink-0">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Write a Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-border-subtle focus:ring-2 focus:ring-brand-primary outline-none resize-none bg-brand-bg/50 text-text-main"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-3">
                  <span className="text-xs text-text-muted font-medium">Customer will receive this via email.</span>
                  <button
                    onClick={handleReply}
                    disabled={isSubmitting || !replyText.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
