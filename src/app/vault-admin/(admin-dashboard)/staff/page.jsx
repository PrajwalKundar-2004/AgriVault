"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (res.ok) setStaffList(data);
      else toast.error("Failed to fetch staff list");
    } catch (err) {
      toast.error("Network error fetching staff");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRemoveStaff = (staff) => {
    // Optimistic UI update
    setStaffList((prev) => prev.filter(s => s._id !== staff._id));

    // Schedule actual deletion
    const timeoutId = setTimeout(async () => {
      try {
        await fetch(`/api/admin/staff/${staff._id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete staff in background", err);
      }
    }, 5000);

    toast.success(`${staff.name} removed`, {
      description: "Staff access revoked.",
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeoutId);
          setStaffList((prev) => [...prev, staff].sort((a, b) => a.name.localeCompare(b.name)));
          toast.success("Action undone, staff member restored!");
        },
      },
      duration: 5000,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/80 p-6 rounded-2xl shadow-sm border border-border-subtle/50 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Staff Management</h1>
          <p className="text-sm text-text-muted mt-1">View active staff members and manage their access.</p>
        </div>
        <div className="bg-brand-bg/50 px-4 py-2 rounded-xl border border-border-subtle/30 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
          <span className="text-sm font-semibold text-text-main">
            {isLoading ? "..." : staffList.length} Active Staff
          </span>
        </div>
      </div>

      {/* Staff Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : staffList.length === 0 ? (
        <div className="bg-brand-surface rounded-2xl p-12 text-center border border-border-subtle/50 shadow-sm">
          <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-border-subtle">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-text-main mb-1">No Staff Members Found</h3>
          <p className="text-text-muted text-sm">Staff members need to register themselves via the Staff Portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {staffList.map((staff) => (
              <motion.div
                key={staff._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-brand-surface rounded-2xl p-6 border border-border-subtle/50 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                {/* Decorative background flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-secondary/20 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-lg tracking-tight">{staff.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-light-emerald"></span>
                        <span className="text-xs font-medium text-text-muted">Staff Member</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveStaff(staff)}
                    className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center text-text-muted hover:bg-light-rose hover:text-dark-rose transition-colors"
                    title="Remove Staff"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-subtle/30">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-brand-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-brand-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>Joined: {new Date(staff.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
