"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayoutWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Midnight Slate Background Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <Header setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 z-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
