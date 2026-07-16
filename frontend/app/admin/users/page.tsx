"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthProvider";

interface User {
  _id: string; 
  fullName: string; 
  email: string;
  role: string;
}

const BACKEND_URL = "http://localhost:5000/api/users"; 

export default function UsersPage() {
  const router = useRouter();
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null; userName: string }>({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const getAuthHeaders = useCallback(() => {
    const token = auth.token;

    if (!token) {
      return null;
    }

    return {
      Authorization: `Bearer ${token}`
    };
  }, [auth.token]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      if (auth.status !== "ready") {
        return;
      }

      const headers = getAuthHeaders();

      if (!headers) {
        // Admin pages are already wrapped by the route guard; this is the data-layer fallback.
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(BACKEND_URL, { headers });

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (res.status === 403) {
        // The backend middleware rejected a non-admin token, so send the user back to the standard dashboard.
        router.replace("/dashboard");
        return;
      }

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching live users:", err);
    } finally {
      setLoading(false);
    }
  }, [auth.status, getAuthHeaders, router]);

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
    };
    void load();
  }, [fetchUsers]);

  // Opens the stylized theme-matching modal instead of native pop-ups
  const openDeleteConfirmation = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      userId: id,
      userName: name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
  };

  const confirmAndExecuteDelete = async () => {
    const id = deleteModal.userId;
    if (!id) return;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE",
        headers
      });

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }

      if (res.ok) {
        setUsers(users.filter(user => user._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="relative">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Users</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Managing <span className="text-slate-800 font-bold">{users.length}</span> active live accounts
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchUsers}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm font-medium text-slate-400">
            Fetching records from database...
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-4 pl-4">Member</th>
                  <th className="pb-4 text-center">Status / Role</th>
                  <th className="pb-4 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {users.map((user) => (
                  <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-600 text-sm flex items-center justify-center uppercase shadow-inner shrink-0">
                        {user.fullName?.charAt(0) || "?"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 text-sm truncate">{user.fullName || "No Name Provided"}</span>
                        <span className="text-xs text-slate-400 font-medium truncate">{user.email}</span>
                        <span className="text-[10px] text-slate-300 font-mono tracking-tight mt-0.5">ID: {user._id}</span>
                      </div>
                    </td>

                    <td className="py-4 text-center align-middle">
                      <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wider bg-slate-100 text-slate-500 border border-slate-200/50">
                        {user.role || "USER"}
                      </span>
                    </td>

                    <td className="py-4 pr-4 text-right align-middle">
                      <div className="inline-flex items-center gap-2">
                        <button
                           onClick={() => router.push(`/admin/users/edit?id=${user._id}`)}
                               className="text-xs font-bold bg-indigo-50 text-[#6366F1] hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                                  >
                                 Edit
                        </button>
                        <button 
                          onClick={() => openDeleteConfirmation(user._id, user.fullName)}
                          className="text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-sm font-medium text-slate-400">
                No registered accounts found in the database.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Styled Theme-Matching Modal Backed Overdrop Overlay */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full border border-slate-100 rounded-[24px] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] transform scale-100 transition-all">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-rose-50 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Delete System Account?
            </h3>
            <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to delete the user account belonging to <span className="font-bold text-slate-700">{deleteModal.userName}</span>? This structural change is irreversible.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndExecuteDelete}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}