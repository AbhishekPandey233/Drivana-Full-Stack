"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/app/auth/AuthProvider";

interface DashboardStats {
  totalUsers: number;
  totalRentals: number;
  totalEarnings: number;
}

const STATS_API_URL = "http://localhost:5000/api/users/stats";

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalRentals: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = useCallback(() => {
    const token = auth.token;

    if (!token) {
      return null;
    }

    return {
      Authorization: `Bearer ${token}`
    };
  }, [auth.token]);

  const fetchStats = useCallback(async () => {
    try {
      if (auth.status !== "ready") {
        return;
      }

      const headers = getAuthHeaders();

      if (!headers) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(STATS_API_URL, { headers });

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, [auth.status, getAuthHeaders, router]);

  useEffect(() => {
    const load = async () => {
      await fetchStats();
    };
    void load();
  }, [fetchStats]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      {/* Header Action Row */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Overview of key admin metrics</p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-smooth-fast hover:bg-slate-50 hover:shadow-md active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* MAIN STATS METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => router.push("/admin/users")}
          className="card-hover-glow bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer animate-fade-in-up"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#6366F1]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
          <span className="text-4xl font-black text-slate-900 block mt-2 tracking-tight">
            {loading ? "—" : stats.totalUsers}
          </span>
          <span className="text-xs font-medium text-slate-400 block mt-2">All registered users</span>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-purple-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden animate-fade-in-up stagger-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Rentals</span>
          <span className="text-4xl font-black text-slate-900 block mt-2 tracking-tight">
            {loading ? "—" : stats.totalRentals}
          </span>
          <span className="text-xs font-medium text-slate-400 block mt-2">All rentals in the system</span>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-100 p-6 rounded-2xl shadow-sm relative overflow-hidden animate-fade-in-up stagger-2">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Earnings</span>
          <span className="text-4xl font-black text-[#6366F1] block mt-2 tracking-tight">
            {loading ? "—" : `$${stats.totalEarnings}`}
          </span>
          <span className="text-xs font-medium text-slate-400 block mt-2">From paid rentals</span>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            onClick={() => router.push("/admin/users")}
            className="group border border-slate-100 bg-slate-50/60 p-5 rounded-2xl transition-smooth-fast hover:bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#6366F1] transition-colors">User Management</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">View and manage all users</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#6366F1] group-hover:translate-x-1 transition-smooth-fast" strokeWidth={2.25} />
          </div>

          <div
            onClick={() => router.push("/admin/viewRentings")}
            className="group border border-slate-100 bg-slate-50/60 p-5 rounded-2xl transition-smooth-fast hover:bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#6366F1] transition-colors">Rental Management</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">View and manage all rentals</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#6366F1] group-hover:translate-x-1 transition-smooth-fast" strokeWidth={2.25} />
          </div>
        </div>
      </div>
    </div>
  );
}