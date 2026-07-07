"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function StaffInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        toast.error(data.error || "Failed to load inventory");
      }
    } catch (error) {
      toast.error("Network error fetching inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Warehouse Inventory</h2>
        <p className="text-slate-400 mt-1.5 text-sm font-medium">
          View current stock levels across all products.
        </p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-900/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-blue-900/30">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Product Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Available Stock</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Max Capacity</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 font-medium">
                    No products found in the warehouse.
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-blue-900/20 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-white">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.unit}</td>
                    <td className="px-6 py-4 font-bold text-right text-white">{product.quantity}</td>
                    <td className="px-6 py-4 text-right text-slate-400">{product.maxCapacity}</td>
                    <td className="px-6 py-4 text-center">
                      {product.quantity === 0 ? (
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">Out of Stock</span>
                      ) : product.quantity < 10 ? (
                        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">Low Stock</span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">In Stock</span>
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
  );
}
