
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:5000/api/vehicles";

export default function CreateVehiclePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "Sedan",
    plateNumber: "",
    pricePerDay: "",
    status: "available",
    gearBox: "Automatic",
    fuel: "Petrol",
    doors: 4,
    seats: 5,
    distance: 500,
    hasABS: false,
    hasAirBags: false,
    hasCruiseControl: false,
    hasAirConditioner: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const token = window.localStorage.getItem("token");

    try {
      const payloadBody = {
        name: formData.name,
        type: formData.type,
        plateNumber: formData.plateNumber,
        pricePerDay: Number(formData.pricePerDay),
        status: formData.status,
        specs: {
          gearBox: formData.gearBox,
          fuel: formData.fuel,
          doors: Number(formData.doors),
          seats: Number(formData.seats),
          distance: Number(formData.distance),
        },
        equipment: {
          hasABS: formData.hasABS,
          hasAirBags: formData.hasAirBags,
          hasCruiseControl: formData.hasCruiseControl,
          hasAirConditioner: formData.hasAirConditioner,
        },
      };

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payloadBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to catalog new vehicle entry.");
      }

      setSuccess("New fleet vehicle registered successfully!");
      setTimeout(() => router.push("/admin/vehicles"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected catalog error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Register Fleet Vehicle</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Add a new vehicle entry to the operational fleet catalog.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Model Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-sm font-bold rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="EV">EV</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Plate Number</label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price Per Day ($)</label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 pt-4">Technical Fields</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gearbox</label>
                <select
                  name="gearBox"
                  value={formData.gearBox}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Fuel Type</label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Range (km)</label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 pt-4">Addons & Equipment</h3>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {(["hasABS", "hasAirBags", "hasCruiseControl", "hasAirConditioner"] as const).map((feature) => (
                <label key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-700 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" name={feature} checked={!!formData[feature]} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="capitalize text-xs font-bold uppercase tracking-wider">{feature.replace("has", "Include ")}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/admin/vehicles")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366F1] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-600 disabled:opacity-50"
              >
                {submitting ? "Adding to Fleet..." : "Register Asset"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}