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
  useTitle("Reports | Data Portal");

  const [reports, setReports] = useState<Report[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Report | null>(null);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [deviceSummary, setDeviceSummary] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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

  useEffect(() => {
    if (!selected) {
      setRows([]);
      setDeviceSummary({});
      return;
    }
    setLoading(true);
    setErr(null);
    const datasetUrl = `${mockBase}/data/${selected.key}.json`;
    fetch(datasetUrl)
      .then((r) => r.json())
      .then((data: Record<string, any>[]) => {
        setRows(data);
        const summary: { [key: string]: number } = {};
        data.forEach((row) => {
          if (row.device) summary[row.device] = (summary[row.device] || 0) + 1;
        });
        setDeviceSummary(summary);
      })
      .catch((e) => setErr(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [selected]);

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
      <div
        className="mx-auto w-full max-w-[1400px] min-h-[72vh]
                   rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200
                   p-4 md:p-8 relative"
      >
        {/* Top Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 relative">
          {/* Left: Reports Button */}
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQ("");
            }}
            disabled={!selected}
            className={`text-sm font-semibold tracking-wide uppercase ${
              selected
                ? "text-gray-700 hover:underline hover:text-red-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Reports
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
                  selected ? "Search within report..." : 'Search reports, e.g. "Finance"'
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2
                           text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
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

          {/* Right: Chat with Dedge Button */}
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 bg-yellow-400 text-black font-semibold
                       px-3 py-2 rounded-lg shadow hover:bg-yellow-300 transition ml-4"
            title="Chat with Dedge"
          >
            <img src={logoEBlack} alt="Dedge Logo" className="w-5 h-5" />
            <span>Chat with Dedge</span>
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Reports
              </h3>
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {filteredReports.map((r, i) => (
                    <li key={r.key || i}>
                      <button
                        onClick={() => setSelected(r)}
                        className="w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50
                                   px-3 py-2 text-left text-sm"
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          <main className={`col-span-12 ${!selected ? "md:col-span-9" : "md:col-span-12"}`}>
            {!selected ? (
              <p className="text-gray-500">Select a report to view details.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-extrabold">
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

                <p className="text-gray-600">{selected.description}</p>

                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {err && (
                  <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {err}
                  </div>
                )}

                {!loading && Object.keys(deviceSummary).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Device Summary</h3>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      {Object.entries(deviceSummary).map(([device, count]) => (
                        <li key={device}>
                          {device}: {count} employees
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!loading && rows.length > 0 && (
                  <>
                    <div className="overflow-x-auto">
                      <h3 className="text-lg font-semibold mb-2">Report Details</h3>
                      <table className="w-full border border-gray-200 rounded-lg text-sm">
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

      {/* ChatBot Modal */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </section>
  );
}
