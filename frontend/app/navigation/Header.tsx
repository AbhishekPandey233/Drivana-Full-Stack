//header
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between font-sans">
      
      {/* Left side: Logo */}
      <div className="flex items-center space-x-2">
        {/* Simple inline car SVG matching your logo */}
        <svg 
          className="w-7 h-7 text-black" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M19 10.5V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4.5C3.4 11 2 12.3 2 14v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h14v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4c0-1.7-1.4-3-3-3.5zM7 6h10v3H7V6zm-1.5 9c-.8 0-1.5-.7-1.5-1.5S4.7 12 5.5 12s1.5.7 1.5 1.5S6.3 15 5.5 15zm13 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
        </svg>
        <span className="text-lg font-bold text-gray-900 tracking-tight">Drivana</span>
      </div>

      {/* Middle side: Navigation Links */}
      <div className="flex items-center space-x-8 text-sm font-medium">
        <Link href="/" className="text-gray-900 font-bold">
          Home
        </Link>
        <Link href="/vehicles" className="text-gray-600 hover:text-gray-900 transition-colors">
          Vehicles
        </Link>
        <Link href="/details" className="text-gray-600 hover:text-gray-900 transition-colors">
          Details
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
          Contact Us
        </Link>
      </div>

      {/* Right side: Login Button */}
      <div className="flex items-center">
        <Link 
          href="/auth/login" 
          className="text-sm font-bold tracking-wider text-gray-900 uppercase hover:opacity-80 transition-opacity"
        >
          LOGIN
        </Link>
      </div>

    </nav>
  );
}