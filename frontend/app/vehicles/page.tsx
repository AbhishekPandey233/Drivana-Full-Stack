"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Settings, Fuel, Snowflake } from 'lucide-react';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import AuthGate from '../navigation/AuthGate';

const BRAND_LOGOS = [
  { src: '/toyotalogo.png', alt: 'Toyota' },
  { src: '/fordlogo.png', alt: 'Ford' },
  { src: '/mercedeslogo.png', alt: 'Mercedes' },
  { src: '/jeeplogo.png', alt: 'Jeep' },
  { src: '/bmwlogo.png', alt: 'BMW' },
  { src: '/audilogo.png', alt: 'Audi' },
];

const CATEGORIES = ['All vehicles', 'Sedan', 'SUV', 'EV', 'Coupe'];

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
  status?: string;
}

// Inner component wrapper needed to access useSearchParams cleanly with NextJS dynamic SSR boundaries
function VehiclesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL);
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchVehicles();
    };
    void load();
  }, [fetchVehicles]);

  const selectedCategory = (() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      const matchedCategory = CATEGORIES.find(
        (cat) => cat.toLowerCase() === categoryQuery.toLowerCase()
      );
      if (matchedCategory) {
        return matchedCategory;
      }
    }
    return 'All vehicles';
  })();

  const handleCategoryChange = (category: string) => {
    if (category === 'All vehicles') {
      router.push('/vehicles');
    } else {
      router.push(`/vehicles?category=${encodeURIComponent(category)}`);
    }
  };

  const filteredVehicles = selectedCategory === 'All vehicles'
    ? vehicles
    : vehicles.filter(car => car.type.toLowerCase() === selectedCategory.toLowerCase());

  const renderImage = (car: Vehicle) => {
    if (car.image) {
      const src = car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`;
      return (
        <div className="relative w-full h-full p-2">
          <img
            src={src}
            alt={car.name}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-44 h-10 bg-gray-200 rounded-full relative opacity-70 mt-4">
        <div className="absolute top-[-14px] left-8 w-22 h-14 bg-gray-200 rounded-t-full" />
        <div className="absolute bottom-[-5px] left-6 w-7 h-7 bg-gray-300 rounded-full border-4 border-white" />
        <div className="absolute bottom-[-5px] right-6 w-7 h-7 bg-gray-300 rounded-full border-4 border-white" />
      </div>
    );
  };

  return (
    <>
      {/* SECTION HEADER & FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-4 pt-12 text-center">
        <div className="w-full bg-gray-50/60 rounded-[32px] py-6 px-10 flex flex-wrap items-center justify-around gap-6 border border-gray-100/50 mb-10">
          {BRAND_LOGOS.map((logo, idx) => (
            <div key={`top-${idx}`} className="relative h-7 w-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-smooth-fast">
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
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-smooth-fast shadow-sm border flex items-center gap-2 hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-md'
                    : 'bg-gray-50/60 text-gray-500 border-gray-100 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* CAR CATALOG COMPONENT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#6366F1] rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-400">Fetching fleet records from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((car, idx) => (
              <div key={car._id} className={`group card-hover-glow bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm animate-fade-in-up stagger-${(idx % 6) + 1}`}>
                <div className="w-full aspect-[16/10] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-5 relative">
                  <div className="w-full h-full img-zoom-smooth">
                    {renderImage(car)}
                  </div>
                </div>

                <div className="flex items-start justify-between mb-3">
                   <div>
                     <div className="flex items-center gap-2">
                       <h3 className="text-sm font-bold text-gray-900 tracking-tight">{car.name}</h3>
                       {car.status && (
                         <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                           car.status === 'available'
                             ? 'bg-green-100 text-green-700'
                             : car.status === 'rented'
                             ? 'bg-red-100 text-red-700'
                             : 'bg-amber-100 text-amber-700'
                         }`}>
                           {car.status === 'available' ? 'Available' : car.status === 'rented' ? 'Rented' : 'Maintenance'}
                         </span>
                       )}
                     </div>
                     <p className="text-[11px] text-gray-400 font-medium">{car.type}</p>
                   </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#6366F1]">${car.pricePerDay}</span>
                    <p className="text-[9px] text-gray-400 font-medium">per day</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 py-3 border-t border-gray-50 text-[10px] font-semibold text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3 text-gray-400" strokeWidth={2.25} /> {car.specs?.gearBox || 'Automatic'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-gray-400" strokeWidth={2.25} /> {car.specs?.fuel || 'Petrol'}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Snowflake className="w-3 h-3 text-gray-400" strokeWidth={2.25} /> Air Conditioner
                  </div>
                </div>

                 <Link
                   href={`/vehicles/${car._id}`}
                   className="w-full bg-[#6366F1] text-white text-center text-xs font-bold py-3 rounded-xl hover:bg-indigo-600 transition-smooth-fast hover:shadow-md active:scale-95 shadow-sm block"
                 >
                   View Details
                 </Link>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-sm font-medium text-slate-400">
            No fleet vehicles match the selected filter.
          </div>
        )}
      </section>
    </>
  );
}

export default function VehiclesPage() {
  return (
    <AuthGate>
      <div className="w-full bg-white font-sans text-gray-900 min-h-screen pb-16">
        <Header />

        {/* Wrapping inside Suspense boundary prevents build errors when querying searchParams during build compilation */}
        <Suspense fallback={<div className="text-center py-20 text-sm text-gray-400">Loading catalog dashboard view...</div>}>
          <VehiclesCatalogContent />
        </Suspense>

        {/* BRAND FOOTER BAR */}
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="w-full bg-gray-50/60 rounded-[32px] py-6 px-10 flex flex-wrap items-center justify-around gap-6 border border-gray-100/50">
            {BRAND_LOGOS.map((logo, idx) => (
              <div key={`bottom-${idx}`} className="relative h-7 w-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-smooth-fast">
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

        <Footer />
      </div>
    </AuthGate>
  );
}