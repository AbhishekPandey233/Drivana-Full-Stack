"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthProvider";

interface AuthGateProps {
  children: React.ReactNode;
  allowedRoles?: Array<"user" | "admin">;
  fallbackPath?: string;
}

export default function AuthGate({
  children,
  allowedRoles,
  fallbackPath = "/auth/login"
}: AuthGateProps) {
  const router = useRouter();
  const auth = useAuth();

  const isRoleAllowed = !allowedRoles || (auth.role !== null && allowedRoles.includes(auth.role));
  const canAccessRoute = auth.status === "ready" && auth.isAuthenticated && isRoleAllowed;

  useEffect(() => {
    if (auth.status !== "ready") {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace(fallbackPath);
      return;
    }

    if (!isRoleAllowed) {
      // If a normal user manually hits an admin URL, send them back to the standard dashboard.
      router.replace("/dashboard");
    }
  }, [auth.isAuthenticated, auth.status, fallbackPath, isRoleAllowed, router]);

  if (!canAccessRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-sm font-medium text-gray-500">
        Loading session...
      </div>
    );
  }

  return <>{children}</>;
}