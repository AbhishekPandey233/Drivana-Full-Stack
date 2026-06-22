import Link from "next/link";

export default function LoginForm() {
    return (
        <section className="w-full max-w-[490px]">
            <div className="rounded-[20px] border border-violet-300/90 bg-white/80 px-5 py-5 shadow-[0_24px_60px_rgba(92,72,168,0.18)] backdrop-blur-sm sm:px-7 sm:py-5">
                <div className="flex items-start justify-between gap-4">
                    <Link
                        href="/"
                        className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-900 transition-colors hover:text-violet-600"
                    >
                        Back
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">        
                        LOGIN
                    </h1>
                    {/* Empty placeholder div to keep the alignment balanced with flexbox layout */}
                    <div className="w-10"></div>
                </div>

                <form className="mt-6 space-y-6" action="#">
                    <div className="space-y-5">
                        <label className="block">
                            <span className="sr-only">User Name</span>
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                className="h-8 w-full rounded-sm border border-slate-400 bg-white px-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>

                        <label className="block">
                            <span className="sr-only">Password</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="h-8 w-full rounded-sm border border-slate-400 bg-white px-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-1">
                        <button
                            type="button"
                            className="inline-flex h-8 w-28 items-center justify-center rounded-md bg-[linear-gradient(180deg,#5d28ff,#6512f1)] px-4 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(98,34,245,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-8 w-24 items-center justify-center rounded-md border border-violet-400 bg-white px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-violet-50"
                        >
                            Sign up
                        </button>

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