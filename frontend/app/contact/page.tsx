"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

export default function ContactUsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    carType: '',
    pickupLocation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.carType || !formData.pickupLocation) {
      alert('Please fill out all the booking criteria.');
      return;
    }
    router.push(`/vehicles?category=${encodeURIComponent(formData.carType)}`);
  };

  return (
    <AuthGate>
      <div className="w-full bg-white font-sans text-gray-900 min-h-screen pb-16">
        <Header />

        {/* SECTION TITLE & BREADCRUMB */}
        <section className="max-w-7xl mx-auto px-4 pt-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Contact Us</h1>
          <div className="text-xs font-semibold text-gray-400 flex justify-center items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-800">Contact Us</span>
          </div>
        </section>

        {/* HERO BOOKING GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Booking Widget Column */}
            <div className="lg:col-span-4 bg-[#543EE3] rounded-[28px] p-8 flex flex-col justify-between shadow-lg text-white">
              <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-6 text-center">Book your car</h2>
                  
                  <div className="space-y-4">
                      {/* Car Type Dropdown Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1.5">Car type</label>
                        <div className="relative">
                          <select 
                            name="carType"
                            value={formData.carType}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-white/60 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled hidden>Select type</option>
                            <option value="suv" className="text-gray-900">SUV</option>
                            <option value="sedan" className="text-gray-900">Sedan</option>
                            <option value="coupe" className="text-gray-900">Coupe</option>
                            <option value="ev" className="text-gray-900">EV</option>
                          </select>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80 text-[10px]">▼</span>
                        </div>
                      </div>

                      {/* Pick up location */}
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1.5">Pick up location</label>
                        <div className="relative">
                          <select 
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-white/60 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled hidden>Select location</option>
                            <option value="dillibazar" className="text-gray-900">Dillibazar, Kathmandu</option>
                            <option value="new_baneshwor" className="text-gray-900">New Baneshwor, Kathmandu</option>
                          </select>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80 text-[10px]">▼</span>
                        </div>
                      </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#FFA000] text-white text-xs font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-sm mt-8 tracking-wide uppercase"
                >
                  Book now
                </button>
              </form>
            </div>

            {/* Banner Showcase Image Column */}
            <div className="lg:col-span-8 bg-gray-100/80 rounded-[28px] overflow-hidden relative min-h-[340px] shadow-sm border border-gray-100">
              <Image 
                src="/rollsroyce.jpg" 
                alt="Premium Car Showcase" 
                fill 
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

          </div>
        </section>

        {/* INFO STRIP BADGES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Address Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFA000] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">📍</div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 tracking-wide">Address</h4>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">Oxford Ave. Cary, NC 27511</p>
              </div>
            </div>

            {/* Email Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFA000] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">✉</div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 tracking-wide">Email</h4>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">nwiqer@yahoo.com</p>
              </div>
            </div>

            {/* Phone Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFA000] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">📞</div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 tracking-wide">Phone</h4>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">+537 547-6401</p>
              </div>
            </div>

            {/* Opening Hours Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFA000] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">🕒</div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 tracking-wide">Opening hours</h4>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">Sun-Mon: 10am - 10pm</p>
              </div>
            </div>

          </div>
        </section>

        {/* BRAND FOOTER BAR */}
        <section className="max-w-7xl mx-auto px-4 mt-24">
          <div className="w-full bg-gray-50/60 rounded-[32px] py-6 px-10 flex flex-wrap items-center justify-around gap-6 border border-gray-100/50">
            {BRAND_LOGOS.map((logo, idx) => (
              <div key={idx} className="relative h-7 w-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-200">
                <Image 
                  src={logo.src} 
                  alt={logo.alt} 
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