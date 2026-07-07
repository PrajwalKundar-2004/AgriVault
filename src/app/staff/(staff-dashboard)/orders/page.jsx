"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function StaffOrders() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Modal State
  const [staffName, setStaffName] = useState("");
  const [transactionNotes, setTransactionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) {
        // Filter to only show PENDING requests for the staff to process
        setRequests(data.filter((r) => r.status === "PENDING"));
      } else {
        toast.error(data.error || "Failed to fetch requests");
      }
    } catch (err) {
      toast.error("Network error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setStaffName("");
    setTransactionNotes("");
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const handleProcess = async (action) => {
    if (!staffName.trim()) {
      toast.error("Please enter your Staff Name.");
      return;
    }
    if (!transactionNotes.trim()) {
      toast.error("Transaction notes are required for the log.");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch(`/api/requests/${selectedRequest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          staffName,
          notes: transactionNotes,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Order ${action === "APPROVED" ? "approved" : "rejected"} successfully!`);
        closeModal();
        fetchRequests();
      } else {
        toast.error(data.error || "Failed to process request");
      }
    } catch (err) {
      toast.error("Network error while processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Pending Orders</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          Review and process customer orders or supplier deliveries based on inventory.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-800/40 border border-blue-900/30 rounded-2xl p-10 text-center shadow-xl">
          <p className="text-slate-400 font-bold">No pending orders at the moment!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((req) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/40 backdrop-blur-md border border-blue-900/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      req.requestType === "BUYER_ORDER"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {req.requestType.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white truncate">{req.entityName}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Product:</span>
                    <span className="text-slate-200 font-medium truncate ml-2">
                      {req.productId ? req.productId.name : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Quantity Req:</span>
                    <span className="text-cyan-400 font-bold">
                      {req.quantityRequested} {req.productId?.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Stock Avail:</span>
                    <span className="text-slate-200 font-medium">
                      {req.productId ? req.productId.quantity : 0} {req.productId?.unit}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openModal(req)}
                className="mt-6 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold rounded-lg border border-blue-500/30 transition-all text-sm"
              >
                Process Request
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Processing Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-blue-900/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-blue-900/30 bg-blue-950/30 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Process Request</h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Stock Warning Logic */}
                {selectedRequest.productId && (
                  <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
                    {selectedRequest.requestType === "BUYER_ORDER" && selectedRequest.quantityRequested > selectedRequest.productId.quantity ? (
                      <div className="flex items-center text-red-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Insufficient stock! You cannot approve this order.
                      </div>
                    ) : selectedRequest.requestType === "SUPPLIER_DELIVERY" && selectedRequest.quantityRequested > (selectedRequest.productId.maxCapacity - selectedRequest.productId.quantity) ? (
                      <div className="flex items-center text-orange-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Warehouse capacity exceeded! Cannot approve.
                      </div>
                    ) : (
                      <div className="flex items-center text-emerald-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Stock levels are sufficient to approve this request.
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Your Name (Staff)
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-blue-900/50 bg-slate-900/50 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Transaction Log Notes
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                    placeholder="Log details for the admin (e.g. Verified with supplier, stock checked)"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-blue-900/50 bg-slate-900/50 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-5 border-t border-blue-900/30 bg-slate-900/80 flex justify-end gap-3">
                <button
                  onClick={() => handleProcess("REJECTED")}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => handleProcess("APPROVED")}
                  disabled={
                    isProcessing ||
                    (selectedRequest.requestType === "BUYER_ORDER" && selectedRequest.productId && selectedRequest.quantityRequested > selectedRequest.productId.quantity) ||
                    (selectedRequest.requestType === "SUPPLIER_DELIVERY" && selectedRequest.productId && selectedRequest.quantityRequested > (selectedRequest.productId.maxCapacity - selectedRequest.productId.quantity))
                  }
                  className="px-4 py-2 rounded-lg text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Approve Order"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
