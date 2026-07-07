"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SupportModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/customer/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        toast.success("Message sent! Our support team will get back to you soon.");
        setMessage("");
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Network error while sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden relative transition-colors duration-500"
          >
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-lime-400" />

            <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center transition-colors duration-500">
              <div>
                <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white transition-colors duration-500">
                  Contact Support
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  We're here to help. Send us a message!
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-2 transition-colors self-start mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1">
                  How can we help you?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  className="w-full px-5 py-4 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-inner resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white dark:text-slate-900 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md bg-gradient-to-r from-emerald-500 to-lime-500 dark:from-emerald-400 dark:to-lime-400 hover:shadow-emerald-500/30"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  ) : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
