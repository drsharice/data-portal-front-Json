import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";

interface User {
  id: number;
  name: string;
  department: string;
  device: string;
  location: string;
}

interface Report {
  key: string;
  label: string;
}

// Use same base as Data.tsx for consistency
const mockBase = `${import.meta.env.BASE_URL}mock`;

export default function Analytics() {
  useTitle("Analytics | Data Portal");

  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [deviceSummary, setDeviceSummary] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Left pane report list
  useEffect(() => {
    const list: Report[] = [{ key: "HR_Devices", label: "HR Devices" }];
    setReports(list);
  }, []);

  // Load report data
  useEffect(() => {
    if (!selected) {
      setUsers([]);
      return;
    }
    setLoading(true);
    setErr(null);

    // File should match key: e.g. HR_Devices.json
    fetch(`${mockBase}/data/${selected.key}.json`)
      .then((r) => r.json())
      .then((data: User[]) => {
        setUsers(data);

        const summary: { [key: string]: number } = {};
        data.forEach((u) => {
          summary[u.device] = (summary[u.device] || 0) + 1;
        });
        setDeviceSummary(summary);
      })
      .catch((e) => setErr(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [selected]);

  const filteredUsers = useMemo(() => {
    const term = filter.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.device.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term) ||
        u.location.toLowerCase().includes(term)
    );
  }, [users, filter]);

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setFilter("");
            }}
            className="text-sm font-semibold tracking-wide text-gray-700 uppercase hover:underline hover:text-red-600"
          >
            Analytics
          </button>

          {selected && (
            <form
              className="ml-auto flex items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search employees..."
                className="w-[320px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
              />
            </form>
          )}
        </div>

        {/* Layout with left pane */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <ul className="space-y-2">
                {reports.map((r) => (
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
                    onClick={() => window.open("https://app.powerbi.com/", "_blank")}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                  >
                    View Full Report in Power BI
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-600">
                  Below is a sample of the {selected.label} report. Use the search bar
                  to filter employees, or click the button above to see the full report
                  in Power BI.
                </p>

                {/* Loading / Error */}
                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {err && (
                  <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {err}
                  </div>
                )}

                {/* Summary */}
                {!loading && users.length > 0 && (
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
                {!loading && (
                  <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">Employee Details</h3>
                    <table className="w-full border border-gray-200 rounded-lg text-sm">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Department</th>
                          <th className="px-4 py-2 text-left">Device</th>
                          <th className="px-4 py-2 text-left">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-t border-gray-200">
                            <td className="px-4 py-2">{u.name}</td>
                            <td className="px-4 py-2">{u.department}</td>
                            <td className="px-4 py-2">{u.device}</td>
                            <td className="px-4 py-2">{u.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
