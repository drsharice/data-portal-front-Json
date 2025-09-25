import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface Column {
  name: string;
  type: string;
  description: string;
}

interface CatalogItem {
  id: string;
  name: string;
  schema?: string;
  category: string;
  description: string;
  lastUpdated: string;
  size?: string;
  columns?: Column[];
  popular?: boolean;
  type: "data" | "api" | "report";
}

type CatalogType = "data" | "api" | "report";

export default function Catalog() {
  useTitle("Catalog | Data Portal");

  const [datasets, setDatasets] = useState<CatalogItem[]>([]);
  const [apis, setApis] = useState<CatalogItem[]>([]);
  const [reports, setReports] = useState<CatalogItem[]>([]);

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CatalogType>("data");

  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  // Load mock files
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}mock/mockDatasets.json`)
      .then((res) => res.json())
      .then((data) =>
        setDatasets(data.map((d: any) => ({ ...d, type: "data" })))
      );

    fetch(`${import.meta.env.BASE_URL}mock/mockApis.json`)
      .then((res) => res.json())
      .then((data) => setApis(data.map((d: any) => ({ ...d, type: "api" }))));

    fetch(`${import.meta.env.BASE_URL}mock/mockReports.json`)
      .then((res) => res.json())
      .then((data) =>
        setReports(data.map((d: any) => ({ ...d, type: "report" })))
      );
  }, []);

  // Get items for current tab
  const items = activeTab === "data" ? datasets : activeTab === "api" ? apis : reports;

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(items.map((d) => d.category)));
    return uniqueCats.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;

    if (selected) {
      if (selected.columns) {
        return [
          {
            ...selected,
            columns: selected.columns.filter(
              (c) =>
                c.name.toLowerCase().includes(term) ||
                c.type.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term)
            ),
          },
        ];
      }
      return [selected];
    }

    return items.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term)
    );
  }, [q, items, selected]);

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-black shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">
        {/* Header with tabs */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQ("");
            }}
            className="text-sm font-semibold tracking-wide uppercase hover:underline hover:text-red-600"
          >
            Catalog
          </button>

          {/* Tabs */}
          <div className="flex gap-2 ml-6">
            {(["data", "api", "report"] as CatalogType[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelected(null);
                  setQ("");
                  setActiveTab(t);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === t
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {t === "data" ? "Data" : t === "api" ? "APIs" : "Reports"}
              </button>
            ))}
          </div>

          <form
            className="ml-auto flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                selected
                  ? "Search within item..."
                  : `Search ${activeTab} by name or category...`
              }
              className="w-[400px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-red-600"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-black hover:bg-gray-300"
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

          {/* Cart Badge */}
          <div className="ml-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative inline-flex items-center bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 text-black font-semibold"
              title="Checkout"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!selected && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto space-y-2">
                <ul className="space-y-2">
                  {categories.map((cat) => {
                    const catItems = items.filter((d) => d.category === cat);
                    const isOpen = openCategory === cat;
                    return (
                      <li key={cat} className="border rounded-lg">
                        <button
                          onClick={() =>
                            setOpenCategory(isOpen ? null : cat)
                          }
                          className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                          {cat}
                          <span>{isOpen ? "▾" : "▸"}</span>
                        </button>
                        {isOpen && (
                          <ul className="pl-4 pb-2 space-y-1">
                            {catItems.map((d) => (
                              <li key={d.id}>
                                <button
                                  onClick={() => setSelected(d)}
                                  className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100"
                                >
                                  {d.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}

          <main
            className={`col-span-12 ${
              !selected ? "md:col-span-9" : "md:col-span-12"
            }`}
          >
            {selected ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {selected.name}
                  </h2>
                  <p className="mb-1">{selected.description}</p>
                  <ul className="text-sm space-y-1">
                    {selected.schema && (
                      <li>
                        <strong>Schema:</strong> {selected.schema}
                      </li>
                    )}
                    <li>
                      <strong>Category:</strong> {selected.category}
                    </li>
                    <li>
                      <strong>Last Updated:</strong> {selected.lastUpdated}
                    </li>
                    {selected.size && (
                      <li>
                        <strong>Size:</strong> {selected.size}
                      </li>
                    )}
                  </ul>
                  <button
                    onClick={() =>
                      addToCart({
                        id: selected.id,
                        name: selected.name,
                        description: selected.description,
                    
                      })
                    }
                    className="mt-3 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
                    title="Add to Cart"
                  >
                    Add to Cart
                  </button>
                </div>

                {selected.type === "data" && selected.columns && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Data Dictionary
                    </h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2 text-left">Name</th>
                          <th className="border p-2 text-left">Type</th>
                          <th className="border p-2 text-left">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems[0]?.columns?.map((c, idx) => (
                          <tr key={idx}>
                            <td className="border p-2">{c.name}</td>
                            <td className="border p-2">{c.type}</td>
                            <td className="border p-2">{c.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Our most popular {activeTab === "data"
                    ? "datasets"
                    : activeTab === "api"
                    ? "APIs"
                    : "reports"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items
                    .filter((d) => d.popular)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition p-4 relative cursor-pointer"
                        onClick={() => setSelected(d)}
                      >
                        <h3 className="text-lg font-semibold mb-1">
                          {d.name}
                        </h3>
                        <p className="text-sm mb-2">{d.description}</p>

                        <span className="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                          {d.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              id: d.id,
                              name: d.name,
                              description: d.description,
                              
                            });
                          }}
                          className="absolute top-3 right-3 bg-yellow-400 text-black font-bold rounded-full p-2 hover:bg-yellow-500"
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
