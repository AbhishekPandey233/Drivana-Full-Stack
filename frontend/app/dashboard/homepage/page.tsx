"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../navigation/Header';
import Footer from '../../navigation/Footer';
import AuthGate from '../../navigation/AuthGate';

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

export default function Homepage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({ carType: '', pickupLocation: '' });

  const handleBookingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.carType || !bookingForm.pickupLocation) {
      alert('Please fill out all the booking criteria.');
      return;
    }
    router.push(`/vehicles?category=${encodeURIComponent(bookingForm.carType)}`);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(BACKEND_URL);
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchVehicles();
  }, []);

  // Helper method to match image rendering from VehiclesPage component layout
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
    <AuthGate>
      <div className="w-full bg-white font-sans text-gray-900 pb-16">
        <Header />
        
        {/* 1. HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-[#6366F1] rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden text-white min-h-[500px]">
            {/* Hero Left Content */}
            <div className="max-w-xl z-10 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Experience the road like never before
              </h1>
              <p className="text-indigo-100 text-lg font-light max-w-md">
                Premium car rentals tailored exactly to your journey and your lifestyle choice.
              </p>
              {/* Changed from <button> to <Link> for navigation */}
              <Link 
                href="/vehicles" 
                className="bg-[#F59E0B] hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md inline-block text-center text-sm md:text-base"
              >
                View all cars
              </Link>
            </div>

            {/* Hero Right: Booking Form Container Card */}
            <div className="mt-8 lg:mt-0 w-full max-w-sm bg-white rounded-2xl p-6 text-gray-800 shadow-xl z-10">
              <h3 className="text-lg font-bold text-center mb-4">Book your car</h3>
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Car type</label>
                  <select
                    name="carType"
                    value={bookingForm.carType}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none cursor-pointer"
                  >
                    <option value="">Select type</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="coupe">Coupe</option>
                    <option value="ev">EV</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Pick up location</label>
                  <select
                    name="pickupLocation"
                    value={bookingForm.pickupLocation}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none cursor-pointer"
                  >
                    <option value="">Select location</option>
                    <option value="dillibazar">Dillibazar, Kathmandu</option>
                    <option value="new_baneshwor">New Baneshwor, Kathmandu</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-sm py-3 rounded-lg uppercase mt-4 transition">
                  Book now
                </button>
              </form>
            </div>
            
            {/* Static abstract backdrop silhouette */}
            <div className="absolute right-1/4 bottom-0 opacity-20 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-400 to-blue-900 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* 2. THREE CORE PILLARS ICONS */}
        <section className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-gray-100">📍</div>
            <span className="font-semibold text-sm">Availability</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-gray-100">🚗</div>
            <span className="font-semibold text-sm">Comfort</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-gray-100">💳</div>
            <span className="font-semibold text-sm">Savings</span>
          </div>
        </section>

        {/* 3. ABOUT CONTENT / FEATURE HIGHLIGHTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Aspect: Rolls Royce Static Side Car Image */}
          <div className="bg-gray-50 rounded-3xl aspect-[4/3] w-full flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden relative">
            <Image 
              src="/rollsroyce.jpg" 
              alt="Premium Car Showcase"
              fill
              priority
              className="object-cover"
              sizes="(max-w-768px) 100vw, 50vw"
            />
          </div>

          {/* Right Aspect: Detailed Stepper List */}
          <div className="space-y-6">
            {[
              { num: '1', title: 'Availability', desc: 'Get seamless access to your rides around the clock whenever and wherever.' },
              { num: '2', title: 'Find the perfect ride for you', desc: 'Choose from luxury sedans, sturdy SUVs, or economy fuel savers perfectly optimized for your budget.' },
              { num: '3', title: 'Customized luxury and premium packages', desc: 'Select top tier extras, secure full insurance protection options, and tailor navigation setups.' },
              { num: '4', title: 'Free modifications and updates available', desc: 'Plans change. That is why we provide simple adjustments directly inside your account hub dashboard.' }
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full flex items-center justify-center text-sm">
                  {item.num}
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CAR INVENTORY GRID SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Choose the car that<br />suits you</h2>
            <Link href="/vehicles" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm font-medium text-slate-400">
              Fetching fleet records from database...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-sm font-medium text-red-500">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 text-sm font-medium text-slate-400">
              No fleet vehicles available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((car) => (
                <div key={car._id} className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  {/* Dynamic Aspect Media view window */}
                  <div className="w-full aspect-[16/10] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-5 relative">
                    {renderImage(car)}
                  </div>
                  
                  <div>
                    {/* Brand details and rates container */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
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

                    {/* Styled Utilities specification strip */}
                    <div className="grid grid-cols-3 gap-1 py-3 border-t border-gray-50 text-[10px] font-semibold text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">⦚</span> {car.specs?.gearBox || 'Automatic'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">⛽</span> {car.specs?.fuel || 'Petrol'}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-gray-400">❄</span> Air Conditioner
                      </div>
                    </div>

                    <Link
                      href={`/vehicles/${car._id}`}
                      className="w-full bg-[#6366F1] text-white text-center text-xs font-bold py-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. STATS STRIP SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-[#6366F1] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <h3 className="text-2xl font-extrabold mb-2">Facts in Numbers</h3>
            <p className="text-indigo-100 text-xs font-light mb-8 max-w-md mx-auto">
              Providing high scale operations throughout the region with premium feedback ratings.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Cars', val: '540+' },
                { label: 'Customers', val: '20k+' },
                { label: 'Hubs', val: '50+' },
                { label: 'Miles', val: '30m+' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 text-gray-900 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xl font-black">{stat.val}</span>
                  <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </AuthGate>
  );
}