"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer'; // Imported from your navigation folder
import AuthGate from '../navigation/AuthGate';


const BRAND_LOGOS = [
  { src: '/toyotalogo.png', alt: 'Toyota' },
  { src: '/fordlogo.png', alt: 'Ford' },
  { src: '/mercedeslogo.png', alt: 'Mercedes' },
  { src: '/jeeplogo.png', alt: 'Jeep' },
  { src: '/bmwlogo.png', alt: 'BMW' },
  { src: '/audilogo.png', alt: 'Audi' },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How To Choose The Right Car',
    category: 'News',
    date: '12 April 2024',
    bgClass: 'bg-gradient-to-br from-blue-200 to-gray-300' // Mock blurred backdrop styling 
  },
  {
    id: 2,
    title: 'Which plan is right for me?',
    category: 'News',
    date: '12 April 2024',
    bgClass: 'bg-gradient-to-br from-sky-200 to-blue-300'
  },
  {
    id: 3,
    title: 'Enjoy Speed, Choice & Total Control',
    category: 'News',
    date: '12 April 2024',
    bgClass: 'bg-gradient-to-br from-indigo-200 to-slate-300'
  }
];

export default function ContactUsPage() {
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

      {/* HERO HERO BOOKING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Booking Widget Column */}
          <div className="lg:col-span-4 bg-[#543EE3] rounded-[28px] p-8 flex flex-col justify-between shadow-lg text-white">
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-6">Book your car</h2>
              
              <form className="space-y-3.5">
                {/* Car Type Dropdown Selection */}
                <div className="relative">
                  <select 
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white/90 placeholder-white/60 focus:outline-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Car type</option>
                    <option value="sedan" className="text-gray-900">Sedan</option>
                    <option value="suv" className="text-gray-900">SUV</option>
                    <option value="pickup" className="text-gray-900">Pickup</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-[10px]">▼</span>
                </div>

                {/* Place of Rental */}
                <div className="relative">
                  <select 
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white/90 placeholder-white/60 focus:outline-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Place of rental</option>
                    <option value="loc1" className="text-gray-900">Airport Terminal 1</option>
                    <option value="loc2" className="text-gray-900">Downtown Branch</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-[10px]">▼</span>
                </div>

                {/* Place of Return */}
                <div className="relative">
                  <select 
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white/90 placeholder-white/60 focus:outline-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Place of return</option>
                    <option value="loc1" className="text-gray-900">Airport Terminal 1</option>
                    <option value="loc2" className="text-gray-900">Downtown Branch</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-[10px]">▼</span>
                </div>

                {/* Rental Date Input */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rental date" 
                    onFocus={(e) => e.target.type = 'date'}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white/90 placeholder-white/70 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-xs">📅</span>
                </div>

                {/* Return Date Input */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Return date" 
                    onFocus={(e) => e.target.type = 'date'}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white/90 placeholder-white/70 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-xs">📅</span>
                </div>
              </form>
            </div>

            <button className="w-full bg-[#FFA000] text-white text-xs font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-sm mt-8 tracking-wide">
              Book now
            </button>
          </div>

          {/* Banner Showcase Image Column - Updated with Rolls Royce graphic element */}
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

      {/* LATEST BLOG POSTS & NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">Latest blog posts & news</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              
              {/* Blurred/Stylized backdrop proxy image box placeholder */}
              <div className={`w-full aspect-[16/10] ${post.bgClass} rounded-3xl mb-4 relative overflow-hidden shadow-inner filter brightness-95 group-hover:brightness-90 transition-all duration-200 flex items-center justify-center`}>
                <span className="text-4xl opacity-20 filter blur-[1px] select-none">📰</span>
              </div>

              {/* Title & metadata specs details */}
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#543EE3] transition-colors mb-2">
                {post.title}
              </h3>
              <div className="text-[11px] text-gray-400 font-bold tracking-wide space-x-1">
                <span>{post.category}</span>
                <span>/</span>
                <span>{post.date}</span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* BRAND FOOTER BAR Component integration alignment */}
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
{/* GLOBAL SITE FOOTER COMPONENT */}
      <Footer />
    </div>
    </AuthGate>
  );
}