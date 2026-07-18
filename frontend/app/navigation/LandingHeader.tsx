"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfilePopup from "../profile/ProfilePopup";
import { useAuth } from "@/app/auth/AuthProvider";

// Header used only on the public landing page ("/"): logo plus auth-aware
// controls clustered at the top-left — Login/Sign up when logged out,
// a profile button when logged in — instead of the app-wide Header's
// full nav + right-aligned auth control.
export default function LandingHeader() {
  const router = useRouter();
  const auth = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const displayName = auth.user?.fullName || auth.user?.username || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    setIsLogoutConfirmOpen(false);
    router.refresh();
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4 font-sans">
        {/* Logo */}
        <div className="flex items-center space-x-2 group">
          <svg
            className="w-7 h-7 text-black transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 10.5V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4.5C3.4 11 2 12.3 2 14v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h14v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4c0-1.7-1.4-3-3-3.5zM7 6h10v3H7V6zm-1.5 9c-.8 0-1.5-.7-1.5-1.5S4.7 12 5.5 12s1.5.7 1.5 1.5S6.3 15 5.5 15zm13 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
          </svg>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Drivana</span>
        </div>

        {/* Top-left auth controls */}
        {auth.status === "ready" && (
          auth.isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 transition-smooth-fast hover:bg-gray-50 hover:shadow-sm active:scale-95"
            >
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-[#6366F1] font-bold text-xs flex items-center justify-center shrink-0">
                {initial}
              </span>
              <span className="text-sm font-semibold text-gray-900 max-w-[140px] truncate">{displayName}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-bold uppercase tracking-wider text-gray-900 px-4 py-2 rounded-xl transition-smooth-fast hover:bg-gray-50 active:scale-95"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-bold uppercase tracking-wider text-white bg-[#6366F1] px-4 py-2 rounded-xl shadow-sm transition-smooth-fast hover:bg-indigo-600 hover:shadow-md active:scale-95"
              >
                Sign up
              </Link>
            </div>
          )
        )}
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
