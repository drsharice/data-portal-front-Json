import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface APIView {
  key: string;
  label: string;
  url: string;
}

// Use BASE_URL so this still works on GitHub Pages subpaths
const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function APIs() {
  useTitle("APIs | Data Portal");

  const [views, setViews] = useState<APIView[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<APIView | null>(null);

  useEffect(() => {
    const list: APIView[] = [
      { key: "Bloomberg", label: "Bloomberg", url: `${mockBase}/openapi-bloomberg.json` },
      { key: "HR",        label: "HR",        url: `${mockBase}/openapi-hr.json` },
      { key: "M365",      label: "M365",      url: `${mockBase}/openapi-m365.json` }
    ];
    setViews(list);
  }, []);

  const filteredViews = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? views.filter((v) => v.label.toLowerCase().includes(term)) : views;
  }, [q, views]);

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => { setSelected(null); setQ(""); }}
            className="text-sm font-semibold tracking-wide text-gray-700 uppercase hover:underline hover:text-red-600"
          >
            APIs
          </button>

          <form className="ml-auto flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={selected ? "Search within APIs..." : 'Search APIs, e.g. "HR"'}
              className="w-[520px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
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

        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredViews.map((v, i) => {
                    const active = selected?.key === v.key;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => setSelected(v)}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                            active ? "border-red-600 bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
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
              <p className="text-gray-500">Select an API to explore its endpoints.</p>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
