"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function LoginForm() {
    const router = useRouter();
    const auth = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) {
            return error.message;
        }

        return "Something went wrong. Please try again.";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(""); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            const role = data.user?.role ?? data.role ?? "user";
            const authenticatedUser = { ...data.user, role };

            auth.login({ token: data.token, user: authenticatedUser });

            // Admins go to the admin dashboard; standard users go to the regular dashboard.
            router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
        } catch (error: unknown) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full max-w-[490px]">
            <div className="rounded-[20px] border border-violet-300/90 bg-white/80 px-5 py-5 shadow-[0_24px_60px_rgba(92,72,168,0.18)] backdrop-blur-sm sm:px-7 sm:py-5 animate-scale-in">
                <div className="flex items-start justify-between gap-4">
                    <Link
                        href="/"
                        className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-900 transition-smooth-fast hover:text-violet-600 hover:-translate-x-0.5"
                    >
                        Back
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        LOGIN
                    </h1>
                    <div className="w-10"></div>
                </div>

                {error && (
                    <div className="mt-4 p-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md animate-shake">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <label className="block">
                            <span className="sr-only">User Name</span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="User Name or Email"
                                className="h-8 w-full rounded-sm border border-slate-400 bg-white px-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Password</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="h-8 w-full rounded-sm border border-slate-400 bg-white pl-2.5 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-smooth-fast"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                                </button>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-8 w-28 items-center justify-center rounded-md bg-[linear-gradient(180deg,#5d28ff,#6512f1)] px-4 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(98,34,245,0.5)] transition-smooth-fast hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(98,34,245,0.6)] active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <Link
                            href="/auth/register"
                            className="inline-flex h-8 w-24 items-center justify-center rounded-md border border-violet-400 bg-white px-4 text-sm font-medium text-slate-500 transition-smooth-fast hover:bg-violet-50 hover:-translate-y-0.5 active:scale-95"
                        >
                            Sign up
                        </Link>

                        <p className="text-center text-xs text-slate-700">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="font-bold text-slate-900 underline-offset-2 hover:underline">
                                Register Here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}