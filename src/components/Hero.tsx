import type { FormEvent } from "react";

export default function Hero() {
  const onSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="hero-shapes">
        <div className="hero-shape hero-shape--circle-left hero-delay-0" />
        <div className="hero-shape hero-shape--square-right hero-delay-1" />
        <div className="hero-shape hero-shape--triangle-br hero-delay-2" />
        <svg className="hero-ring" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <circle className="hero-ring__stroke" cx="50" cy="50" r="42" pathLength={1} />
        </svg>
        <div className="absolute inset-0 hero-vignette" />
      </div>

      <div className="relative z-10 min-h-screen grid place-items-center px-4 pt-20 md:pt-24">
        <div className="w-full">
          <div className="glass-card mx-auto w-[88vw] max-w-[90rem] min-h-[60vh] px-12 md:px-16 flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-extrabold tracking-tight">DATA PORTAL</h1>
            <p className="text-base md:text-lg text-white/85">
             Discover datasets, docs, APIs, and real-time chatbot support—your guide to everything data in our space.
            </p>

            <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <label className="sr-only" htmlFor="hero-search">Search datasets</label>
              <input
                id="hero-search"
                placeholder='Search datasets, e.g. "macro indicators"'
                className="w-[min(90vw,44rem)] rounded-xl border px-4 py-3 outline-none bg-white/95 text-brand-black focus:ring"
                style={{ borderColor: "#B5ADAD" }}
              />
              <button type="submit" className="rounded-xl px-4 py-3 font-semibold text-white bg-brand-red">
                Search
              </button>
              <button
                type="button"
                className="rounded-xl px-4 py-3 font-semibold bg-[var(--yellow-3)] text-brand-black border border-brand-gmid hover:brightness-95 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17l-3 3v-4a7 7 0 117 7h-4l3-3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Chat with a Bot
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
