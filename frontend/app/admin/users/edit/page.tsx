"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BACKEND_URL = "http://localhost:5000/api/users";

function EditUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "user",
  });

  const [loading, setLoading] = useState(() => Boolean(userId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch the current user profile data on load
  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchUserProfile = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }

        if (res.status === 403) {
          router.replace("/dashboard");
          return;
        }

        if (res.status === 404) {
          throw new Error("The selected user record could not be found.");
        }

        if (!res.ok) throw new Error("Failed to pull matching system record.");

        const data = await res.json();
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          username: data.username || "",
          role: data.role || "user",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error loading user profile.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserProfile();
  }, [userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const token = window.localStorage.getItem("token");
    if (!token) return router.replace("/auth/login");

    try {
      const res = await fetch(`${BACKEND_URL}/${userId}`, {
        method: "PUT", // or PATCH depending on your backend routes setup
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
        throw new Error(data.error || "Failed to commit record updates.");
      }

      setSuccess("Account configuration data synchronized successfully!");
      
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected update error occurred.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-sm font-medium text-slate-400">
        Parsing structural user profile records...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-12 text-sm font-medium text-rose-500">
        No valid user ID provided in the web request path.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Edit User Profile</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Modify platform attributes and administrative access roles for this operational account.
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

        {error ? null : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
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
                  className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
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
                  className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
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
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366F1] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-600 disabled:opacity-50"
              >
                {submitting ? "Saving changes..." : "Apply Updates"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary for client-side pages
export default function EditUserPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-medium text-slate-400">Loading component...</div>}>
      <EditUserForm />
    </Suspense>
  );
}