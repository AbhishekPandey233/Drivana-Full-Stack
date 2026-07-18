"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Settings, Fuel, DoorOpen, Snowflake, Users, Route, Check, ArrowRight, AlertCircle } from "lucide-react";
import AuthGate from "../../navigation/AuthGate";
import Header from '../../navigation/Header';
import Footer from '../../navigation/Footer';

const BACKEND_URL = "http://localhost:5000/api/vehicles";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  specs: {
    gearBox: string;
    fuel: string;
    doors: number;
    seats: number;
    distance: number;
  };
  equipment: {
    hasABS: boolean;
    hasAirBags: boolean;
    hasCruiseControl: boolean;
    hasAirConditioner: boolean;
  };
  image?: string;
  status: string;
}

interface OtherCar {
  _id: string;
  name: string;
  type: string;
  pricePerDay: number;
  specs: {
    gearBox: string;
    fuel: string;
  };
  image?: string;
}

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [otherCars, setOtherCars] = useState<OtherCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const vehicleRes = await fetch(`${BACKEND_URL}/${vehicleId}`);
        if (!vehicleRes.ok) {
          if (vehicleRes.status === 404) {
            setError("Vehicle not found");
          } else {
            setError("Failed to fetch vehicle details");
          }
          setLoading(false);
          return;
        }
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        const allRes = await fetch(BACKEND_URL);
        if (allRes.ok) {
          const allData: Vehicle[] = await allRes.json();
          const filtered = allData
            .filter((car) => car._id !== vehicleId && car.status === "available")
            .slice(0, 6)
            .map((car) => ({
              _id: car._id,
              name: car.name,
              type: car.type,
              pricePerDay: car.pricePerDay,
              specs: {
                gearBox: car.specs.gearBox,
                fuel: car.specs.fuel,
              },
              image: car.image,
            }));
          setOtherCars(filtered);
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details. Please try again later.");
      } finally {
        loading && setLoading(false);
      }
    };

    void fetchData();
  }, [vehicleId]);

  // Handle Redirection to Renting Page
  const handleRentNow = () => {
    if (vehicleId) {
      router.push(`/renting?vehicleId=${vehicleId}`);
    }
  };

  const renderImage = (car: Vehicle | OtherCar) => {
    if (car.image) {
      const src = car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`;
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={src}
            alt={car.name}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-3/4 h-1/2 bg-slate-200 rounded-full blur-2xl opacity-40 absolute" />
        <span className="text-xs font-semibold text-slate-400 z-10 relative tracking-wider uppercase">Car Preview Picture</span>
      </div>
    );
  };

  if (error && !loading) {
    return (
      <AuthGate>
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
              <p className="text-slate-500 mb-8">{error}</p>
              <Link href="/vehicles" className="px-6 py-3 bg-[#6366F1] text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-smooth-fast hover:shadow-md active:scale-95">
                Back to Vehicles
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </AuthGate>
    );
  }

  const equipmentList: { key: keyof Vehicle['equipment']; label: string }[] = [
    { key: 'hasABS', label: 'ABS' },
    { key: 'hasAirBags', label: 'Air Bags' },
    { key: 'hasCruiseControl', label: 'Cruise Control' },
    { key: 'hasAirConditioner', label: 'Air Conditioner' },
  ];

  return (
    <AuthGate>
      <div className="w-full bg-[#FAFAFC] font-sans text-gray-900 min-h-screen flex flex-col justify-between">
        <div>
          <Header />

          <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-in-up">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{loading ? 'Loading...' : vehicle?.name}</h1>
                    {!loading && vehicle?.status && vehicle.status !== 'available' && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        vehicle.status === 'rented' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                        {vehicle.status === 'rented' ? 'Currently Rented' : 'Under Maintenance'}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#6366F1]">
                    {!loading && vehicle ? `$${vehicle.pricePerDay}` : ''} <span className="text-xs text-slate-400 font-medium">/ day</span>
                  </div>
                </div>

                <div className="w-full aspect-[16/10] bg-[#F3F4F6] rounded-2xl flex items-center justify-center overflow-hidden relative border border-slate-100 transition-shadow duration-300 hover:shadow-md">
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
                  ) : (
                    renderImage(vehicle!)
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-8 lg:pt-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Technical Specification</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Gear Box", value: vehicle?.specs.gearBox || 'Auto', icon: Settings },
                      { label: "Fuel", value: vehicle?.specs.fuel || 'Petrol', icon: Fuel },
                      { label: "Doors", value: vehicle?.specs.doors ?? 4, icon: DoorOpen },
                      { label: "Air Conditioner", value: vehicle?.equipment.hasAirConditioner ? "Yes" : "No", icon: Snowflake },
                      { label: "Seats", value: vehicle?.specs.seats ?? 5, icon: Users },
                      { label: "Distance", value: vehicle ? `${vehicle.specs.distance} km` : '500 km', icon: Route },
                    ].map((spec, i) => (
                      <div key={i} className={`bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-1 transition-smooth-fast hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                        <spec.icon className="w-5 h-5 mb-1 text-[#6366F1]" strokeWidth={2.25} />
                        <span className="text-[11px] font-medium text-slate-400 block">{spec.label}</span>
                        <span className="text-xs font-bold text-slate-800 block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRentNow}
                  disabled={vehicle?.status !== 'available'}
                  className="w-full sm:w-auto px-10 h-12 rounded-full bg-[#6366F1] font-semibold text-xs text-white shadow-sm hover:bg-indigo-600 transition-smooth-fast hover:shadow-lg hover:scale-105 active:scale-95 uppercase tracking-wider disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
                >
                  {vehicle?.status === 'rented' ? 'Currently Rented' : vehicle?.status === 'maintenance' ? 'Under Maintenance' : 'Rent Now'}
                </button>

                <div className="pt-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Car Equipment</h2>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {equipmentList
                      .filter((item) => vehicle && vehicle.equipment[item.key])
                      .map((item) => (
                        <div key={item.key} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 animate-fade-in-up">
                          <span className="w-4 h-4 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-[#6366F1]"><Check className="w-2.5 h-2.5" strokeWidth={3} /></span>
                          {item.label}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Other cars</h2>
                <Link href="/vehicles" className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:text-[#6366F1] transition-smooth-fast group">
                  View All <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} />
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
                  <span className="text-sm font-medium text-slate-400">Fetching recommended vehicles...</span>
                </div>
              ) : otherCars.length === 0 ? (
                <div className="text-center py-12 text-sm font-medium text-slate-400">
                  No other vehicles available at this time.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherCars.map((car, idx) => (
                    <div key={car._id} className={`group card-hover-glow bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 animate-fade-in-up stagger-${(idx % 6) + 1}`}>
                      <div className="w-full aspect-[16/10] bg-[#F3F4F6] rounded-2xl flex items-center justify-center relative overflow-hidden border border-slate-50">
                        <div className="w-full h-full img-zoom-smooth">
                          {renderImage(car)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-base text-slate-900 capitalize">{car.name}</h3>
                            <p className="text-xs font-medium text-slate-400">{car.type}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#6366F1] block text-base">${car.pricePerDay}</span>
                            <span className="text-[10px] font-medium text-slate-400 block -mt-0.5">per day</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-3">
                          <span className="flex items-center gap-1"><Settings className="w-3 h-3" strokeWidth={2.25} /> {car.specs.gearBox}</span>
                          <span className="flex items-center gap-1"><Fuel className="w-3 h-3" strokeWidth={2.25} /> {car.specs.fuel}</span>
                          <span className="flex items-center gap-1"><Snowflake className="w-3 h-3" strokeWidth={2.25} /> AC</span>
                        </div>
                      </div>

                      <Link href={`/vehicles/${car._id}`} className="w-full h-11 rounded-xl bg-[#6366F1] text-white flex items-center justify-center text-xs font-bold hover:bg-indigo-600 transition-smooth-fast hover:shadow-md active:scale-95 shadow-sm tracking-wide">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGate>
  );
}