"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer'; // Imported from your navigation folder
import AuthGate from '../navigation/AuthGate';


// 1. Unified Dataset containing both the silhouettes and realistic images from your screenshot views
const VEHICLES_DATA = [
  { 
    id: 1, 
    name: 'Mercedes', 
    type: 'Sedan', 
    price: 25, 
    transmission: 'Automat', 
    fuel: 'PB 95', 
    image: '/mercedeslogo.png', 
    isRealImage: false 
  },
  { 
    id: 2, 
    name: 'TOYOTA', 
    type: 'Sport', 
    price: 50, 
    transmission: 'Manual', 
    fuel: 'PB 95', 
    image: '/toyotalogo.png',
    isRealImage: false 
  },
  { 
    id: 3, 
    name: 'BMW', 
    type: 'Sedan', 
    price: 45, 
    transmission: 'Automat', 
    fuel: 'PB 95', 
    image: '/bmwlogo.png',
    isRealImage: false 
  },
  { id: 4, name: 'Porsche', type: 'SUV', price: 40, transmission: 'Automat', fuel: 'PB 95', isRealImage: false },
  { id: 5, name: 'Toyota', type: 'Sedan', price: 35, transmission: 'Manual', fuel: 'PB 95', isRealImage: false },
  { id: 6, name: 'Porsche', type: 'SUV', price: 50, transmission: 'Automat', fuel: 'PB 95', isRealImage: false },
  { id: 7, name: 'Mercedes', type: 'Minivan', price: 50, transmission: 'Automat', fuel: 'PB 95', isRealImage: false },
  { id: 8, name: 'Toyota', type: 'Sport', price: 60, transmission: 'Manual', fuel: 'PB 95', isRealImage: false },
  { id: 9, name: 'Maybach', type: 'Sedan', price: 70, transmission: 'Automat', fuel: 'PB 95', isRealImage: false },
];

const BRAND_LOGOS = [
  { src: '/toyotalogo.png', alt: 'Toyota' },
  { src: '/fordlogo.png', alt: 'Ford' },
  { src: '/mercedeslogo.png', alt: 'Mercedes' },
  { src: '/jeeplogo.png', alt: 'Jeep' },
  { src: '/bmwlogo.png', alt: 'BMW' },
  { src: '/audilogo.png', alt: 'Audi' },
];

const CATEGORIES = ['All vehicles', 'Sedan', 'Cabriolet', 'Pickup', 'SUV', 'Minivan'];

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All vehicles');

  // Interactive filtering logic running dynamically on user selection
  const filteredVehicles = selectedCategory === 'All vehicles'
    ? VEHICLES_DATA
    : VEHICLES_DATA.filter(car => car.type.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <AuthGate>
    <div className="w-full bg-white font-sans text-gray-900 min-h-screen pb-16">
      <Header />

      {/* SECTION HEADER & FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-4 pt-12 text-center">
        
        {/* BRAND LOGO TOP BAND (Duplicated matching image_24d81f.png component specifications) */}
        <div className="w-full bg-gray-50/60 rounded-[32px] py-6 px-10 flex flex-wrap items-center justify-around gap-6 border border-gray-100/50 mb-10">
          {BRAND_LOGOS.map((logo, idx) => (
            <div key={`top-${idx}`} className="relative h-7 w-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-200">
              <Image 
                src={logo.src} 
                alt={`${logo.alt} Top`} 
                fill 
                sizes="64px"
                className="object-contain" 
              />
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Select a vehicle group</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm border flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-[#6366F1] text-white border-[#6366F1]' 
                    : 'bg-gray-50/60 text-gray-500 border-gray-100 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <span className="opacity-60 text-[10px]">🚗</span>
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* CAR CATALOG COMPONENT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((car) => (
            <div key={car.id} className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              
              {/* Media Container: Rendering real pictures or design silhouettes */}
              <div className="w-full aspect-[16/10] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-5 relative">
                {car.isRealImage && car.image ? (
                  <div className="relative w-full h-full p-2">
                    <Image 
                      src={car.image} 
                      alt={car.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  /* Gray Silhouette vector mimicking image_2476a8.png placeholder states */
                  <div className="w-44 h-10 bg-gray-200 rounded-full relative opacity-70 mt-4">
                    <div className="absolute top-[-14px] left-8 w-22 h-14 bg-gray-200 rounded-t-full" />
                    <div className="absolute bottom-[-5px] left-6 w-7 h-7 bg-gray-300 rounded-full border-4 border-white" />
                    <div className="absolute bottom-[-5px] right-6 w-7 h-7 bg-gray-300 rounded-full border-4 border-white" />
                  </div>
                )}
              </div>

              {/* Identity details info block */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">{car.name}</h3>
                  <p className="text-[11px] text-gray-400 font-medium">{car.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#6366F1]">${car.price}</span>
                  <p className="text-[9px] text-gray-400 font-medium">per day</p>
                </div>
              </div>

              {/* Utilities ribbon specs strip */}
              <div className="grid grid-cols-3 gap-1 py-3 border-t border-gray-50 text-[10px] font-semibold text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">⦚</span> {car.transmission}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">⛽</span> {car.fuel}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-gray-400">❄</span> Air Conditioner
                </div>
              </div>

              {/* Action layout CTAs */}
              <Link
                href="/details"
                className="w-full bg-[#6366F1] text-white text-center text-xs font-bold py-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND FOOTER BAR (Positioned at bottom) */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="w-full bg-gray-50/60 rounded-[32px] py-6 px-10 flex flex-wrap items-center justify-around gap-6 border border-gray-100/50">
          {BRAND_LOGOS.map((logo, idx) => (
            <div key={`bottom-${idx}`} className="relative h-7 w-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-200">
              <Image 
                src={logo.src} 
                alt={`${logo.alt} Bottom`} 
                fill 
                sizes="64px"
                className="object-contain" 
              />
            </div>
          ))}
        </div>
      </section>
{/* GLOBAL SITE FOOTER COMPONENT */}
      <Footer />
    </div>
    </AuthGate>
  );
}