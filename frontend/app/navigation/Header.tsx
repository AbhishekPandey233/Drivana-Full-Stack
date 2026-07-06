"use client";

import React, { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProfilePopup from '../profile/ProfilePopup';
import { useAuth } from '@/app/auth/AuthProvider';

const BACKEND_URL = "http://localhost:5000/api/vehicles";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [firstVehicleId, setFirstVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstVehicle = async () => {
      try {
        const res = await fetch(BACKEND_URL);
        if (res.ok) {
          const vehicles = await res.json();
          if (vehicles.length > 0) {
            setFirstVehicleId(vehicles[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to prefetch first vehicle for nav", err);
      }
    };

    void fetchFirstVehicle();
  }, []);

  const isDetailsActive = pathname.startsWith('/vehicles/');

  const getLinkClass = (path: string, active?: boolean) => {
    const baseClass = "text-sm font-medium transition-colors";
    const activeClass = "text-gray-900 font-bold";
    const inactiveClass = "text-gray-600 hover:text-gray-900";
    
    const isActive = active ?? pathname === path;
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  const handleDetailsClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (firstVehicleId) {
      router.push(`/vehicles/${firstVehicleId}`);
    } else {
      try {
        const res = await fetch(BACKEND_URL);
        if (res.ok) {
          const vehicles = await res.json();
          if (vehicles.length > 0) {
            router.push(`/vehicles/${vehicles[0]._id}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch vehicle for details redirect", err);
      }
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    setIsLogoutConfirmOpen(false);
    router.replace('/auth/login');
  };

  return (
    <>
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
      <div className="flex items-center space-x-8">
        <Link href="/" className={getLinkClass('/')}>
          Home
        </Link>
        <Link href="/vehicles" className={getLinkClass('/vehicles', !isDetailsActive)}>
          Vehicles
        </Link>
        <Link
          href={firstVehicleId ? `/vehicles/${firstVehicleId}` : '#'}
          className={getLinkClass('', isDetailsActive)}
          onClick={handleDetailsClick}
        >
          Details
        </Link>
        <Link href="/about" className={getLinkClass('/about')}>
          About Us
        </Link>
        <Link href="/contact" className={getLinkClass('/contact')}>
          Contact Us
        </Link>
        <Link href="/viewRents" className={getLinkClass('/viewRents')}>
          View Rents
        </Link>
      </div>

      {/* Right side: Logout Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="text-sm font-bold tracking-wider text-gray-900 uppercase hover:opacity-80 transition-opacity"
        >
          {auth.isAuthenticated ? 'LOGOUT' : 'LOGIN'}
        </button>
      </div>

    </nav>

    <ProfilePopup
      open={isProfileOpen}
      onClose={() => {
        setIsProfileOpen(false);
        setIsLogoutConfirmOpen(false);
      }}
      onLogoutRequest={() => setIsLogoutConfirmOpen(true)}
      onLogoutConfirm={handleLogout}
      logoutConfirmOpen={isLogoutConfirmOpen}
      user={auth.user ?? {}}
    />
    </>
  );
}
