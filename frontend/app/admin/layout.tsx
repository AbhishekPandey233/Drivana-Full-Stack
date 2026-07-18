"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Users, Plus, Car, ClipboardList } from "lucide-react";
import AuthGate from "../navigation/AuthGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Defined routes matching your exact folder structures
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/admin/profile", icon: User },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Create User", path: "/admin/id/edit", icon: Plus },
    { name: "Vehicles", path: "/admin/vehicles", icon: Car },
    { name: "Create Vehicle", path: "/admin/vehicles/create", icon: Plus },
    { name: "View Rentings", path: "/admin/viewRentings", icon: ClipboardList },
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
                    className={`group w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-smooth-fast ${
                      isActive
                        ? "bg-indigo-50 text-[#6366F1] shadow-[inset_3px_0_0_0_#6366F1]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5"
                    }`}
                  >
                    <item.icon className="mr-2.5 w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.25} />
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
        <main key={pathname} className="flex-1 p-8 lg:p-12 max-w-7xl overflow-y-auto animate-fade-in">
          {children}
        </main>

      </div>
    </AuthGate>
  );
}