//Footerimport React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Camera, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-0 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP ROW: LOGO & CONTACT INFO STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-100 items-start">
          
          {/* Main Logo Group */}
          <div className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-black text-base tracking-tight">DRIVANA</span>
          </div>

          {/* Contact Item: Address */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFA000] text-white flex items-center justify-center shadow-sm shrink-0"><MapPin className="w-4 h-4" strokeWidth={2.25} /></div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Address</h4>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">KATHMANDU</p>
            </div>
          </div>

          {/* Contact Item: Email */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFA000] text-white flex items-center justify-center shadow-sm shrink-0"><Mail className="w-4 h-4" strokeWidth={2.25} /></div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Email</h4>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">AVENGER@gmail.com</p>
            </div>
          </div>

          {/* Contact Item: Phone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFA000] text-white flex items-center justify-center shadow-sm shrink-0"><Phone className="w-4 h-4" strokeWidth={2.25} /></div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Phone</h4>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">9876543212</p>
            </div>
          </div>

        </div>

        {/* MIDDLE ROW: DESCRIPTION & LINK COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 pt-10 pb-12">
          
          {/* Brand Intro Statement Panel */}
          <div className="lg:col-span-5 pr-4">
            <p className="text-sm font-extrabold text-gray-900 tracking-normal leading-snug max-w-sm">
              Book any car any time. The most convenient way to travel. <br />
              It is time to experience the freedom of the open road with our premium car rental service. Whether your planning a weekend getaway or a business trip, we have the perfect vehicle for you.
            </p>
            
            {/* Social Icons Strip */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold transition-smooth-fast hover:opacity-80 hover:-translate-y-0.5 hover:shadow-md">f</a>
              <a href="#" className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center transition-smooth-fast hover:opacity-80 hover:-translate-y-0.5 hover:shadow-md"><Camera className="w-3.5 h-3.5" strokeWidth={2.25} /></a>
              <a href="#" className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold transition-smooth-fast hover:opacity-80 hover:-translate-y-0.5 hover:shadow-md">𝕏</a>
              <a href="#" className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center transition-smooth-fast hover:opacity-80 hover:-translate-y-0.5 hover:shadow-md"><Play className="w-3 h-3" strokeWidth={2.25} fill="currentColor" /></a>
            </div>
          </div>

          {/* Column 1 Links: Useful Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-sm font-black text-gray-900 mb-4 tracking-tight">Useful links</h3>
            <ul className="space-y-2.5 text-xs font-bold text-gray-500">
              <li><Link href="/about" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">About us</Link></li>
              <li><Link href="/contact" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Contact us</Link></li>
              <li><Link href="/vehicles" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Vehicles</Link></li>
            </ul>
          </div>

          {/* Column 2 Links: Vehicles Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-black text-gray-900 mb-4 tracking-tight">Vehicles</h3>
            <ul className="space-y-2.5 text-xs font-bold text-gray-500">
              <li><Link href="/vehicles?type=sedan" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Sedan</Link></li>
              <li><Link href="/vehicles?type=cabriolet" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Cabriolet</Link></li>
              <li><Link href="/vehicles?type=pickup" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Pickup</Link></li>
              <li><Link href="/vehicles?type=minivan" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">Minivan</Link></li>
              <li><Link href="/vehicles?type=suv" className="inline-block transition-smooth-fast hover:text-indigo-600 hover:translate-x-1">SUV</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW: COPYRIGHT NOTICES */}
        <div className="pt-6 border-t border-gray-50 text-center text-[9px] font-bold text-gray-400 tracking-wide">
          © Copyright Drivana 2026. Design by Abhishek
        </div>

      </div>
    </footer>
  );
}