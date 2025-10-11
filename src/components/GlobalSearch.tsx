import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  type: "data" | "api" | "catalog" | "report";
  name: string;
  path: string;
}

const searchIndex: SearchItem[] = [
  { type: "data", name: "Bloomberg Dataset", path: "/data" },
  { type: "data", name: "Macro Indicators", path: "/data" },
  { type: "api", name: "HR API", path: "/apis" },
  { type: "api", name: "Market Data API", path: "/apis" },
  { type: "catalog", name: "Finance Catalog", path: "/catalog" },
  { type: "catalog", name: "Tech Catalog", path: "/catalog" },
  { type: "report", name: "Monthly Report", path: "/analytics" },
  { type: "report", name: "Quarterly Report", path: "/analytics" },
];

export default function GlobalSearch({
  placeholder,
  variant = "default",
  value,
  onChange,
}: {
  placeholder: string;
  variant?: "default" | "hero" | "navbar";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [internalQuery, setInternalQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const navigate = useNavigate();

  const effectiveValue = value !== undefined ? value : internalQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    } else {
      setInternalQuery(newValue);
    }

    if (newValue.length > 0) {
      setResults(
        searchIndex.filter((item) =>
          item.name.toLowerCase().includes(newValue.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setInternalQuery("");
    }
    setResults([]);
  };

  const handleSelect = (path: string) => {
    navigate(path);
    handleClear();
  };

  const inputClasses =
    variant === "hero"
      ? "w-[min(90vw,44rem)] rounded-xl border px-4 py-3 outline-none bg-white/95 text-brand-black focus:ring pr-10"
      : "rounded px-3 py-1 text-sm text-white bg-gray-800 border border-gray-700 focus:outline-none pr-6";

  return (
    <div className="relative">
      <input
        type="text"
        value={effectiveValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClasses}
      />

      {effectiveValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white text-black shadow-md mt-1 rounded-lg z-20">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item.path)}
            >
              {item.name}{" "}
              <span className="text-gray-500">({item.type})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
