"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer'; // Imported from your navigation folder
import AuthGate from '../navigation/AuthGate';

export default function AboutPage() {
  // State to handle the FAQ accordion logic individually
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "How does it work?",
      a: "Simply browse through our extensive collection of premium vehicles, pick your preferred location, date, and checkout. Your car will be prepped and waiting for you."
    },
    {
      q: "Can I rent a car without a credit card?",
      a: "We support multiple payment channels including standard credit cards, major debit networks, and modern verified online payment methods."
    },
    {
      q: "What are the requirements for renting a car?",
      a: "You need a valid driver's license held for at least one year, to meet local age restrictions, and a valid payment method under the driver's name."
    },
    {
      q: "Does Car Rental allow me to tow with or attach a hitch to the rental vehicle?",
      a: "Towing requirements depend heavily on the chosen category tier. Please refer to our specialized commercial rental packages or consult support prior to your departure."
    },
    {
      q: "Does Car Rental offer coverage products for purchase with my rental?",
      a: "Yes, we provide several tiers of integrated damage protections, comprehensive packages, and personal item protection selections inside your profile checkout hub."
    }
  ];

  const showcaseCars = [
    { id: 1, name: "Rolls-Royce", src: "/rollsroyce.jpg" },
    { id: 2, name: "Mercedes Sedan", src: "/sudanMercedes.jpeg" },
    { id: 3, name: "SUV Jeep", src: "/SUVJEEP.jpeg" }
  ];

  return (
    <AuthGate>
    <div className="w-full bg-white font-sans text-gray-900 pb-16">
      <Header />

      {/* 1. BREADCRUMB PAGE TITLE */}
      <section className="text-center py-12 bg-gray-50/50 border-b border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">About Us</h1>
        <p className="text-xs font-medium text-gray-400">
          Home <span className="mx-1 text-gray-300">/</span> <span className="text-indigo-600 font-semibold">About Us</span>
        </p>
      </section>

      {/* 2. VALUE PROPOSITION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left bold statement */}
        <div className="md:col-span-1 flex items-center">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-gray-900">
            Where every drive feels extraordinary
          </h2>
        </div>
        
        {/* Right 2 columns broken down into a 2x2 text feature cluster */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          <div>
            <h4 className="font-bold text-base mb-2 text-gray-900">Variety Brands</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We provide a wide variety of vehicle brands like Mercedes, BMW, Toyota, and Ford.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-2 text-gray-900">Awesome Support</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Our technical support will provide you the best customer service experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-2 text-gray-900">Maximum Freedom</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              You can rent a car anywhere, anytime, and go anywhere you wish!
            </p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-2 text-gray-900">Flexibility On The Go</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We provide flexibility on the go with hassle-free extensions and plan adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BIG STATS COUNTER BAR */}
      <section className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-3 gap-6 text-center border-y border-gray-100 my-4">
        <div>
          <span className="text-3xl md:text-4xl font-black text-[#6366F1]">20k+</span>
          <p className="text-xs font-bold text-gray-800 mt-1">Happy customers</p>
        </div>
        <div>
          <span className="text-3xl md:text-4xl font-black text-[#6366F1]">540+</span>
          <p className="text-xs font-bold text-gray-800 mt-1">Count of cars</p>
        </div>
        <div>
          <span className="text-3xl md:text-4xl font-black text-[#6366F1]">25+</span>
          <p className="text-xs font-bold text-gray-800 mt-1">Years of experience</p>
        </div>
      </section>

      {/* 4. UNFORGETTABLE MEMORIES & FEATURE ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight max-w-md">
            Unlock unforgettable memories on the road
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            Use our website to rent and unlock unforgettable memories on the road with customized premium rentals.
          </p>
          
          {/* Checkmark grid layout elements */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              "Maximum flexibility on the go",
              "Awesome Support",
              "Maximum freedom",
              "Variety Brands"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right side luxury showcase graphic container displaying aboutpageimage.jpeg */}
        <div className="bg-gray-100 rounded-3xl aspect-[4/3] w-full flex flex-col items-center justify-center border border-gray-200 order-1 md:order-2 shadow-sm overflow-hidden relative">
          <Image 
            src="/aboutpageimage.jpeg"
            alt="Drivana Fleet Showcase"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* 5. OUR CARS SHOWCASE GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/40 rounded-3xl">
        <h2 className="text-2xl font-extrabold text-center mb-12 tracking-tight">Our Cars</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {showcaseCars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                <Image 
                  src={car.src}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 text-center border-t border-gray-50 bg-white">
                <h3 className="font-bold text-sm text-gray-800 tracking-wide">{car.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TOP CAR RENTAL ACCORDION QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-center mb-8 tracking-tight">Top Car Rental Questions</h2>
        
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-gray-800 hover:bg-gray-50/50 transition-colors"
              >
                <span>{item.q}</span>
                <span className={`text-xs transform transition-transform duration-200 text-gray-400 ${openFaq === index ? 'rotate-180' : ''}`}>
                  ▲
                </span>
              </button>
              
              {openFaq === index && (
                <div className="p-4 pt-0 border-t border-gray-50 text-xs text-gray-500 leading-relaxed animate-fadeIn">
                  {item.a}
                </div>
              )}
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