"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthProvider";

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  username?: string;
  role: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const auth = useAuth();

  const loading = auth.status !== "ready";

  const admin = useMemo<AdminUser | null>(() => {
    if (!auth.user || auth.role !== "admin") {
      return null;
    }

    return {
      _id: auth.user.id || "",
      fullName: auth.user.fullName || "Admin",
      email: auth.user.email || "",
      username: auth.user.username,
      role: auth.user.role || "admin"
    };
  }, [auth.role, auth.user]);

  useEffect(() => {
    if (auth.status !== "ready") {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (auth.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [auth.isAuthenticated, auth.role, auth.status, router]);

  const handleLogout = () => {
    auth.logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-sm font-medium text-slate-400">
        Resolving administrative session records...
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-md mx-auto mt-12 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">
        Unauthorized session interface context rejection.
      </div>
    );
  }

  const initialLetter = admin.fullName?.charAt(0).toUpperCase() || "A";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        
        {/* Header Block Section */}
        <div className="flex flex-col items-center border-b border-slate-100 pb-8 md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-black text-white shadow-md">
              {initialLetter}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {admin.fullName || "Administrative Profile"}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-400">
                {admin.email}
              </p>
              <span className="mt-3 inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold font-mono tracking-wide text-[#6366F1]">
                {admin.role ? admin.role.toUpperCase() : "ADMIN"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Meta Information Inputs */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={admin.fullName}
              readOnly
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 bg-slate-50/50 focus:outline-none select-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={admin.email}
              readOnly
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 bg-slate-50/50 focus:outline-none select-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Assigned Security Role
            </label>
            <input
              type="text"
              value={admin.role}
              readOnly
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 bg-slate-50/50 focus:outline-none select-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Admin ID
            </label>
            <input
              type="text"
              value={admin._id}
              readOnly
              className="w-full h-11 px-4 text-sm font-mono rounded-xl border border-slate-200 text-slate-400 bg-slate-50/50 focus:outline-none select-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Action Controls Footer Row */}
        <div className="mt-10 flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 px-5 text-xs font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-100"
          >
            Logout Session
          </button>

          {/* 2. Routes dynamically to your specific user edit URL structure */}
          <button
            type="button"
            onClick={() => router.push(`/admin/users/edit?id=${admin._id}`)}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366F1] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-600"
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
}