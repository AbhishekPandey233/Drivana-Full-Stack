"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGate from "../navigation/AuthGate";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";
import { useAuth } from "@/app/auth/AuthProvider";

const RENTING_API_URL = "http://localhost:5000/api/rentings/my-rentings";
const EXTEND_API_URL = "http://localhost:5000/api/rentings";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image?: string;
  specs: {
    gearBox: string;
    fuel: string;
  };
}

interface Renting {
  _id: string;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus?: "unpaid" | "paid";
}

export default function ViewRentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [rentals, setRentals] = useState<Renting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [decreaseId, setDecreaseId] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState<{ [key: string]: number }>({});
  const [decreaseDays, setDecreaseDays] = useState<{ [key: string]: number }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!token) return;

      try {
        const res = await fetch(RENTING_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch rentals");
        }

        const data = await res.json();
        setRentals(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load rentals";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [token]);

  const handleExtend = async (rentalId: string) => {
    const days = extendDays[rentalId] || 0;

    if (days <= 0) {
      setError("Please enter a valid number of days");
      return;
    }

    setExtendingId(rentalId);

    try {
      const res = await fetch(`${EXTEND_API_URL}/${rentalId}/extend`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ additionalDays: days }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extend rental");
      }

      setRentals((prev) =>
        prev.map((r) => (r._id === rentalId ? { ...r, ...data.renting } : r))
      );
      setSuccessMessage("Rental extended successfully");
      setExtendDays((prev) => ({ ...prev, [rentalId]: 0 }));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extend rental";
      setError(message);
    } finally {
      setExtendingId(null);
    }
  };

  const handleDecrease = async (rentalId: string) => {
    const days = decreaseDays[rentalId] || 0;

    if (days <= 0) {
      setError("Please enter a valid number of days to decrease");
      return;
    }

    setDecreaseId(rentalId);

    try {
      const res = await fetch(`${EXTEND_API_URL}/${rentalId}/decrease`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decreaseDays: days }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to decrease rental");
      }

      setRentals((prev) =>
        prev.map((r) => (r._id === rentalId ? { ...r, ...data.renting } : r))
      );
      setSuccessMessage("Rental duration decreased successfully");
      setDecreaseDays((prev) => ({ ...prev, [rentalId]: 0 }));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to decrease rental";
      setError(message);
    } finally {
      setDecreaseId(null);
    }
  };

  const handleCancel = async (rentalId: string) => {
    setCancellingId(rentalId);

    try {
      const res = await fetch(`${EXTEND_API_URL}/${rentalId}/cancel`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel rental");
      }

      setRentals((prev) => prev.filter((r) => r._id !== rentalId));
      setSuccessMessage("Rental cancelled successfully");
      setCancelModalOpen(null);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cancel rental";
      setError(message);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderImage = (vehicle: Vehicle) => {
    if (vehicle.image) {
      const src = vehicle.image.startsWith("http")
        ? vehicle.image
        : `http://localhost:5000${vehicle.image}`;
      return (
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${src})` }}
          role="img"
          aria-label={vehicle.name}
        />
      );
    }

    return (
      <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">
        No Preview
      </span>
    );
  };

  const closeCancelModal = () => {
    setCancelModalOpen(null);
  };

  return (
    <AuthGate allowedRoles={["user", "admin"]}>
      <div className="w-full bg-[#FAFAFC] font-sans text-gray-900 min-h-screen flex flex-col justify-between">
        <div>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              My Rentals
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              View and manage your rental records
            </p>

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-semibold">
                ✓ {successMessage}
              </div>
            )}

            {loading && (
              <div className="text-center py-24 text-sm font-medium text-slate-400">
                Loading your rentals...
              </div>
            )}

            {error && !loading && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold">
                ⚠ {error}
              </div>
            )}

            {!loading && !error && rentals.length === 0 && (
              <div className="text-center py-24 text-sm font-medium text-slate-400">
                You have no rental records yet.
                <div className="mt-4">
                  <Link
                    href="/vehicles"
                    className="inline-block px-6 py-3 bg-[#6366F1] text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                  >
                    Browse Vehicles
                  </Link>
                </div>
              </div>
            )}

            {!loading && rentals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((rental) => {
                  const daysLeft = getDaysRemaining(rental.endDate);
                  const daysBadgeClass =
                    daysLeft === 0
                      ? "bg-slate-100 text-slate-500"
                      : daysLeft <= 3
                      ? "bg-red-50 text-red-600"
                      : daysLeft <= 7
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600";

                  return (
                    <div
                      key={rental._id}
                      className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                    >
                      <div className="w-full aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                        {renderImage(rental.vehicle)}
                        <span className="absolute top-3 left-3 text-[10px] uppercase font-bold text-white bg-slate-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-wider">
                          {rental.vehicle.type}
                        </span>
                        <span
                          className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider ${
                            rental.paymentStatus === "paid"
                              ? "bg-emerald-500 text-white"
                              : "bg-white/90 text-slate-600"
                          }`}
                        >
                          {rental.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 capitalize leading-tight">
                            {rental.vehicle.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {rental.vehicle.specs.gearBox} &middot; {rental.vehicle.specs.fuel}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-[#FAFAFC] border border-slate-100 rounded-xl p-3 text-xs">
                          <div>
                            <p className="text-slate-400 font-medium mb-0.5">Start</p>
                            <p className="text-slate-800 font-semibold">{formatDate(rental.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-medium mb-0.5">End</p>
                            <p className="text-slate-800 font-semibold">{formatDate(rental.endDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${daysBadgeClass}`}>
                            {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                          </span>
                          <span className="text-[#6366F1] font-bold text-lg">
                            ${rental.totalPrice}
                          </span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                                Extend
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={extendDays[rental._id] || ""}
                                onChange={(e) =>
                                  setExtendDays((prev) => ({
                                    ...prev,
                                    [rental._id]: parseInt(e.target.value) || 0,
                                  }))
                                }
                                placeholder="Days"
                                className="w-full bg-[#FAFAFC] border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6366F1] mb-1.5"
                              />
                              <button
                                onClick={() => handleExtend(rental._id)}
                                disabled={extendingId === rental._id || getDaysRemaining(rental.endDate) === 0}
                                className="w-full h-9 rounded-lg bg-[#6366F1] font-bold text-[11px] text-white shadow-sm hover:bg-indigo-600 transition-colors uppercase tracking-wider disabled:opacity-50"
                              >
                                {extendingId === rental._id ? "..." : "Extend"}
                              </button>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                                Decrease
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={decreaseDays[rental._id] || ""}
                                onChange={(e) =>
                                  setDecreaseDays((prev) => ({
                                    ...prev,
                                    [rental._id]: parseInt(e.target.value) || 0,
                                  }))
                                }
                                placeholder="Days"
                                className="w-full bg-[#FAFAFC] border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6366F1] mb-1.5"
                              />
                              <button
                                onClick={() => handleDecrease(rental._id)}
                                disabled={decreaseId === rental._id || getDaysRemaining(rental.endDate) === 0}
                                className="w-full h-9 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-600 shadow-sm hover:bg-slate-200 transition-colors uppercase tracking-wider disabled:opacity-50"
                              >
                                {decreaseId === rental._id ? "..." : "Decrease"}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {rental.paymentStatus === "paid" ? (
                              <div className="h-9 rounded-lg bg-emerald-50 font-bold text-[11px] text-emerald-600 shadow-sm flex items-center justify-center uppercase tracking-wider">
                                Fees Paid
                              </div>
                            ) : (
                              <button
                                onClick={() => router.push(`/payment?rentalId=${rental._id}`)}
                                className="h-9 rounded-lg bg-emerald-500 font-bold text-[11px] text-white shadow-sm hover:bg-emerald-600 transition-colors uppercase tracking-wider"
                              >
                                Pay
                              </button>
                            )}

                            <button
                              onClick={() => setCancelModalOpen(rental._id)}
                              disabled={getDaysRemaining(rental.endDate) === 0}
                              className="h-9 rounded-lg bg-red-50 font-bold text-[11px] text-red-600 shadow-sm hover:bg-red-100 transition-colors uppercase tracking-wider disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>

      {cancelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm px-4 py-8"
          onClick={closeCancelModal}
        >
          <div
            className="mt-24 w-full max-w-[480px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/70 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Confirm Cancellation
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {rentals.find((r) => r._id === cancelModalOpen)?.paymentStatus === "paid"
                    ? "you wont be getting your money back! if you cancel you won't get to enjoy the stuff you paid for !!"
                    : "Are you sure you want to cancel this rental? This action cannot be undone."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 text-lg leading-none text-slate-500 transition-colors hover:bg-violet-50 hover:text-slate-700"
                aria-label="Close cancellation modal"
              >
                ×
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 w-full pb-1">
              <button
                type="button"
                onClick={closeCancelModal}
                className="inline-flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 truncate"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleCancel(cancelModalOpen)}
                disabled={cancellingId === cancelModalOpen}
                className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-2 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 truncate disabled:opacity-50"
              >
                {cancellingId === cancelModalOpen ? "Cancelling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGate>
  );
}