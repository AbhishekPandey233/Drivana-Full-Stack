"use client";

import React from "react";
import Link from "next/link";
import Header from "../navigation/Header";
import Footer from '../navigation/Footer'; // Imported from your navigation folder
import AuthGate from "../navigation/AuthGate";


export default function Dashboard() {
	return (
		<AuthGate>
		<div className="min-h-screen font-sans text-gray-900">
			<Header />

			<main
				className="w-full bg-center bg-no-repeat bg-cover min-h-screen flex items-center justify-center"
				style={{ backgroundImage: "url('/carbackground.jpg')" }}
			>
				<div className="bg-black/40 w-full min-h-screen flex items-center justify-center animate-fade-in">
					<div className="max-w-4xl mx-auto p-8 text-center text-white">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">Welcome to Drivana Dashboard</h1>
						<p className="text-lg md:text-xl text-gray-100/90 mb-6 animate-fade-in-up stagger-1">
							Manage your bookings, view available vehicles, and monitor activity from a single place.
						</p>
						<div className="flex items-center justify-center gap-4 animate-fade-in-up stagger-2">
							<Link href="/dashboard/homepage" className="bg-[#F59E0B] px-5 py-3 rounded-xl font-semibold text-gray-900 transition-smooth-fast hover:bg-amber-500 hover:scale-105 hover:shadow-lg active:scale-95">
								View Dashboard Home
							</Link>
							<Link href="/vehicles" className="border border-white/30 px-5 py-3 rounded-xl text-white transition-smooth-fast hover:bg-white/10 hover:scale-105 active:scale-95">
								Browse Vehicles
							</Link>
						</div>
					</div>
				</div>
			</main>
			{/* GLOBAL SITE FOOTER COMPONENT */}
				  <Footer />
		</div>
		</AuthGate>
	);
}