"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard Home", path: "/dashboard", icon: "📊" },
    { name: "Pending Approvals", path: "/dashboard/pending", icon: "⏳" },
    { name: "Partner Directory", path: "/dashboard/partners", icon: "👥" },
    { name: "City Explorer", path: "/dashboard/cities", icon: "🏙️" }, // NEW ITEM
    { name: "Payment History", path: "/dashboard/payments", icon: "💳" }, // NEW ITEM
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-black font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black text-white flex flex-col shadow-2xl relative z-10">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter flex items-center gap-1">
            Lagama<span className="text-orange-500">LK</span>
            <span className="w-2 h-2 rounded-full bg-orange-500 mb-4"></span>
          </Link>
          <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Admin Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-semibold ${
                  isActive 
                    ? "bg-orange-500 text-black shadow-md" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={logout} 
            className="w-full bg-transparent border-2 border-gray-700 text-gray-300 p-2 rounded-lg font-bold hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}