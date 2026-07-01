"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthRole = "user" | "admin";

export type AuthUser = {
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  role?: AuthRole;
};

type AuthSession = {
  token: string;
  user: AuthUser | null;
};

type AuthStatus = "loading" | "ready";

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  login: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const safeParseUser = (value: string | null): AuthUser | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as AuthUser;

    if (parsed.role === "admin" || parsed.role === "user") {
      return parsed;
    }

    return {
      ...parsed,
      role: "user"
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const syncSessionFromStorage = () => {
      const storedToken = window.localStorage.getItem("token") ?? "";
      const storedUser = safeParseUser(window.localStorage.getItem("user"));

      setToken(storedToken);
      setUser(storedUser);
      setStatus("ready");
    };

    syncSessionFromStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "user" || event.key === null) {
        syncSessionFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (session: AuthSession) => {
    window.localStorage.setItem("token", session.token);
    if (session.user) {
      window.localStorage.setItem("user", JSON.stringify(session.user));
    }

    setToken(session.token);
    setUser(session.user);
    setStatus("ready");
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("admin");

    setToken("");
    setUser(null);
    setStatus("ready");
  };

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role === "admin" ? "admin" : user?.role === "user" ? "user" : null;

    return {
      token,
      user,
      role,
      isAuthenticated: Boolean(token),
      status,
      login,
      logout
    };
  }, [status, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}