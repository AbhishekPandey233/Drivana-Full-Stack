"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (formData.password.length < 7) {
            setError("Password must be at least 7 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess(`Success! Your assigned username is: ${data.username}. Redirecting to login...`);
            
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);

        } catch (error: unknown) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full max-w-[490px]">
            <div className="rounded-[18px] border border-violet-300/90 bg-white/72 px-5 py-5 shadow-[0_24px_60px_rgba(92,72,168,0.18)] backdrop-blur-sm sm:px-8 sm:py-6 animate-scale-in">
                <div className="flex items-start justify-between gap-4">
                    <Link
                        href="/"
                        className="mt-1 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-slate-900 transition-smooth-fast hover:text-violet-600 hover:-translate-x-0.5"
                    >
                        Back
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Register
                    </h1>
                    <div className="w-10"></div>
                </div>

                {error && (
                    <div className="mt-4 p-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md animate-shake">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md animate-fade-in-up">
                        {success}
                    </div>
                )}

                <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">                                           
                        <label className="block">
                            <span className="sr-only">Full Name</span>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
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
                                    className="h-9 w-full rounded-sm border border-slate-400 bg-white pl-3 pr-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-smooth-fast"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                                </button>
                            </div>
                        </label>

                        <label className="block">
                            <span className="sr-only">Confirm Password</span>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="h-9 w-full rounded-sm border border-slate-400 bg-white pl-3 pr-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-smooth-fast focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-smooth-fast"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                                </button>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-9 w-40 items-center justify-center rounded-md bg-[linear-gradient(180deg,#5d28ff,#6512f1)] px-4 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(98,34,245,0.5)] transition-smooth-fast hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(98,34,245,0.6)] active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? "Signing up..." : "Sign up"}
                        </button>

                        <Link
                            href="/auth/login"
                            className="inline-flex h-9 w-32 items-center justify-center rounded-md border border-violet-400 bg-white px-4 text-sm font-medium text-slate-500 transition-smooth-fast hover:bg-violet-50 hover:-translate-y-0.5 active:scale-95 text-center"
                        >
                            Login
                        </Link>

                        <p className="text-center text-xs text-slate-700">
                            Already signed up ?{" "}
                            <Link href="/auth/login" className="font-bold text-slate-900 underline-offset-2 hover:underline">
                                Click Here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}