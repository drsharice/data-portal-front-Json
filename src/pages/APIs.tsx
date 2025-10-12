import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";          // ✅ Added
import logoEBlack from "../assets/logo-e-black.png";  // ✅ Added

interface APIView {
  key: string;
  label: string;
  url: string;
}

const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function APIs() {
  useTitle("Data Edge | APIs  ");

  const [views, setViews] = useState<APIView[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<APIView | null>(null);
  const [chatOpen, setChatOpen] = useState(false);   // ✅ Chatbot modal state

  useEffect(() => {
    const list: APIView[] = [
      { key: "Bloomberg", label: "Bloomberg", url: `${mockBase}/openapi-bloomberg.json` },
      { key: "HR", label: "HR", url: `${mockBase}/openapi-hr.json` },
      { key: "M365", label: "M365", url: `${mockBase}/openapi-m365.json` },
    ];
    setViews(list);
  }, []);

  const filteredViews = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? views.filter((v) => v.label.toLowerCase().includes(term)) : views;
  }, [q, views]);

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8 relative">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl 
                      bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8 relative">

        {/* ✅ Chat with Dedge trigger button */}
        <button
          onClick={() => setChatOpen(true)}
          className="absolute top-6 right-8 flex items-center gap-2 
                     bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg 
                     shadow hover:bg-yellow-300 transition"
          title="Chat with Dedge"
        >
          <img src={logoEBlack} alt="Dedge Logo" className="w-5 h-5" />
          <span>Chat with Dedge</span>
        </button>

        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          <p className="text-sm text-gray-600 mt-2">
            Looking for more APIs?{" "}
            <Link to="/catalog" className="text-red-600 hover:underline">
              Explore our catalog
            </Link>{" "}
            and submit a request.
          </p>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-2xl font-semibold text-gray-900">
              View Your Available APIs
            </h2>
          </div>
        </div>

        {/* APIs Toolbar */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mt-4">
          <button
            type="button"
            onClick={() => setSelected(null)}
            disabled={!selected}
            className={`text-sm font-semibold tracking-wide uppercase ${
              selected
                ? "text-gray-700 hover:text-red-600 hover:underline"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={selected ? "Back to API list" : "Already on API list"}
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
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm 
                           text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-800 hover:bg-gray-300"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              {!selected && (
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                >
                  Search
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Main Layout */}
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
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                            active
                              ? "border-red-600 bg-red-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
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
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h2 className="m-0 text-xl font-semibold">
                    Data Portal API – {selected.label}
                  </h2>
                </div>
                <div className="border rounded-xl overflow-hidden">
                  <SwaggerUI url={selected.url} docExpansion="list" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-start text-center space-y-3 mt-16">
                <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800">
                  <span role="img" aria-label="pin" className="text-xl">📌</span>
                  <span>Quick Pin</span>
                  <span className="text-gray-400 text-xl">⋯</span>
                </div>
                <div className="flex flex-col items-center space-y-1 mt-1">
                  <div className="w-16 h-1 bg-red-600 rounded-full"></div>
                  <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ✅ ChatBot Modal */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </section>
  );
}
