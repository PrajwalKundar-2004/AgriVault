"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CustomerCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestMode, setRequestMode] = useState(null); // 'BUY' or 'SUPPLY'
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        toast.error(data.error || "Failed to load catalog");
      }
    } catch (err) {
      toast.error("Network error fetching catalog");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setRequestMode(mode);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setRequestMode(null);
  };

  const handleSubmit = async () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);
      const requestType = requestMode === 'BUY' ? 'BUYER_ORDER' : 'SUPPLIER_DELIVERY';
      
      const res = await fetch("/api/customer/create-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          requestType,
          quantityRequested: quantity
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully placed ${requestMode === 'BUY' ? 'Order' : 'Delivery Request'}!`);
        closeModal();
      } else {
        toast.error(data.error || "Failed to process request");
      }
    } catch (err) {
      toast.error("Network error submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-500">Warehouse Catalog</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-sm font-medium max-w-2xl transition-colors duration-500">
          Browse our live inventory. You can buy available stock or offer to supply goods we have space for.
        </p>
      </div>

      {/* Filters */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-2 relative z-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors duration-500 shadow-sm"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors duration-500 shadow-sm font-bold appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-16 text-center shadow-md dark:shadow-xl transition-colors duration-500">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner transition-colors duration-500">
             <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-slate-800 dark:text-slate-300 font-bold text-lg transition-colors duration-500">No products match your filters.</p>
          <p className="text-slate-500 mt-2">Try adjusting your search query or category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((prod, idx) => (
            <motion.div
              key={prod._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 300, damping: 24 }}
              className="group relative bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 shadow-inner transition-colors duration-500">
                    {prod.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">{prod.name}</h3>
                
                <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-inner transition-colors duration-500">
                   {/* Buy Side Info */}
                   <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Buy Price:</span>
                      <span className="text-slate-900 dark:text-white font-black transition-colors duration-500">${prod.sellingPrice} <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/ {prod.unit}</span></span>
                   </div>
                   {/* Supply Side Info */}
                   <div className="flex justify-between items-center text-sm py-1 border-t border-slate-200 dark:border-white/5 mt-1 pt-2 transition-colors duration-500">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">We Pay:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black transition-colors duration-500">${prod.costPrice} <span className="text-emerald-700 text-xs font-normal">/ {prod.unit}</span></span>
                   </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => openModal(prod, 'BUY')}
                  disabled={prod.quantity === 0}
                  className="py-3 bg-slate-800 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm flex flex-col items-center justify-center shadow-md hover:shadow-lg"
                >
                  <span>Buy</span>
                  <span className="text-[10px] font-medium text-slate-300 dark:text-slate-400 mt-0.5">{prod.quantity} avail</span>
                </button>
                <button
                  onClick={() => openModal(prod, 'SUPPLY')}
                  disabled={prod.quantity >= prod.maxCapacity}
                  className="py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm flex flex-col items-center justify-center border border-emerald-200 dark:border-emerald-500/20 shadow-sm hover:shadow-md"
                >
                  <span>Supply</span>
                  <span className="text-[10px] font-medium opacity-80 mt-0.5">
                    {prod.maxCapacity - prod.quantity} space
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dynamic Request Modal */}
      <AnimatePresence>
        {selectedProduct && requestMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden relative transition-colors duration-500"
            >
              {/* Decorative top gradient */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${requestMode === 'BUY' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-emerald-400 to-lime-400'}`} />

              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center transition-colors duration-500">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {requestMode === 'BUY' ? 'Purchase Order' : 'Supply Delivery'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedProduct.name}</h4>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${requestMode === 'BUY' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'}`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {requestMode === 'BUY' 
                      ? `${selectedProduct.quantity} ${selectedProduct.unit} available in stock`
                      : `${selectedProduct.maxCapacity - selectedProduct.quantity} ${selectedProduct.unit} available capacity`}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-inner transition-colors duration-500">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Unit Price:</span>
                      <span className="text-slate-900 dark:text-white font-black text-lg transition-colors duration-500">
                        ${requestMode === 'BUY' ? selectedProduct.sellingPrice : selectedProduct.costPrice}
                      </span>
                   </div>
                   <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Estimated Total:</span>
                      <span className={`font-black text-2xl ${requestMode === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        ${(quantity * (requestMode === 'BUY' ? selectedProduct.sellingPrice : selectedProduct.costPrice)).toLocaleString()}
                      </span>
                   </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1">
                    Quantity ({selectedProduct.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={requestMode === 'BUY' ? selectedProduct.quantity : selectedProduct.maxCapacity - selectedProduct.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-5 py-4 text-xl font-black rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-3 transition-colors duration-500 border-t border-slate-100 dark:border-transparent">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || 
                    quantity <= 0 || 
                    (requestMode === 'BUY' && quantity > selectedProduct.quantity) ||
                    (requestMode === 'SUPPLY' && quantity > (selectedProduct.maxCapacity - selectedProduct.quantity))
                  }
                  className={`px-8 py-3 rounded-xl text-sm font-bold text-white dark:text-slate-900 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md ${requestMode === 'BUY' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 hover:shadow-cyan-500/30' : 'bg-gradient-to-r from-emerald-500 to-lime-500 dark:from-emerald-400 dark:to-lime-400 hover:shadow-emerald-500/30'}`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  ) : requestMode === 'BUY' ? "Confirm Purchase" : "Confirm Delivery"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
