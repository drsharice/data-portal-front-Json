import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";
import logoEBlack from "../assets/logo-e-black.png";

interface APIView {
  key: string;
  label: string;
  url: string;
}

const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function APIs() {
  useTitle("Data Edge | APIs");

  const [views, setViews] = useState<APIView[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<APIView | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Quick Pin (localStorage)
  const [pinned, setPinned] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedAPIs");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("pinnedAPIs", JSON.stringify(pinned));
  }, [pinned]);

  // Container background driven by Settings (same as Data.tsx)
  const [containerColor, setContainerColor] = useState(
    localStorage.getItem("dataBackgroundColor") || "white"
  );
  useEffect(() => {
    const handleStorageChange = () => {
      const newColor = localStorage.getItem("dataBackgroundColor") || "white";
      setContainerColor(newColor);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Views (left pane)
  useEffect(() => {
    const list: APIView[] = [
      { key: "Bloomberg", label: "Bloomberg", url: `${mockBase}/openapi-bloomberg.json` },
      { key: "HR", label: "HR", url: `${mockBase}/openapi-hr.json` },
      { key: "M365", label: "M365", url: `${mockBase}/openapi-m365.json` },
      { key: "Rightfax", label: "Rightfax Users", url: `${mockBase}/openapi-rightfax.json` },
      { key: "Finance", label: "Finance Budget", url: `${mockBase}/openapi-finance.json` },
      { key: "ActiveComputers", label: "Active Directory Computers", url: `${mockBase}/openapi-activecomputers.json` },
      { key: "ActiveGroups", label: "Active Directory Groups", url: `${mockBase}/openapi-activegroups.json` },
      { key: "Computer", label: "Computer Hardware", url: `${mockBase}/openapi-computer.json` },
      { key: "IT", label: "IT Software", url: `${mockBase}/openapi-it.json` },
      { key: "OCC", label: "OCC Unified Patching Report", url: `${mockBase}/openapi-occ.json` },
      { key: "User", label: "User Entitlements", url: `${mockBase}/openapi-user.json` },
    ];
    setViews(list);
  }, []);

  // Search filter
  const filteredViews = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? views.filter((v) => v.label.toLowerCase().includes(term)) : views;
  }, [q, views]);

  // OPTIONAL: force “Data Edge API” in Swagger title even if file says Data Portal
  const [swaggerSpec, setSwaggerSpec] = useState<any | null>(null);
  useEffect(() => {
    if (!selected) { setSwaggerSpec(null); return; }
    fetch(selected.url)
      .then((r) => r.json())
      .then((spec) => {
        if (spec?.info?.title) {
          spec.info.title = String(spec.info.title).replace(/^Data Portal API/, "Data Edge API");
        } else {
          spec.info = spec.info || {};
          spec.info.title = `Data Edge API – ${selected.label}`;
        }
        setSwaggerSpec(spec);
      })
      .catch(() => setSwaggerSpec(null));
  }, [selected]);

  // Compute container background style (same mapping as Data.tsx)
  const containerStyle =
    containerColor === "diagonal"
      ? { background: "linear-gradient(135deg, #ef4444 0%, #facc15 100%)" }
      : containerColor === "focus"
      ? { background: "radial-gradient(circle at center, #000000 0%, #ef4444 100%)" }
      : containerColor === "fusion"
      ? { background: "linear-gradient(90deg, #facc15, #ef4444, #000000)" }
      : containerColor === "stripe"
      ? {
          backgroundImage:
            "repeating-linear-gradient(45deg, #ef4444, #ef4444 20px, #facc15 20px, #facc15 40px, #000000 40px, #000000 60px)",
        }
      : { backgroundColor: containerColor };

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8 relative">
      <div
        className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl
                   text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8 relative
                   transition-colors duration-500"
        style={containerStyle}
      >
        {/* ✅ Chat trigger */}
        <button
          onClick={() => setChatOpen(true)}
          className="absolute top-9 right-16 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold px-3 py-2 rounded-lg shadow-md hover:brightness-105 hover:-translate-y-[1px] transition-all duration-200"
          title="Chat with Dedge"
        >
          <img src={logoEBlack} alt="Dedge Logo" className="w-5 h-5" />
          <span>Chat with Dedge</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 bg-white rounded-t-2xl px-8 pt-3 pb-4 shadow-sm relative z-30">
          <p className="text-sm text-gray-700 mt-2">
            Looking for more APIs?{" "}
            <Link to="/catalog" className="text-red-600 hover:underline">
              Explore our catalog
            </Link>{" "}
            and submit a request.
          </p>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <h2 className="text-xl font-semibold text-center text-gray-900">
              View Your Available APIs
            </h2>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mt-4 relative">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={`text-sm font-semibold tracking-wide uppercase bg-white/100 backdrop-blur-md border border-white/30 text-gray-900 px-3 py-1 rounded-md shadow-sm inline-block ${selected ? "text-red-600 hover:underline cursor-pointer" : "text-gray-500 cursor-default"}`}
          >
            APIs
          </button>

          <div className="flex-1 flex justify-center">
            <form
              className="flex items-center gap-2 w-full max-w-lg justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={selected ? "Search within APIs..." : 'Search APIs, e.g. "HR"'}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-800 hover:bg-gray-300"
                >✕</button>
              )}
              {!selected && (
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                >Search</button>
              )}
            </form>
          </div>

          {/* Quick Pin */}
          <div className="relative mr-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-sm font-semibold text-gray-800 bg-white/100 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-lg hover:shadow-md hover:-translate-y-[1px] transition-all duration-200"
            >
              <span role="img" aria-label="pin" className="text-base">📌</span>
              <span>Quick Pin</span>
              <span className="text-gray-400 text-lg">⋯</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="max-h-64 overflow-auto text-sm text-gray-800">
                  {views.map((api) => (
                    <li key={api.key} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pinned.includes(api.key)}
                          onChange={() =>
                            setPinned((prev) =>
                              prev.includes(api.key)
                                ? prev.filter((x) => x !== api.key)
                                : [...prev, api.key]
                            )
                          }
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span>{api.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 px-3 py-2">
                  <button
                    onClick={() => { setPinned([]); setMenuOpen(false); }}
                    className="w-full text-left text-xs font-semibold text-red-600 hover:underline"
                  >
                    Clear All Pins
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">APIs</h3>
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredViews.map((v, i) => {
                    const active = selected?.key === v.key;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => setSelected(v)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 ease-in-out transform focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${active ? "bg-gradient-to-r from-red-600 to-yellow-400 text-white shadow-md" : "bg-white text-gray-800 border-gray-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-red-50 hover:text-black hover:shadow-lg hover:-translate-y-[2px]"}`}
                        >
                          {v.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}

          <main className={`col-span-12 ${!selected ? "md:col-span-9" : "md:col-span-12"}`}>
            {/* Pinned cards (only show when there are pins) */}
            {!selected && pinned.length > 0 && (
              <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pinned.map((key, i) => {
                  const api = views.find((v) => v.key === key);
                  if (!api) return null;
                  const stripe = i % 2 === 0 ? "bg-red-600" : "bg-yellow-400";
                  return (
                    <button
                      key={api.key}
                      onClick={() => setSelected(api)}
                      className="relative overflow-hidden text-left rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fadeIn"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1.5 ${stripe}`} />
                      <div className="pl-4 pr-4 py-4">
                        <div className="font-semibold text-gray-800">{api.label}</div>
                        <div className="text-xs text-gray-500 mt-1">Click to open API</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selected ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h2 className="m-0 text-xl font-semibold text-gray-900 bg-white/80 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-md shadow-sm inline-block">
                    Data Edge API – {selected.label}
                  </h2>
                </div>
                <div className="border rounded-xl overflow-hidden bg-white">
                  {swaggerSpec ? (
                    <SwaggerUI spec={swaggerSpec} docExpansion="list" />
                  ) : (
                    <SwaggerUI url={selected.url} docExpansion="list" />
                  )}
                </div>
              </div>
            ) : (
              // Removed center “Quick Pin” placeholder per request
              <div />
            )}
          </main>
        </div>
      </div>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <style>{`
        @keyframes fadeIn {
          from {opacity:0;transform:translateY(6px);}
          to {opacity:1;transform:translateY(0);}
        }
        .animate-fadeIn{animation:fadeIn 0.25s ease-in-out both;}
      `}</style>
    </section>
  );
}
