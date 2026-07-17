"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const features = [
    {
      title: "View Our Products",
      description: "Look through our list of farming goods like seeds, fertilizers, and tools. You can see the prices and check if they are in stock right now.",
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Order in Bulk",
      description: "Easily order large amounts of goods online. We take care of the heavy lifting and shipping so you don't have to worry.",
      icon: (
        <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Track Your Orders",
      description: "Check on your orders at any time. You can see when your order is accepted, being packed, and ready to be delivered to you.",
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Keep Your Data Safe",
      description: "Your account is locked tight. We use email codes (OTP) and strict passwords to make sure nobody else can log into your account.",
      icon: (
        <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header Section */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="text-center space-y-4 pt-4 lg:pt-10">
        <motion.div variants={itemVariants} className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 rounded-2xl mb-2 border border-emerald-500/20">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-400">AgriVault</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          The next-generation wholesale agricultural distribution platform designed to connect farmers, suppliers, and distributors seamlessly.
        </motion.p>
      </motion.div>

      {/* Intro Card */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-6">
        <motion.div variants={itemVariants} className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">What is AgriVault?</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg relative z-10">
            AgriVault makes it easy for farmers and businesses to buy farming supplies in large amounts. Instead of making phone calls or using messy paperwork, you can just use our website to buy exactly what you need. We connect you directly with the warehouses so you get your supplies faster and safer.
          </p>
        </motion.div>
      </motion.div>

      {/* How it Works Section */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="pt-6">
        <motion.h3 variants={itemVariants} className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-2">
          How to Use This Website
        </motion.h3>
        <div className="space-y-4">
          {[
            { step: "1", title: "Find What You Need", text: "Click on 'Market Catalog' on the left menu. Here you will see a list of all the farming products we sell." },
            { step: "2", title: "Place Your Request", text: "When you see something you want, type in how much you need and click the submit button. This sends your order straight to our staff." },
            { step: "3", title: "Wait for Approval", text: "Our staff will look at your order to make sure we have enough in stock. You can check the 'My Requests' page to see if they said Yes or No." },
            { step: "4", title: "Get Your Delivery", text: "Once your order is approved, we will pack it up and send it to you!" }
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="flex gap-4 items-start p-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {item.step}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="pt-6">
        <motion.h3 variants={itemVariants} className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-2">
          Platform Features
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}
              className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors shadow-lg hover:shadow-xl group"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Footer / Contact Hook */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="pt-10">
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-500 to-lime-500 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-overlay" />
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Ready to grow with us?</h2>
          <p className="text-emerald-50 mb-6 max-w-xl mx-auto relative z-10">
            Start browsing our market catalog today and experience the future of agricultural wholesale distribution.
          </p>
          <motion.a 
            href="/customer/catalog"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Explore Catalog
          </motion.a>
        </motion.div>
      </motion.div>

    </div>
  );
}
