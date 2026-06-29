"use client";

import React from "react";
import Link from "next/link";
import AuthGate from "../navigation/AuthGate";
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

// Mock data for the "Other cars" collection shown in image_bedebd.png
const OTHER_CARS = [
  { id: 1, name: "Mercedes", type: "Sedan", price: 25, spec1: "Automat", spec2: "PB 95" },
  { id: 2, name: "Mercedes", type: "Sport", price: 50, spec1: "Automat", spec2: "PB 95" },
  { id: 3, name: "Mercedes", type: "Sedan", price: 45, spec1: "Automat", spec2: "PB 95" },
  { id: 4, name: "Porsche", type: "SUV", price: 40, spec1: "Automat", spec2: "PB 98" },
  { id: 5, name: "Toyota", type: "Sedan", price: 35, spec1: "Automat", spec2: "PB 95" },
  { id: 6, name: "Porsche", type: "SUV", price: 50, spec1: "Automat", spec2: "PB 98" },
];

export default function DetailsPage() {
  /* 
    ========================================================================
    STATIC VEHICLE DATA COMMENT:
    The main data object below handles the core vehicle details statically. 
    In production, this should be fetched from your database using a vehicle ID 
    passed via dynamic routing parameters (e.g., from the URL or vehicle page context).
    ========================================================================
  */
  const staticVehicle = {
    name: "Mercedes",
    pricePerDay: 25,
    specs: {
      gearBox: "Automat",
      fuel: "Petrol",
      doors: "2",
      airConditioner: "Yes",
      seats: "5",
      distance: "500",
    },
    equipment: ["ABS", "Alp", "Air Bags", "Air Bags", "Cruise Control", "Air Conditioner"]
  };

  return (
    <AuthGate>
      <div className="w-full bg-white font-sans text-gray-900 min-h-screen flex flex-col justify-between">
        <div>
          {/* Exact unified Header matching the vehicle catalog workflow */}
          <Header />

          <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">
            
            {/* Main Vehicle Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Title, Pricing, and Media Gallery */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{staticVehicle.name}</h1>
                  <div className="mt-2 text-2xl font-bold text-[#6366F1]">
                    ${staticVehicle.pricePerDay} <span className="text-xs text-slate-400 font-medium">/ day</span>
                  </div>
                </div>

                {/* Main Preview Placeholder Card */}
                <div className="w-full aspect-[16/10] bg-slate-200 rounded-xl flex flex-col items-center justify-center p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="w-4/5 h-2/3 bg-indigo-400 rounded-full blur-xl opacity-20 absolute bottom-4"></div>
                  <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 font-medium">
                    Main Image Component
                  </div>
                </div>

                {/* Secondary Thumbnail Track */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="aspect-video bg-slate-300 rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-xs text-slate-500 font-medium">
                      Thumb {idx}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Specifications and Equipment Checklist */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Technical Specification</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Gear Box", value: staticVehicle.specs.gearBox, icon: "⚙️" },
                      { label: "Fuel", value: staticVehicle.specs.fuel, icon: "⛽" },
                      { label: "Doors", value: staticVehicle.specs.doors, icon: "🚪" },
                      { label: "Air Conditioner", value: staticVehicle.specs.airConditioner, icon: "❄️" },
                      { label: "Seats", value: staticVehicle.specs.seats, icon: "👥" },
                      { label: "Distance", value: staticVehicle.specs.distance, icon: "🛣️" },
                    ].map((spec, i) => (
                      <div key={i} className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm space-y-1">
                        <span className="text-lg block">{spec.icon}</span>
                        <span className="text-[11px] font-medium text-slate-400 block">{spec.label}</span>
                        <span className="text-xs font-bold text-slate-800 block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Booking Button - Color updated to match image_beee7b.png */}
                <button className="w-full sm:w-auto px-10 h-10 rounded-full bg-[#6366F1] font-semibold text-xs text-white shadow-sm hover:bg-indigo-600 transition-colors uppercase tracking-wider">
                  Rent a car
                </button>

                {/* Features Checklist */}
                <div className="pt-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-4">Car Equipment</h2>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {staticVehicle.equipment.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                        <span className="w-4 h-4 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-[10px] text-[#6366F1] font-bold">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Bottom Section: Alternative Vehicle Recommendations Showcase */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight text-slate-990">Other cars</h2>
                <Link href="/vehicles" className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:text-[#6366F1] transition-colors">
                  View All <span>➔</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OTHER_CARS.map((car) => (
                  <div key={car.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                    
                    {/* Silhouette Image Space */}
                    <div className="w-full aspect-[16/10] bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="w-2/3 h-1/2 bg-slate-300 rounded-full blur-xl opacity-30 absolute bottom-2"></div>
                      <span className="text-xs font-medium text-slate-400 z-10">Car Preview Picture</span>
                    </div>

                    {/* Core Pricing Metadata */}
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{car.name}</h3>
                          <p className="text-xs font-medium text-slate-400">{car.type}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#6366F1] block">${car.price}</span>
                          <span className="text-[10px] font-medium text-slate-400 block -mt-1">per day</span>
                        </div>
                      </div>

                      {/* Secondary Features Summary Bar */}
                      <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1">⚙️ {car.spec1}</span>
                        <span className="flex items-center gap-1">⛽ {car.spec2}</span>
                        <span className="flex items-center gap-1">❄️ AC</span>
                      </div>
                    </div>

                    {/* CTA Interaction Trigger - Color updated to match image_beee7b.png */}
                    <button className="w-full h-9 rounded-xl bg-[#6366F1] text-white text-center text-xs font-bold hover:bg-indigo-600 transition-colors shadow-sm block">
                      View Details
                    </button>

                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>

        {/* Global site footer component alignment */}
        <Footer />
      </div>
    </AuthGate>
  );
}