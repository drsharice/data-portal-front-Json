import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import ChatBot from "../components/ChatBot";
import logoEBlack from "../assets/logo-e-black.png";

interface Report {
  key: string;
  label: string;
  description: string;
  powerbi: string;
}

const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function Analytics() {
  useTitle("Data Edge | Reports");

  const [reports, setReports] = useState<Report[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Report | null>(null);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🧠 Quick Pin (localStorage persistence)
  const [pinned, setPinned] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedReports");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("pinnedReports", JSON.stringify(pinned));
  }, [pinned]);

  // 🎨 Background color (from Settings)
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

  // 🌈 Map background choices to gradients/patterns
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

  // 📊 Load reports
  useEffect(() => {
    const reportsPath = `${mockBase}/reports.json`;
    fetch(reportsPath)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res.reports)) setReports(res.reports);
        else if (Array.isArray(res)) setReports(res);
        else setReports([]);
      })
      .catch(() => setReports([]));
  }, []);

  // 📈 Load data when report selected
  useEffect(() => {
    if (!selected) {
      setRows([]);
      return;
    }
    setLoading(true);
    setErr(null);
    const datasetUrl = `${mockBase}/data/${selected.key}.json`;
    fetch(datasetUrl)
      .then((r) => {
        if (!r.ok) throw new Error("Data not found");
        return r.json();
      })
      .then((data: Record<string, any>[]) => setRows(data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [selected]);

  // 🔎 Filters
  const filteredReports = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? reports.filter((r) => r.label.toLowerCase().includes(term)) : reports;
  }, [q, reports]);

  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || !selected) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [rows, q, selected]);

  // 💾 CSV Download
  function downloadCsv() {
    if (!rows.length || !selected) return;
    const cols = Object.keys(rows[0]);
    const esc = (v: any) => {
      if (v == null) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      const needsQuotes = /[",\n]/.test(s);
      const withDoubles = s.replace(/"/g, '""');
      return needsQuotes ? `"${withDoubles}"` : withDoubles;
    };
    const header = cols.join(",");
    const body = rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
    const csv = [header, body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.label.replace(/\W+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8 relative">
    

      {/* Container */}
      <div
        className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8 relative transition-colors duration-500"
        style={containerStyle}
      >
          {/* Floating Chat */}
      <button
  onClick={() => setChatOpen(true)}
  className="absolute top-9 right-8 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold px-3 py-2 rounded-lg shadow-md hover:brightness-105 hover:-translate-y-[1px] transition-all duration-200"
  title="Chat with Dedge"
>
  <img src={logoEBlack} alt="Dedge Logo" className="w-5 h-5" />
  <span>Chat with Dedge</span>
</button>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 bg-white rounded-t-2xl px-8 pt-3 pb-4 shadow-sm relative z-30">
  {/* Left paragraph */}
  <p className="text-sm text-gray-700 mt-2">
    Looking for more reports?{" "}
    <Link to="/catalog" className="text-red-600 hover:underline">
      Explore our catalog
    </Link>{" "}
    and submit a request.
  </p>

  {/* Center title */}
  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
    <h2 className="text-xl font-semibold text-center text-gray-900">
      View Your Available Reports
    </h2>
  </div>
</div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mt-4 relative">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={`text-sm font-semibold tracking-wide uppercase bg-white/100 backdrop-blur-md border border-white/30 text-gray-900 px-3 py-1 rounded-md shadow-sm inline-block ${
              selected
                ? "text-red-600 hover:underline cursor-pointer"
                : "text-gray-500 cursor-default"
            }`}
          >
            Reports
          </button>

          {/* Search */}
          <div className="flex-1 flex justify-center">
            <form
              className="flex items-center gap-2 w-full max-w-lg justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  selected ? "Search within report..." : 'Search reports, e.g. "Finance"'
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-800 hover:bg-gray-300"
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

          {/* Quick Pin Menu */}
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
                  {reports.map((r) => (
                    <li key={r.key} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pinned.includes(r.key)}
                          onChange={() =>
                            setPinned((prev) =>
                              prev.includes(r.key)
                                ? prev.filter((x) => x !== r.key)
                                : [...prev, r.key]
                            )
                          }
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span>{r.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 px-3 py-2">
                  <button
                    onClick={() => {
                      setPinned([]);
                      setMenuOpen(false);
                    }}
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
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2"></h3>
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredReports.map((r, i) => {
                    const active = selected?.key === r.key;
                    return (
                      <li key={r.key || i}>
                        <button
                          onClick={() => setSelected(r)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 ease-in-out transform focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                            active
                              ? "bg-gradient-to-r from-red-600 to-yellow-400 text-white shadow-md"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-red-50 hover:text-black hover:shadow-lg hover:-translate-y-[2px]"
                          }`}
                        >
                          {r.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}

          <main className={`col-span-12 ${!selected ? "md:col-span-9" : "md:col-span-12"}`}>
            {/* Pinned cards */}
            {!selected && pinned.length > 0 && (
              <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pinned.map((key, i) => {
                  const r = reports.find((x) => x.key === key);
                  if (!r) return null;
                  const stripe = i % 2 === 0 ? "bg-red-600" : "bg-yellow-400";
                  return (
                    <button
                      key={r.key}
                      onClick={() => setSelected(r)}
                      className="relative overflow-hidden text-left rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fadeIn"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1.5 ${stripe}`} />
                      <div className="pl-4 pr-4 py-4">
                        <div className="font-semibold text-gray-800">{r.label}</div>
                        <div className="text-xs text-gray-500 mt-1">Click to open report</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Report view */}
            {selected && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 bg-white/80 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-md shadow-sm inline-block">
                    Reporting &amp; Analytics – {selected.label}
                  </h1>
                  <button
                    onClick={() =>
                      window.open(selected.powerbi ?? "https://app.powerbi.com/", "_blank")
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                  >
                    View Full Report in Power BI
                  </button>
                </div>

                <p className="text-gray-700 bg-white/70 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-md shadow-sm">{selected.description}</p>

                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {err && (
                  <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {err}
                  </div>
                )}

                {!loading && rows.length > 0 && (
                  <>
                    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            {Object.keys(rows[0]).map((col) => (
                              <th key={col} className="px-4 py-2 text-left capitalize">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((row, i) => (
                            <tr key={i} className="border-t border-gray-200">
                              {Object.entries(row).map(([k, v]) => (
                                <td key={k} className="px-4 py-2">
                                  {String(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={downloadCsv}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:brightness-110"
                      >
                        Download CSV
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out both;
        }
      `}</style>
    </section>
  );
}
