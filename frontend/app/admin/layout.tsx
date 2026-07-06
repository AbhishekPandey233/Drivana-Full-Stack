"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AuthGate from "../navigation/AuthGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Defined routes matching your exact folder structures
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Profile", path: "/admin/profile", icon: "👤" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Create User", path: "/admin/id/edit", icon: "➕" },
    { name: "Vehicles", path: "/admin/vehicles", icon: "🚗" },
    { name: "Create Vehicle", path: "/admin/vehicles/create", icon: "➕" },
    { name: "View Rentings", path: "/admin/viewRentings", icon: "📋" },
  ];

  return (
    <AuthGate allowedRoles={["admin"]} fallbackPath="/auth/login">
      <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
        
        {/* PERSISTENT SIDEBAR NAVBAR */}
        <aside className="w-64 border-r border-slate-200 bg-white px-5 py-7 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
          <div>
            {/* Brand/App Logo */}
            <div className="flex items-center gap-2 px-2 pb-8">
              <Image 
                src="/drivanalogo.png" 
                alt="Divana Logo" 
                width={140} 
                height={40} 
                className="h-9 w-auto object-contain"
                priority
              />
            </div>

            {/* Section Heading */}
            <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Management
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isExactActive = pathname === item.path;
                const isVehiclesSection = item.path === "/admin/vehicles" && pathname.startsWith("/admin/vehicles");
                const isActive = isExactActive || isVehiclesSection;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                      isActive
                        ? "bg-indigo-50 text-[#6366F1]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="mr-2.5">{item.icon}</span>
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Brand Footer Symbol */}
          <div className="px-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              D
            </div>
            <span className="text-xs font-medium text-slate-400">v1.0.0</span>
          </div>
        </aside>

        {/* CHANGING PAGE CONTENT */}
        <main className="flex-1 p-8 lg:p-12 max-w-7xl overflow-y-auto">
          {children}
        </main>

      </div>
    </AuthGate>
  );
}