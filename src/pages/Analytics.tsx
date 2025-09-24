import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";

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

  // Load available reports
  useEffect(() => {
    fetch(`${mockBase}/reports.json`)
      .then((r) => r.json())
      .then((res) => setReports(res.reports ?? []))
      .catch((e) => {
        console.error("Error loading reports.json:", e);
        setReports([]);
      });
  }, []);

  // Load selected report data
  useEffect(() => {
    if (!selected) {
      setRows([]);
      setDeviceSummary({});
      return;
    }
    setLoading(true);
    setErr(null);

    fetch(`${mockBase}/data/${selected.key}.json`)
      .then((r) => r.json())
      .then((data: Record<string, any>[]) => {
        setRows(data);

        // Build device summary if applicable
        const summary: { [key: string]: number } = {};
        data.forEach((row) => {
          if (row.device) {
            summary[row.device] = (summary[row.device] || 0) + 1;
          }
        });
        setDeviceSummary(summary);
      })
      .catch((e) => setErr(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [selected]);

  // Filter report list
  const filteredReports = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? reports.filter((r) => r.label.toLowerCase().includes(term)) : reports;
  }, [q, reports]);

  // Filter rows inside a report
  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || !selected) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [rows, q, selected]);

  // CSV download
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
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQ("");
            }}
            className="text-sm font-semibold tracking-wide text-gray-700 uppercase hover:underline hover:text-red-600"
          >
            Reports
          </button>

          <form
            className="ml-auto flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                selected
                  ? "Search within report..."
                  : 'Search reports, e.g. "Finance"'
              }
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

        {/* Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <ul className="space-y-2">
                {filteredReports.map((r) => (
                  <li key={r.key}>
                    <button
                      onClick={() => setSelected(r)}
                      className="w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 text-left text-sm"
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <main className={`col-span-12 ${!selected ? "md:col-span-9" : "md:col-span-12"}`}>
            {!selected ? (
              <p className="text-gray-500">Select a report to view details.</p>
            ) : (
              <div className="space-y-6">
                {/* Header */}
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

                {/* Description */}
                <p className="text-gray-600">{selected.description}</p>

                {/* Loading / Error */}
                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {err && (
                  <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {err}
                  </div>
                )}

                {/* Summary */}
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

                {/* Table */}
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

                    {/* Download button */}
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
