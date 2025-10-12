import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import GlobalSearch from "./GlobalSearch";
import LogoE from "./LogoE";
import logoEBlack from "../assets/logo-e-black.png";
import ChatBot from "./ChatBot"; // import chatbot

export default function Hero() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [chatOpen, setChatOpen] = useState(false); // 🔑 manage chatbot state

  const onSubmit = (e: FormEvent) => e.preventDefault();

  const taglineWords = ["Where", "Data", "Meets", "the", "Edge", "of", "Innovation"];

  return (
    <section className="relative overflow-hidden bg-brand-black text-white font-['Montserrat']">
      {/* Background shapes */}
      <div className="hero-shapes">
        <div className="hero-shape hero-shape--circle-left hero-delay-0" />
        <div className="hero-shape hero-shape--square-right hero-delay-1" />
        <div className="hero-shape hero-shape--triangle-br hero-delay-2" />
        <svg
          className="hero-ring"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <circle
            className="hero-ring__stroke"
            cx="50"
            cy="50"
            r="42"
            pathLength={1}
          />
        </svg>
        <div className="absolute inset-0 hero-vignette" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 min-h-screen grid place-items-center px-4 pt-20 md:pt-24">
        <div className="w-full">
          <div className="glass-card mx-auto w-[88vw] max-w-[90rem] min-h-[60vh] px-12 md:px-16 flex flex-col items-center justify-center text-center gap-8">
            {/* Brand Logo + Title */}
            <div className="flex items-center gap-1 justify-center">
              <LogoE size={200} color="text-white" />
              <div className="flex flex-col leading-none text-left -ml-1">
                <span className="text-7xl md:text-8xl font-extrabold tracking-tight">
                  DATA
                </span>
                <span className="text-7xl md:text-8xl font-extrabold tracking-tight">
                  EDGE
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl flex flex-wrap justify-center gap-2 font-bold mt-2">
              {taglineWords.map((word, wi) => (
                <span
                  key={wi}
                  className={
                    word === "Data" || word === "Edge"
                      ? "text-yellow-400"
                      : "text-white"
                  }
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 mt-28 w-full max-w-xl relative">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex-1 rounded-xl px-6 py-3 font-semibold text-white bg-brand-red hover:bg-red-700 transition"
                >
                  Search Site
                </button>
              ) : (
                <form onSubmit={onSubmit} className="flex items-center gap-2 flex-1">
                  <div className="relative w-full">
                    <GlobalSearch
                      placeholder='Search datasets, e.g. "macro indicators"'
                      value={searchValue}
                      onChange={(e: any) => setSearchValue(e.target.value)}
                      variant="hero"
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onClick={() => setSearchValue("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchValue("");
                    }}
                    className="rounded-xl px-4 py-3 font-semibold text-white bg-gray-600 hover:bg-gray-500 transition"
                  >
                    Close
                  </button>
                </form>
              )}

              {/* Chat with Dedge Button */}
              <div className="relative flex-1 flex justify-center">
                <button
                  onClick={() => {
                    setChatOpen(true);
                    setShowPopup(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold bg-yellow-400 text-black shadow-md hover:bg-yellow-300 transition"
                >
                  <img src={logoEBlack} alt="Dedge Icon" className="w-5 h-5" />
                  Chat with Dedge
                </button>

                {/* Welcome Popup */}
                {showPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-24 bg-white text-black rounded-xl shadow-lg px-4 py-3 text-sm font-medium max-w-xs 
                               left-1/2 -translate-x-1/2 md:right-0 md:left-auto md:translate-x-0"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span>👋 Hi, I’m Dedge. I can help you explore datasets, APIs, and reports.</span>
                      <button
                        onClick={() => setShowPopup(false)}
                        className="ml-2 text-gray-500 hover:text-black font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Controlled ChatBot */}
            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      </div>
    </section>
  );
}
