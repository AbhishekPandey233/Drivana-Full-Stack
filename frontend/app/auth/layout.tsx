import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative h-screen overflow-hidden bg-[#f5f1ed] text-slate-900">
			<div className="absolute inset-0">
				<Image
					src="/loginandregisterpageimage.jpg"
					alt="Drivana background"
					fill
					priority
					className="object-cover object-center opacity-20"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.93),rgba(255,255,255,0.87))]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_46%,rgba(255,255,255,0.98)_0_34%,rgba(255,255,255,0.78)_35_46%,rgba(216,112,239,0.14)_47_54%,rgba(101,94,255,0.42)_55_72%,rgba(101,94,255,0.88)_73_100%)]" />
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-0 top-1/2 hidden h-40 w-28 -translate-y-1/2 rounded-3xl bg-[linear-gradient(135deg,#5b3fe7,#d96af5)] shadow-[0_20px_35px_rgba(66,52,150,0.35)] md:block"
				style={{ clipPath: "polygon(0 12%, 100% 0, 82% 100%, 16% 88%)" }}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-0 bottom-0 hidden h-32 w-24 rounded-3xl bg-[linear-gradient(135deg,#a55df5,#c784f3)] shadow-[0_20px_35px_rgba(66,52,150,0.28)] md:block animate-float"
				style={{ clipPath: "polygon(0 8%, 100% 0, 84% 100%, 0 94%)", animationDelay: "1.5s" }}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute right-8 top-4 hidden h-28 w-28 rounded-full bg-[linear-gradient(180deg,#9667f7,#d770ef)] shadow-[0_16px_25px_rgba(100,80,190,0.32)] md:block animate-float"
				style={{ animationDelay: "0.5s" }}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute right-0 top-20 hidden h-24 w-24 rounded-full bg-[linear-gradient(180deg,#c968ef,#6d8ef7)] shadow-[0_16px_25px_rgba(100,80,190,0.32)] md:block animate-float"
				style={{ animationDelay: "2.5s" }}
			/>

			<div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-sm border-2 border-sky-500 bg-white px-2.5 py-1.5 shadow-sm transition-smooth-fast hover:-translate-y-0.5 hover:shadow-md active:scale-95"
				>
					<span className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-slate-900 text-[8px] font-black leading-none text-slate-900">
						C
					</span>
					<span className="text-sm font-medium text-slate-900">Drivana</span>
				</Link>
			</div>

			<main className="relative z-10 flex h-[calc(100vh-3.75rem)] items-center justify-center overflow-hidden px-4 py-2 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
