// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

// ---- Existing dataset search/detail endpoints ----
export const api = {
  listDatasets: (
    query: string,
    filters: Record<string, string[]>,
    page = 1,
    pageSize = 12
  ) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    Object.entries(filters).forEach(([k, vals]) =>
      vals.forEach((v) => p.append(k, v))
    );
    return http<{ items: any[]; total: number }>(`/datasets?${p.toString()}`);
  },
  getDataset: (slugOrId: string | number) => http(`/datasets/${slugOrId}`),
  getFacets: () => http(`/facets`),
};

// ---- Data page (views + preview + CSV) ----
export type DataView = { key: string; label: string };
export type DataPreview = {
  view: string;
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
};

export const dataApi = {
  listViews: () => http<{ views: DataView[] }>(`/data/views`),
  preview: (viewKey: string, top = 100) =>
    http<DataPreview>(
      `/data/preview?view=${encodeURIComponent(viewKey)}&top=${top}`
    ),
  downloadCsvUrl: (viewKey: string, top = 1000) =>
    `${BASE}/data/downloadCsv?view=${encodeURIComponent(viewKey)}&top=${top}`,
};
