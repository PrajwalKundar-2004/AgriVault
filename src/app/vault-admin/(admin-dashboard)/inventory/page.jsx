"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    maxCapacity: 1,
    unit: "kg",
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) setProducts(data);
      else toast.error("Failed to fetch inventory");
    } catch (err) {
      toast.error("Network error fetching inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      maxCapacity: 1,
      unit: "kg",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      maxCapacity: product.maxCapacity,
      unit: product.unit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingProduct ? "Product updated!" : "Product added!");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to save product");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (product) => {
    // Optimistic UI update
    setProducts((prev) => prev.filter(p => p._id !== product._id));

    // Schedule actual deletion
    const timeoutId = setTimeout(async () => {
      try {
        await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete product in background", err);
      }
    }, 5000);

    toast.success(`${product.name} deleted`, {
      description: "Item removed from inventory.",
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeoutId);
          setProducts((prev) => [...prev, product].sort((a, b) => a.name.localeCompare(b.name)));
          toast.success("Action undone, product restored!");
        },
      },
      duration: 5000,
    });
  };

  const getStockStatus = (quantity, maxCapacity) => {
    if (quantity <= 0) return { label: "Out of Stock", class: "bg-light-rose text-dark-rose border border-dark-rose/20" };
    const ratio = quantity / maxCapacity;
    if (ratio <= 0.2) return { label: "Low Stock", class: "bg-light-amber text-dark-amber border border-dark-amber/20" };
    return { label: "In Stock", class: "bg-light-emerald text-dark-emerald border border-dark-emerald/20" };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/80 p-6 rounded-2xl shadow-sm border border-border-subtle/50 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Inventory Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage warehouse stock, capacities, and pricing.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/30 flex items-center gap-2 hover:bg-brand-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add Product
        </motion.button>
      </div>

      {/* Table section */}
      <div className="bg-brand-surface rounded-2xl shadow-sm border border-border-subtle/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main">
            <thead className="bg-brand-bg/50 text-text-muted font-semibold uppercase tracking-wider text-xs border-b border-border-subtle/50">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock & Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pricing (Cost / Sell)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/30">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                    <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-brand-primary" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product.quantity, product.maxCapacity);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={product._id} 
                      className="hover:bg-brand-bg/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-text-main">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-secondary/30 text-brand-primary border border-brand-primary/20">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{product.quantity}</span>
                          <span className="text-text-muted">/ {product.maxCapacity} {product.unit}</span>
                        </div>
                        <div className="w-full bg-border-subtle/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${status.label === 'Out of Stock' ? 'bg-dark-rose' : status.label === 'Low Stock' ? 'bg-dark-amber' : 'bg-brand-primary'}`} 
                            style={{ width: `${Math.min((product.quantity / product.maxCapacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-text-muted text-xs">Cost: <span className="text-text-main font-medium">${product.costPrice}</span></span>
                          <span className="text-text-muted text-xs">Sell: <span className="text-brand-primary font-bold">${product.sellingPrice}</span></span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(product)} className="p-1.5 text-text-muted hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(product)} className="p-1.5 text-text-muted hover:text-dark-rose hover:bg-light-rose rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-brand-surface rounded-2xl shadow-2xl border border-border-subtle/50 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border-subtle/50 flex items-center justify-between bg-brand-bg/30">
                <h3 className="text-lg font-bold text-text-main">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Product Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" placeholder="e.g., Organic Rice" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Category</label>
                    <input type="text" name="category" required value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" placeholder="e.g., Grains" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Current Stock</label>
                    <input type="number" name="quantity" required min="0" value={formData.quantity} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Max Capacity</label>
                    <input type="number" name="maxCapacity" required min="1" value={formData.maxCapacity} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Cost Price ($)</label>
                    <input type="number" name="costPrice" required min="0" step="0.01" value={formData.costPrice} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Selling Price ($)</label>
                    <input type="number" name="sellingPrice" required min="0" step="0.01" value={formData.sellingPrice} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Unit (e.g., kg, tons, bags)</label>
                    <input type="text" name="unit" required value={formData.unit} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none bg-brand-bg/50 text-sm" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-subtle/50">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-brand-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
