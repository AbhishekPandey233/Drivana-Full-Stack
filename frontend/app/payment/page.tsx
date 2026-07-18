"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";
import AuthGate from "../navigation/AuthGate";
import { useAuth } from "@/app/auth/AuthProvider";

const RENTING_API_URL = "http://localhost:5000/api/rentings";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image?: string;
  plateNumber?: string;
  specs?: {
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
  paymentStatus: "unpaid" | "paid";
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const rentalId = searchParams?.get("rentalId") || "";

  // Form Fields State
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  // Rental / vehicle data
  const [renting, setRenting] = useState<Renting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Fetch the specific rental + vehicle details to display
  useEffect(() => {
    const fetchRental = async () => {
      if (!token) return;
      if (!rentalId) {
        setError("No rental selected. Please choose a rental to pay for.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${RENTING_API_URL}/my-rentings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to load rental details.");
        }

        const data: Renting[] = await res.json();
        const selected = data.find((r) => r._id === rentalId);

        if (!selected) {
          throw new Error("Selected rental could not be found.");
        }

        setRenting(selected);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load rental.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [token, rentalId]);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rentalId || !renting) {
      setError("No rental selected for payment.");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${RENTING_API_URL}/${rentalId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Sensitive card data is sent for processing but is NEVER persisted by the backend.
        body: JSON.stringify({
          cardholderName,
          cardNumber,
          expiry,
          cvc,
          discountCode,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Payment could not be processed.");
      }

      // Redirect back to rentals where the record now shows "Fees Paid".
      router.push("/viewRents");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const vehicle = renting?.vehicle;
  const carImgSrc = vehicle?.image
    ? vehicle.image.startsWith("http")
      ? vehicle.image
      : `http://localhost:5000${vehicle.image}`
    : null;

  return (
    <div className="w-full bg-white font-sans text-gray-900 min-h-screen flex flex-col justify-between">
      <div>
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#9254FF] rounded-full animate-spin" />
              <span className="text-sm font-medium text-slate-400">Loading rental details...</span>
            </div>
          ) : error && !renting ? (
            <div className="max-w-md mx-auto text-center py-24 animate-fade-in-up">
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold animate-shake flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={2.25} /> {error}
              </div>
              <Link
                href="/viewRents"
                className="inline-block px-6 py-3 bg-[#9254FF] text-white rounded-xl text-xs font-bold transition-smooth-fast hover:bg-[#7D3CFF] hover:shadow-md active:scale-95"
              >
                Back to My Rentals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Side: Form Fields */}
              <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-black mb-4">
                    Let&#39;s Make Payment
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                    To confirm your rental, input your card details to make payment.
                    You will be redirected to your banks authorization page.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold animate-shake flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={2.25} /> {error}
                  </div>
                )}

                <form onSubmit={handlePaySubmit} className="space-y-5 pt-4">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Cardholder&#39;s Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#EFEFEF]/70 border-0 rounded-xl px-4 py-3 text-sm font-medium text-violet-500 outline-none transition-smooth-fast focus:ring-2 focus:ring-violet-400"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center pointer-events-none">
                        <div className="flex -space-x-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
                          <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-85" />
                        </div>
                      </div>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9010 1112"
                        className="w-full bg-[#EFEFEF]/70 border-0 rounded-xl pl-14 pr-4 py-3 text-sm font-medium text-violet-500 outline-none transition-smooth-fast focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                  </div>

                  {/* Expiry & CVC Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Expiry
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-[#EFEFEF]/70 border-0 rounded-xl px-4 py-3 text-sm font-medium text-violet-500 outline-none transition-smooth-fast focus:ring-2 focus:ring-violet-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        CVC
                      </label>
                      <input
                        type="text"
                        required
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full bg-[#EFEFEF]/70 border-0 rounded-xl px-4 py-3 text-sm font-medium text-violet-500 outline-none transition-smooth-fast focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Discount Code
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-[#EFEFEF]/70 border-0 rounded-xl pl-4 pr-16 py-3 text-sm font-medium text-violet-300 outline-none transition-smooth-fast focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                  </div>

                  {/* Submit Action Buttons */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-40 h-11 rounded-lg bg-[#9254FF] hover:bg-[#7D3CFF] font-bold text-sm text-white shadow-sm transition-smooth-fast hover:shadow-lg active:scale-95 text-center disabled:opacity-50 disabled:active:scale-100"
                    >
                      {processing ? "Processing..." : "Pay"}
                    </button>
                    <Link
                      href="/viewRents"
                      className="w-40 h-11 rounded-lg bg-[#9254FF] hover:bg-[#7D3CFF] font-bold text-sm text-white shadow-sm transition-smooth-fast hover:shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>

              {/* Right Side: Pricing Breakdown Card ($USD) */}
              <div className="lg:col-span-5 bg-[#F2F2F2]/80 rounded-xl p-8 space-y-6 animate-fade-in-up stagger-1">
                <div>
                  <p className="text-gray-500 text-sm font-medium">You&#39;re paying,</p>
                  <h2 className="text-5xl font-bold tracking-tight text-black mt-2">
                    ${renting?.totalPrice.toFixed(2)}
                  </h2>
                </div>

                <div className="pt-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-black capitalize">
                      {vehicle?.name}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-0.5 mt-1 font-medium">
                      <p>Type: {vehicle?.type}</p>
                      <p>Plate number: {vehicle?.plateNumber || "N/A"}</p>
                      <p>Rate: ${vehicle?.pricePerDay} / day</p>
                    </div>
                  </div>
                  {carImgSrc && (
                    <div
                      className="w-20 h-16 bg-center bg-no-repeat bg-contain"
                      style={{ backgroundImage: `url(${carImgSrc})` }}
                      role="img"
                      aria-label={vehicle?.name}
                    />
                  )}
                </div>

                <div className="border-t border-gray-300 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-black">Vehicle</span>
                    <span className="font-semibold text-black">
                      $ {vehicle?.pricePerDay.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="font-bold text-black">Total</span>
                    <span className="font-semibold text-black">
                      ${renting?.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <AuthGate allowedRoles={["user", "admin"]}>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#9254FF] rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-400">Loading payment details...</span>
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </AuthGate>
  );
}
