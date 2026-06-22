import Link from "next/link";

export default function RegisterForm() {
    return (
        <section className="w-full max-w-[490px]">
            <div className="rounded-[18px] border border-violet-300/90 bg-white/72 px-5 py-5 shadow-[0_24px_60px_rgba(92,72,168,0.18)] backdrop-blur-sm sm:px-8 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                    <Link
                        href="/"
                        className="mt-1 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-slate-900 transition-colors hover:text-violet-600"
                    >
                        Back
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">        
                        Register
                    </h1>
                    {/* Empty placeholder div to keep the alignment balanced with flexbox layout */}
                    <div className="w-10"></div>
                </div>

                <form className="mt-7 space-y-5" action="#">
                    <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">                                           
                        <label className="block">
                            <span className="sr-only">Full Name</span>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Email</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Password</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Confirm Password</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="h-9 w-full rounded-sm border border-slate-400 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-1">
                        <button
                            type="button"
                            className="inline-flex h-9 w-40 items-center justify-center rounded-md bg-[linear-gradient(180deg,#5d28ff,#6512f1)] px-4 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(98,34,245,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            Sign up
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-9 w-32 items-center justify-center rounded-md border border-violet-400 bg-white px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-violet-50"
                        >
                            Login
                        </button>

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