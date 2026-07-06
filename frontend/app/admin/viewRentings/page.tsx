"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthProvider";

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
}

interface Renting {
  _id: string;
  user: User;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const BACKEND_URL = "http://localhost:5000/api/rentings/admin/all";

export default function AdminViewRentingsPage() {
  const router = useRouter();
  const auth = useAuth();
  const [rentals, setRentals] = useState<Renting[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; rentalId: string | null; vehicleName: string }>({
    isOpen: false,
    rentalId: null,
    vehicleName: "",
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

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      if (auth.status !== "ready") {
        return;
      }

      const headers = getAuthHeaders();

      if (!headers) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(BACKEND_URL, { headers });

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
      setRentals(data);
    } catch (err) {
      console.error("Error fetching rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [auth.status, getAuthHeaders, router]);

  useEffect(() => {
    const load = async () => {
      await fetchRentals();
    };
    void load();
  }, [fetchRentals]);

  const openCancelConfirmation = (rentalId: string, vehicleName: string) => {
    setCancelModal({
      isOpen: true,
      rentalId,
      vehicleName,
    });
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, rentalId: null, vehicleName: "" });
  };

  const confirmAndExecuteCancel = async () => {
    const id = cancelModal.rentalId;
    if (!id) return;

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/rentings/admin/${id}/cancel`, {
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
        setRentals(rentals.filter(rental => rental._id !== id));
      }
    } catch (err) {
      console.error("Failed to cancel rental:", err);
    } finally {
      closeCancelModal();
    }
  };

  return (
    <div className="relative">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Rental Transactions</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Managing <span className="text-slate-800 font-bold">{rentals.length}</span> active rental records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRentals}
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
                  <th className="pb-4 pl-4">User</th>
                  <th className="pb-4">Vehicle</th>
                  <th className="pb-4 text-center">Rental Period</th>
                  <th className="pb-4 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {rentals.map((rental) => (
                  <tr key={rental._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-600 text-sm flex items-center justify-center uppercase shadow-inner shrink-0">
                        {rental.user.fullName?.charAt(0) || "?"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 text-sm truncate">{rental.user.fullName || "No Name Provided"}</span>
                        <span className="text-xs text-slate-400 font-medium truncate">{rental.user.email}</span>
                        <span className="text-[10px] text-slate-300 font-mono tracking-tight mt-0.5">ID: {rental._id}</span>
                      </div>
                    </td>

                    <td className="py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{rental.vehicle.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{rental.vehicle.type}</span>
                        <span className="text-[10px] text-slate-300 font-mono mt-0.5">Price: ${rental.vehicle.pricePerDay}/day</span>
                      </div>
                    </td>

                    <td className="py-4 text-center align-middle">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-600">
                          {new Date(rental.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })} to {new Date(rental.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Total: ${rental.totalPrice}</span>
                      </div>
                    </td>

                    <td className="py-4 pr-4 text-right align-middle">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openCancelConfirmation(rental._id, rental.vehicle.name)}
                          className="text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rentals.length === 0 && (
              <div className="text-center py-12 text-sm font-medium text-slate-400">
                No rental transactions found in the database.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Styled Theme-Matching Modal Backed Overdrop Overlay */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full border border-slate-100 rounded-[24px] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] transform scale-100 transition-all">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-rose-50 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Cancel Rental?
            </h3>
            <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to cancel the rental for <span className="font-bold text-slate-700">{cancelModal.vehicleName}</span>? This action will free up the vehicle for others to rent.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeCancelModal}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndExecuteCancel}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}