"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Settings, Fuel, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/auth/AuthProvider";
import AuthGate from "../navigation/AuthGate";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";
import DatePicker from "../components/DatePicker";

const VEHICLE_API_URL = "http://localhost:5000/api/vehicles";
const RENTING_API_URL = "http://localhost:5000/api/rentings";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image?: string;
  status: string;
  specs: {
    gearBox: string;
    fuel: string;
  };
}

function RentingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const vehicleId = searchParams?.get("vehicleId") || "";
  const routeError = vehicleId ? null : "No valid vehicle selection found. Please select a car first.";

  // Component states
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  // Form states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalPrice = useMemo(() => {
    if (!startDate || !endDate || !vehicle) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays * vehicle.pricePerDay : 0;
  }, [startDate, endDate, vehicle]);

  // Fetch the selected car specifications
  useEffect(() => {
    if (!vehicleId) {
      return;
    }

    const fetchVehicleDetails = async () => {
      try {
        const res = await fetch(`${VEHICLE_API_URL}/${vehicleId}`);
        if (!res.ok) {
          throw new Error("Could not load selected vehicle assets.");
        }

        const data = await res.json();
        setVehicle(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse target vehicle records.";
        setError(message);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  const handleRentingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (vehicle && vehicle.status !== "available") {
      setError("Vehicle is no longer available for renting.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both Start and End Dates to rent.");
      return;
    }

    if (totalPrice <= 0) {
      setError("The End Date must occur after your Pick-up Start Date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(RENTING_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle?._id,
          startDate,
          endDate,
          totalPrice,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "An error occurred handling your rental.");
      }

      setSuccessOpen(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network execution failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (vehicleId && !vehicle && !error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400">Syncing selected vehicle details...</span>
      </div>
    );
  }

  const carImgSrc = vehicle?.image
    ? vehicle.image.startsWith("http")
      ? vehicle.image
      : `http://localhost:5000${vehicle.image}`
    : null;
  const isUnavailable = Boolean(vehicle && vehicle.status !== "available");
  const unavailableError = isUnavailable ? "Vehicle is no longer available for renting." : null;
  const displayError = error ?? unavailableError ?? routeError;

  const closeSuccessPopup = () => {
    setSuccessOpen(false);
    router.push("/vehicles");
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 text-center">
          Complete Your Renting Request
        </h1>
        <p className="text-sm text-slate-400 text-center mb-10">
          Review car specifications and choose dates below to lock in reservation.
        </p>

        {displayError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold animate-shake flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={2.25} /> {displayError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Hand: Selection Showcase Summary Card */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 animate-fade-in-up">
            <div className="w-full aspect-[16/10] bg-[#F3F4F6] rounded-2xl flex items-center justify-center overflow-hidden border border-slate-50 relative">
              {carImgSrc ? (
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${carImgSrc})` }}
                  role="img"
                  aria-label={vehicle?.name ?? "Selected vehicle preview"}
                />
              ) : (
                <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">
                  No Preview Image
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-[#6366F1] bg-indigo-50 px-2.5 py-1 rounded-full tracking-wider">
                  {vehicle?.type}
                </span>
                {isUnavailable && (
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider ${
                    vehicle?.status === "rented" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {vehicle?.status === "rented" ? "Currently Rented" : "Under Maintenance"}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-2 capitalize">{vehicle?.name}</h2>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                <span className="flex items-center gap-1"><Settings className="w-3 h-3" strokeWidth={2.25} /> {vehicle?.specs.gearBox}</span>
                <span className="flex items-center gap-1"><Fuel className="w-3 h-3" strokeWidth={2.25} /> {vehicle?.specs.fuel}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">Daily Rate</span>
              <span className="text-base font-bold text-slate-900">${vehicle?.pricePerDay} / day</span>
            </div>
          </div>

          {/* Right Hand: Interactive Date Selection Form Component */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm animate-fade-in-up stagger-1">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Reservation Setup</h3>

            <form onSubmit={handleRentingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Pick-up Start Date
                  </label>
                  <DatePicker
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={setStartDate}
                    placeholder="Select start date"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Drop-off End Date
                  </label>
                  <DatePicker
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={setEndDate}
                    placeholder="Select end date"
                  />
                </div>
              </div>

              {/* Price Preview Block */}
              <div className="bg-[#FAFAFC] border border-slate-100 rounded-2xl p-4 flex justify-between items-center transition-colors duration-300">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Total Renting Price</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Calculated based on duration</p>
                </div>
                <div key={totalPrice} className="text-2xl font-black text-[#6366F1] animate-scale-in">
                  ${totalPrice}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !vehicle || isUnavailable}
                  className="flex-1 h-12 rounded-xl bg-[#6366F1] font-bold text-xs text-white shadow-sm hover:bg-indigo-600 transition-smooth-fast hover:shadow-lg active:scale-95 uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing Transaction..." : isUnavailable ? "Vehicle Unavailable" : "Confirm Renting"}
                </button>

                <Link
                  href={vehicleId ? `/vehicles/${vehicleId}` : "/vehicles"}
                  className="h-12 px-6 rounded-xl border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-50 transition-smooth-fast active:scale-95 uppercase tracking-wider"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {successOpen && vehicle && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm px-4 py-8 animate-fade-in">
          <div
            className="mt-24 w-full max-w-[520px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/70 sm:p-7 animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8fafc,#cbd5e1)] text-lg font-black text-slate-600">
                    {vehicle.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-500 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">Booking confirmed</h2>
                  <p className="text-sm text-slate-500">Your renting request is ready for review.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeSuccessPopup}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 text-lg leading-none text-slate-500 transition-smooth-fast hover:bg-violet-50 hover:text-slate-700 active:scale-90"
                aria-label="Close renting confirmation popup"
              >
                ×
              </button>
            </div>

            <div className="mt-5 border-t border-slate-200/90" />

            <div className="mt-2 divide-y divide-slate-200/80">
              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-slate-700">Vehicle</span>
                <span className="text-[15px] text-slate-500">{vehicle.name}</span>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-slate-700">Rental window</span>
                <span className="text-[15px] text-slate-500">
                  {startDate} to {endDate}
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-slate-700">Total price</span>
                <span className="text-[15px] text-slate-500">${totalPrice}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 w-full pb-1">
              <button
                type="button"
                onClick={closeSuccessPopup}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#2F80ED] px-2 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-smooth-fast hover:bg-blue-600 hover:shadow-md active:scale-95 truncate"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => router.push("/vehicles")}
                className="inline-flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-smooth-fast hover:bg-slate-50 active:scale-95 truncate"
              >
                Go to Vehicles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RentingPage() {
  return (
    <AuthGate allowedRoles={["user", "admin"]}>
      <div className="w-full bg-[#FAFAFC] font-sans text-gray-900 min-h-screen flex flex-col justify-between">
        <div>
          <Header />
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
              <span className="text-sm font-medium text-slate-400">Loading parameters...</span>
            </div>
          }>
            <RentingContent />
          </Suspense>
        </div>
        <Footer />
      </div>
    </AuthGate>
  );
}