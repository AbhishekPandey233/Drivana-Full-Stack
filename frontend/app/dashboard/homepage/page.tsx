"use client";

//homepage

import Link from 'next/link';
import React from 'react';

// Simple types for our structured mock data
interface CarCard {
  id: number;
  brand: string;
  model: string;
  price: number;
}

export default function Homepage() {
  const cars: CarCard[] = [
    { id: 1, brand: 'Mercedes', model: 'AMG', price: 75 },
    { id: 2, brand: 'Porsche', model: '911', price: 95 },
    { id: 3, brand: 'Mercedes', model: 'C-Class', price: 65 },
    { id: 4, brand: 'Hyundai', model: 'Ioniq', price: 45 },
    { id: 5, brand: 'Toyota', model: 'Prius', price: 35 },
    { id: 6, brand: 'Porsche', model: 'Taycan', price: 110 },
  ];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-16">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
            Drivana
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <Link href="/" className="text-gray-900 font-bold transition-colors hover:text-indigo-600">
              Home
            </Link>
            <Link href="/vehicles" className="text-gray-600 transition-colors hover:text-gray-900">
              Vehicles
            </Link>
            <Link href="/details" className="text-gray-600 transition-colors hover:text-gray-900">
              Details
            </Link>
            <Link href="/about" className="text-gray-600 transition-colors hover:text-gray-900">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 transition-colors hover:text-gray-900">
              Contact Us
            </Link>
          </nav>
          <Link
            href="/auth/login"
            className="inline-flex items-center self-center rounded-full bg-[#6366F1] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 lg:self-auto"
          >
            Login
          </Link>
        </div>
      </header>
      
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
            <button className="bg-[#F59E0B] hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md">
              View all cars
            </button>
          </div>

          {/* Hero Right: Booking Form Container Card */}
          <div className="mt-8 lg:mt-0 w-full max-w-sm bg-white rounded-2xl p-6 text-gray-800 shadow-xl z-10">
            <h3 className="text-lg font-bold text-center mb-4">Book your car</h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Car type</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none">
                  <option>Select</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Pick up location</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none">
                  <option>Select</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Pick up date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Return date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none" />
              </div>
              <button className="w-full bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-sm py-3 rounded-lg uppercase mt-4 transition">
                Book now
              </button>
            </form>
          </div>
          
          {/* Static abstract backdrop silhouette mimicking the blurred car graphic in image_55be42.png */}
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
        {/* Left Aspect: Static Placeholder for Side Car Image */}
        <div className="bg-gray-100 rounded-3xl aspect-[4/3] w-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden text-gray-400">
          <span className="text-sm italic">Static Car Image Placeholder</span>
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
          <button className="text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-1">
            View All <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between">
              {/* Car Silhouette Dynamic Container */}
              <div className="w-full h-32 bg-gray-200/60 rounded-xl mb-4 flex items-center justify-center text-xs text-gray-400 italic">
                Car Image Outline
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{car.brand}</h4>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{car.model}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-600 font-extrabold text-lg">${car.price}</span>
                    <p className="text-[10px] text-gray-400">/ per day</p>
                  </div>
                </div>

                {/* Micro Icons specs row */}
                <div className="grid grid-cols-3 gap-1 my-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">⚙️ Automatic</span>
                  <span className="flex items-center gap-1">⛽ Petrol</span>
                  <span className="flex items-center gap-1">👥 5 Seats</span>
                </div>

                <button className="w-full bg-[#6366F1] hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
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

      {/* 6. NEWSLETTER / BOTTOM HERO STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#6366F1] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
          <div className="max-w-md space-y-3 z-10">
            <h3 className="text-2xl font-bold leading-snug">
              Enjoy every mile with adorable companionship.
            </h3>
            <p className="text-indigo-100 text-xs font-light">
              Subscribe to get immediate notification drops updates directly inside your mail account inbox.
            </p>
            {/* Inline Email Input form bar */}
            <div className="pt-2 flex max-w-sm">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 text-xs rounded-l-lg text-gray-800 outline-none" 
              />
              <button className="bg-[#F59E0B] hover:bg-amber-600 px-4 py-2 text-xs font-bold rounded-r-lg whitespace-nowrap transition">
                Subscribe
              </button>
            </div>
          </div>
          
          {/* Static Car Outline Shadow graphic on the right matching layout from image_55be42.png */}
          <div className="mt-6 md:mt-0 opacity-20 text-7xl select-none filter blur-[2px] pointer-events-none transform md:scale-150">
            🚙💨
          </div>
        </div>
      </section>

    </div>
  );
}