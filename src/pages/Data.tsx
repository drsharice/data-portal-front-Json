import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { Link } from "react-router-dom";

interface Dataset {
  key: string;
  label: string;
}

interface Column {
  name: string;
}

interface Preview {
  view: string;
  columns: Column[];
  rows: Record<string, any>[];
}

const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function Data() {
  useTitle("Data | Data Portal");

  const [views, setViews] = useState<Dataset[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      .catch((e) => {
        console.error(e);
        setViews([]);
      });
  }, []);

  useEffect(() => {
    if (!selected) {
      setPreview(null);
      return;
    }
    setErr(null);
    setLoading(true);

    const url = `${mockBase}/data/${selected.key}.json`;

    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const first = res[0];
          const columns = Object.keys(first).map((k) => ({ name: k }));
          setPreview({ view: selected.key, columns, rows: res });
        } else {
          setPreview({ view: selected.key, columns: [], rows: [] });
        }
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
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">

        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          {/* Left: Catalog Info */}
          <p className="text-sm text-gray-600 mt-2">
            Looking for more datasets?{" "}
            <Link to="/catalog" className="text-red-600 hover:underline">
              Explore our catalog
            </Link>{" "}
            and submit a request.
          </p>

          {/* Centered Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-2xl font-semibold text-gray-900">
              View Your Available Datasets
            </h2>
          </div>
        </div>

        {/* Datasets Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mt-4">
          {/* Left: Datasets Label */}
         {/* Left: Datasets Label (Hyperlink Behavior) */}
          <button
           type="button"
             onClick={() => {
            setSelected(null);
            setQ("");
  }}
  className={`text-sm font-semibold tracking-wide uppercase transition ${
    selected
      ? "text-red-600 hover:underline cursor-pointer"
      : "text-gray-500 cursor-default"
  }`}
  title={selected ? "Back to dataset list" : "Already on dataset list"}
>
  Datasets
</button>


          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center">
            <form
              className="flex items-center gap-2 w-full max-w-lg justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  selected ? "Search within table..." : 'Search datasets, e.g. "macro indicators"'
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
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

          {/* Right: Quick Pin */}
          <div className="flex flex-col items-center text-center space-y-1 mr-4">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
              <span role="img" aria-label="pin" className="text-base">
                📌
              </span>
              <span>Quick Pin</span>
              <span className="text-gray-400">⋯</span>
            </div>
            <div className="flex flex-col items-center space-y-0.5">
              <div className="w-10 h-0.5 bg-red-600 rounded-full"></div>
              <div className="w-8 h-0.5 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Datasets
              </h3>
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredDatasets.map((v, index) => {
                    const active = selected?.key === v.key;
                    return (
                      <li key={index}>
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

          {/* Main Content */}
          <main className={`col-span-12 ${!selected ? "md:col-span-9" : "md:col-span-12"}`}>
            {selected && (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h2 className="m-0 text-xl font-semibold">{selected.label}</h2>
                  <span className="text-xs text-gray-500">Preview (top 100)</span>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {err}
                  </div>
                )}
                {loading && (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                    Loading…
                  </div>
                )}

                {preview && !loading && (
                  <>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <dl className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                          <dt className="text-gray-500">Columns</dt>
                          <dd className="font-semibold">{preview.columns.length}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Rows (shown)</dt>
                          <dd className="font-semibold">{filteredRows.length}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Object</dt>
                          <dd className="font-semibold">{preview.view}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="max-h-[52vh] overflow-auto rounded-xl border border-gray-200">
                      <table className="w-full border-separate text-sm" style={{ borderSpacing: 0 }}>
                        <thead className="sticky top-0 z-10 bg-gray-100">
                          <tr>
                            {preview.columns.map((c) => (
                              <th
                                key={c.name}
                                className="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-700"
                              >
                                {c.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((r, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              {preview.columns.map((c) => (
                                <td key={c.name} className="border-b border-gray-100 px-3 py-2">
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
    </section>
  );
}

function formatCell(v: any) {
  if (v == null) return "";
  if (v instanceof Date) return v.toLocaleString();
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
