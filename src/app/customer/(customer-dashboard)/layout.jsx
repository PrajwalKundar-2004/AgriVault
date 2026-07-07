import Sidebar from "@/components/customer/Sidebar";
import ThemeToggle from "@/components/customer/ThemeToggle";
import { ThemeProvider } from "@/components/customer/ThemeProvider";
import { Toaster } from "sonner";

export const metadata = {
  title: "AgriVault - Customer Portal",
  description: "Manage your wholesale orders and warehouse deliveries",
};

export default function CustomerDashboardLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 transition-colors duration-500">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Floating Theme Toggle */}
        <ThemeToggle />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0a0f16] text-slate-900 dark:text-slate-200 relative transition-colors duration-500">
          {/* Beautiful Modern Background Orbs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-lime-500/20 dark:bg-lime-500/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10 pt-24 lg:pt-10 min-h-screen flex flex-col">
            {children}
          </div>
        </main>

        {/* Notification Toaster (Supports both modes) */}
        <Toaster 
          position="top-right" 
          toastOptions={{
              className: 'dark:!bg-slate-900/80 !bg-white/80 backdrop-blur-md dark:!text-slate-100 !text-slate-900 dark:!border-white/10 !border-slate-200 shadow-xl',
          }}
        />
      </div>
    </ThemeProvider>
  );
}
