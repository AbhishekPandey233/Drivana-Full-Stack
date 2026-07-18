"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:5000/api/vehicles";

interface PageProps {
  params: Promise<{ id: string }>;
}

function EditVehicleForm({ params }: PageProps) {
  const router = useRouter();
  const { id: vehicleId } = use(params);

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const imagePreview = React.useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      const token = window.localStorage.getItem("token");
      try {
        const res = await fetch(`${BACKEND_URL}/${vehicleId}`, {
          headers: { 
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        });

        if (res.status === 401 || res.status === 403) {
          router.replace("/auth/login");
          return;
        }
        if (!res.ok) {
          throw new Error("The selected vehicle record could not be retrieved from the server.");
        }

        const data = await res.json();
        
        setFormData({
          name: data.name || "",
          type: data.type || "Sedan",
          plateNumber: data.plateNumber || "",
          pricePerDay: data.pricePerDay?.toString() || "",
          status: data.status || "available",
          gearBox: data.specs?.gearBox || "Automatic",
          fuel: data.specs?.fuel || "Petrol",
          doors: data.specs?.doors ?? 4,
          seats: data.specs?.seats ?? 5,
          distance: data.specs?.distance ?? 500,
          hasABS: data.equipment?.hasABS || false,
          hasAirBags: data.equipment?.hasAirBags || false,
          hasCruiseControl: data.equipment?.hasCruiseControl || false,
          hasAirConditioner: data.equipment?.hasAirConditioner || false,
        });
        if (data.image) {
          setCurrentImage(data.image.startsWith("http") ? data.image : `http://localhost:5000${data.image}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    void fetchVehicle();
  }, [vehicleId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const token = window.localStorage.getItem("token");

    try {
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("type", formData.type);
      apiFormData.append("plateNumber", formData.plateNumber);
      apiFormData.append("pricePerDay", formData.pricePerDay);
      apiFormData.append("status", formData.status);
      apiFormData.append("specs", JSON.stringify({
        gearBox: formData.gearBox,
        fuel: formData.fuel,
        doors: formData.doors,
        seats: formData.seats,
        distance: formData.distance,
      }));
      apiFormData.append("equipment", JSON.stringify({
        hasABS: formData.hasABS,
        hasAirBags: formData.hasAirBags,
        hasCruiseControl: formData.hasCruiseControl,
        hasAirConditioner: formData.hasAirConditioner,
      }));
      if (imageFile) {
        apiFormData.append("image", imageFile);
      }

      const res = await fetch(`${BACKEND_URL}/${vehicleId}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: apiFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to commit record updates.");
      }

      setSuccess("Vehicle configuration synchronized successfully!");
      setTimeout(() => router.push("/admin/vehicles"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400">Loading vehicle configuration data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Modify Fleet Configuration</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Update vehicle attributes and operational settings for this fleet asset.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold animate-fade-in-up">
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-sm font-bold rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 pt-4">Vehicle Image</h3>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover animate-scale-in" />
                  ) : currentImage ? (
                    <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium text-center px-2">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">JPG, PNG, or WebP. Max 5MB.</p>
                </div>
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
                <label key={feature} className={`flex items-center gap-3 text-sm font-medium text-slate-700 border p-3 rounded-xl cursor-pointer transition-smooth-fast hover:bg-slate-50 hover:-translate-y-0.5 ${formData[feature] ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200'}`}>
                  <input type="checkbox" name={feature} checked={!!formData[feature]} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="capitalize text-xs font-bold uppercase tracking-wider">{feature.replace("has", "Include ")}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/admin/vehicles")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 shadow-sm transition-smooth-fast hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366F1] px-5 text-xs font-bold text-white shadow-sm transition-smooth-fast hover:bg-indigo-600 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {submitting ? "Saving Updates..." : "Save Configuration"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function EditVehiclePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-medium text-slate-400">Loading component...</div>}>
      <EditVehicleForm params={params} />
    </Suspense>
  );
}
