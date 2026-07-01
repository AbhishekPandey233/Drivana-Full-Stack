"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 1. MUST use 'export default' here!
export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = window.localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to establish database registration.");
      }

      setSuccess("Account structural record committed successfully!");
      
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected system error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create User</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Register and configure a new system profile with explicit role permissions.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. Abhishek Pandey"
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="abhishek_23"
                className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">System Role Assignment</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-11 px-4 text-sm font-bold rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="user">User (Standard Account Privilege)</option>
              <option value="admin">Admin (Full Control Access Dashboard)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366F1] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Registering profile..." : "Save User Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}