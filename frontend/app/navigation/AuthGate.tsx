"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();

  const isAuthorized = useSyncExternalStore(
    () => () => {},
    () => Boolean(window.localStorage.getItem("token")),
    () => false
  );

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/auth/login");
    }
  }, [isAuthorized, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-sm font-medium text-gray-500">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}