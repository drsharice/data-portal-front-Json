import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";         // ✅ new import
import logoEBlack from "../assets/logo-e-black.png"; // ✅ Dedge logo

interface Dataset {
  key: string;
  label: string;
}
interface Column { name: string; }
interface Preview {
  view: string;
  columns: Column[];
  rows: Record<string, any>[];
}
const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function Data() {
  useTitle("Data Edge | Data");

  const [views, setViews] = useState<Dataset[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string[]>(() => {
  const saved = localStorage.getItem("pinnedDatasets");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem("pinnedDatasets", JSON.stringify(pinned));
}, [pinned]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);   // ✅ chat state

  // ✅ Dynamic container color
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

  useEffect(() => {
    fetch(`${mockBase}/sources.json`)
      .then((r) => r.json())
      .then((res) => {
        const list = (res.sources ?? []).map((s: string) => ({
          key: s,
          label: s.replace(/_/g, " "),
        }));
        setViews(list);
      })
      .catch(() => setViews([]));
  }, []);

  useEffect(() => {
    if (!selected) { setPreview(null); return; }
    setErr(null); setLoading(true);
    const url = `${mockBase}/data/${selected.key}.json`;
    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const first = res[0];
          const columns = Object.keys(first).map((k) => ({ name: k }));
          setPreview({ view: selected.key, columns, rows: res });
        } else setPreview({ view: selected.key, columns: [], rows: [] });
        setQ("");
      })
      .catch((e) => setErr(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [selected]);

  const filteredDatasets = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? views.filter((v) => v.label.toLowerCase().includes(term)) : views;
  }, [q, views]);

  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || !preview) return preview?.rows ?? [];
    return preview.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [q, preview]);

  function downloadCsv() {
    if (!preview) return;
    const cols = preview.columns.map((c) => c.name);
    const rows = preview.rows;
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
    a.download = `${preview.view.replace(/\W+/g, "_")}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8 relative">
    
      {/* ✅ Inner container color dynamic */}
      <div
        className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl
                    text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8 relative
                    transition-colors duration-500"
          style={
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
          : { backgroundColor: containerColor }
      }
      >
        {/* ✅ Chat trigger button */}
        <button
          onClick={() => setChatOpen(true)}
          className="absolute top-9 right-16 z-50 flex items-center gap-2
             bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold
             px-3 py-2 rounded-lg shadow-md hover:brightness-105 hover:-translate-y-[1px]
             transition-all duration-200"
          title="Chat with Dedge"
        >
          <img src={logoEBlack} alt="Dedge Logo" className="w-5 h-5" />
          <span>Chat with Dedge</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200
                bg-white rounded-t-2xl px-8 pt-3 pb-4 shadow-sm relative z-30">
          <p className="text-sm text-gray-700 mt-2">
            Looking for more datasets?{" "}
            <Link to="/catalog" className="text-red-600 hover:underline">
              Explore our catalog
            </Link>{" "}
            and submit a request.
          </p>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <h2 className="text-xl font-semibold text-center text-gray-900">
              View Your Available Datasets
            </h2>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mt-4 relative">
          <button
            type="button"
            onClick={() => { setSelected(null); setQ(""); }}
            className={`text-sm font-semibold tracking-wide uppercase
             bg-white/100 backdrop-blur-md border border-white/30
             text-gray-900 px-3 py-1 rounded-md shadow-sm inline-block ${
              selected ? "text-red-600 hover:underline cursor-pointer"
                       : "text-gray-500 cursor-default"}`}
          >
            Datasets
          </button>

          <div className="flex-1 flex justify-center">
            <form
              className="flex items-center gap-2 w-full max-w-lg justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={selected ? "Search within table..."
                                      : 'Search datasets, e.g. "macro indicators"'}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2
                           text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-lg bg-gray-200 px-2 py-2 text-sm
                             text-gray-800 hover:bg-gray-300"
                >✕</button>
              )}
              {!selected && (
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm
                             font-semibold text-white hover:brightness-110"
                >Search</button>
              )}
            </form>
          </div>

          {/* Quick Pin menu */}
          <div className="relative mr-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-sm font-semibold text-gray-800
             bg-white/100 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-lg
             hover:shadow-md hover:-translate-y-[1px] transition-all duration-200"
            >
              <span role="img" aria-label="pin" className="text-base">📌</span>
              <span>Quick Pin</span>
              <span className="text-gray-400 text-lg">⋯</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border
                              border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="max-h-64 overflow-auto text-sm text-gray-800">
                  {views.map((ds) => (
                    <li key={ds.key}
                        className="flex items-center justify-between
                                   px-3 py-2 hover:bg-gray-50">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pinned.includes(ds.key)}
                          onChange={() =>
                            setPinned((prev) =>
                              prev.includes(ds.key)
                                ? prev.filter((x) => x !== ds.key)
                                : [...prev, ds.key]
                            )
                          }
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span>{ds.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4
                               md:border-r md:border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                
              </h3>
              <div className="md:sticky md:top-28
                              md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredDatasets.map((v, i) => {
                    const active = selected?.key === v.key;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => setSelected(v)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium
  border transition-all duration-300 ease-in-out transform focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2  ${
                            active
                              ? "bg-gradient-to-r from-red-600 to-yellow-400 text-white shadow-md"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-red-50 hover:text-black hover:shadow-lg hover:-translate-y-[2px]"
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

          <main className={`col-span-12 ${
            !selected ? "md:col-span-9" : "md:col-span-12"}`}>

            {/* ✅ Pinned cards */}
            {!selected && pinned.length > 0 && (
              <div className="mb-6 grid grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 gap-4">
                {pinned.map((key, i) => {
                  const dataset = views.find((v) => v.key === key);
                  if (!dataset) return null;
                  const stripe = i % 2 === 0 ? "bg-red-600" : "bg-yellow-400";
                  return (
                    <button
                      key={dataset.key}
                      onClick={() => setSelected(dataset)}
                      className="relative overflow-hidden text-left rounded-xl
                                 bg-white border border-gray-200 shadow-sm
                                 transition-all duration-300 hover:shadow-lg
                                 hover:-translate-y-1 animate-fadeIn"
                    >
                      <div className={`absolute left-0 top-0 h-full w-1.5 ${stripe}`} />
                      <div className="pl-4 pr-4 py-4">
                        <div className="font-semibold text-gray-800">
                          {dataset.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Click to open dataset
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Preview */}
            {selected && (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h2 className="m-0 text-xl font-semibold text-gray-900
             bg-white/80 backdrop-blur-md border border-white/30
             px-4 py-1.5 rounded-md shadow-sm inline-block">
                    {selected.label}
                  </h2>
                  <span className="text-xs text-gray-500">
                    Preview (top 100)
                  </span>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-200
                                  bg-red-50 p-3 text-sm text-red-700">{err}</div>
                )}
                {loading && (
                  <div className="rounded-lg border border-gray-200
                                  bg-white p-3 text-sm">Loading…</div>
                )}

                {preview && !loading && (
                  <>
                    <div className="rounded-xl border border-gray-200
                                    bg-gray-50 p-4">
                      <dl className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                          <dt className="text-gray-500">Columns</dt>
                          <dd className="font-semibold">
                            {preview.columns.length}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Rows (shown)</dt>
                          <dd className="font-semibold">
                            {filteredRows.length}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Object</dt>
                          <dd className="font-semibold">{preview.view}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="max-h-[52vh] overflow-auto
                                    rounded-xl border border-gray-200">
                      <table className="w-full border-separate text-sm"
                             style={{ borderSpacing: 0 }}>
                        <thead className="sticky top-0 z-10 bg-gray-100">
                          <tr>
                            {preview.columns.map((c) => (
                              <th key={c.name}
                                  className="border-b border-gray-200 px-3 py-2
                                             text-left font-medium text-gray-700">
                                {c.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((r, i) => (
                            <tr key={i}
                                className="odd:bg-white even:bg-gray-50">
                              {preview.columns.map((c) => (
                                <td key={c.name}
                                    className="border-b border-gray-100 px-3 py-2">
                                  {formatCell(r[c.name])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={downloadCsv}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm
                                   font-medium text-white hover:brightness-110"
                      >Download CSV</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ✅ ChatBot modal */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <style>
        {`
        @keyframes fadeIn {
          from {opacity:0;transform:translateY(6px);}
          to {opacity:1;transform:translateY(0);}
        }
        .animate-fadeIn{animation:fadeIn 0.25s ease-in-out both;}
        `}
      </style>
    </section>
  );
}

function formatCell(v: any) {
  if (v == null) return "";
  if (v instanceof Date) return v.toLocaleString();
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
