import type { FormEvent } from "react";
import GlobalSearch from "./GlobalSearch"; // adjust path if needed

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
              <GlobalSearch
                placeholder='Search datasets, e.g. "macro indicators"'
                variant="hero"
              />
              <button type="submit" className="rounded-xl px-4 py-3 font-semibold text-white bg-brand-red">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
