"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      {/* Header Action Row */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Overview of key admin metrics</p>
        </div>
        <button className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
          Refresh
        </button>
      </div>

      {/* MAIN STATS METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => router.push("/admin/users")}
          className="bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#6366F1]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
          <span className="text-4xl font-black text-slate-900 block mt-2 tracking-tight">5</span>
          <span className="text-xs font-medium text-slate-400 block mt-2">Non-admin registered users</span>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-purple-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Bookings</span>
          <span className="text-4xl font-black text-slate-900 block mt-2 tracking-tight">0</span>
          <span className="text-xs font-medium text-slate-400 block mt-2">All bookings in the system</span>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Earnings</span>
          <span className="text-4xl font-black text-[#6366F1] block mt-2 tracking-tight">$0</span>
          <span className="text-xs font-medium text-slate-400 block mt-2">From confirmed bookings</span>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div 
            onClick={() => router.push("/admin/users")}
            className="group border border-slate-100 bg-slate-50/60 p-5 rounded-2xl transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#6366F1] transition-colors">User Management</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">View and manage all users</p>
            </div>
            <span className="text-slate-300 group-hover:text-[#6366F1] transition-colors text-sm font-bold">➔</span>
          </div>

          <div className="group border border-slate-100 bg-slate-50/60 p-5 rounded-2xl transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#6366F1] transition-colors">Booking Management</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">View and manage all bookings</p>
            </div>
            <span className="text-slate-300 group-hover:text-[#6366F1] transition-colors text-sm font-bold">➔</span>
          </div>
        </div>
      </div>
    </div>
  );
}