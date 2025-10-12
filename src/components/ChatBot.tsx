import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import logoEBlack from "../assets/logo-e-black.png";
import { interpretIntent } from "../data/IntentEngine";
import { KnowledgeMap } from "../data/KnowledgeMap";

/** --------------------------------
 * Types
 * -------------------------------- */
interface ChatBotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type ChartKind = "pie" | "bar";

interface ChartData {
  type: ChartKind;
  labels: string[];
  values: number[];
  title?: string;
}

interface Message {
  sender: "bot" | "user";
  text: string;
  chart?: ChartData;
}

/** --------------------------------
 * Constants
 * -------------------------------- */
const COLORS = ["#facc15", "#60a5fa", "#34d399", "#f87171", "#a78bfa", "#fbbf24"];
const MIN_HEIGHT = 450;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

/** --------------------------------
 * Helpers
 * -------------------------------- */
function resolveURL(path: string) {
  const base = (import.meta as any).env?.BASE_URL || "/";
  const cleanBase = String(base).endsWith("/") ? String(base).slice(0, -1) : String(base);
  return `${cleanBase}${path}`;
}

/* 🧩 Markdown renderer */
function renderMarkdown(text: string): string {
  if (text.includes("|")) {
    const rows = text.trim().split("\n").map((r) => r.trim());
    if (rows.length > 1 && rows.every((r) => r.startsWith("|"))) {
      const htmlRows = rows
        .map((r, i) => {
          const cells = r.split("|").filter((c) => c.trim() !== "");
          if (i === 0)
            return `<tr class="bg-gray-200 font-semibold">${cells
              .map((c) => `<th class="px-3 py-2 border border-gray-300">${c.trim()}</th>`)
              .join("")}</tr>`;
          return `<tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50"}">${cells
            .map((c) => `<td class="px-3 py-2 border border-gray-300">${c.trim()}</td>`)
            .join("")}</tr>`;
        })
        .join("");
      return `
        <div class="overflow-x-auto mt-3">
          <table class="min-w-full text-sm border border-gray-300 border-collapse rounded-md shadow-sm">
            <tbody>${htmlRows}</tbody>
          </table>
        </div>`;
    }
  }
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul class='list-disc ml-6'>$1</ul>")
    .replace(/\n/g, "<br>");
}

function pickSuggestedGroupField(datasetKey: keyof typeof KnowledgeMap.accessible | null) {
  if (!datasetKey) return null;
  const fields = KnowledgeMap.accessible[datasetKey]?.keyFields || [];
  const nice = fields.find((f) => !/id|key|guid/i.test(f)) || fields[0] || null;
  return nice || null;
}

function firstNumericColumn(row: Record<string, any>, excludeKey?: string) {
  const keys = Object.keys(row);
  for (const k of keys) {
    if (k === excludeKey) continue;
    const v = row[k];
    if (typeof v === "number") return k;
    if (v != null && !Array.isArray(v) && !isNaN(Number(v))) return k;
  }
  return null;
}

/** --------------------------------
 * Chart component
 * -------------------------------- */
const DedgeChart: React.FC<{ chart: ChartData }> = ({ chart }) => {
  const data = chart.labels.map((label, i) => ({ name: label, value: chart.values[i] }));

  if (chart.type === "pie") {
    return (
      <div className="w-full h-64 mt-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart.type === "bar") {
    return (
      <div className="w-full h-64 mt-4">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

/** --------------------------------
 * Main ChatBot
 * -------------------------------- */
const ChatBot: React.FC<ChatBotProps> = ({ isOpen = false, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [textHeight, setTextHeight] = useState(80);
  const [lastDatasetKey, setLastDatasetKey] = useState<keyof typeof KnowledgeMap.accessible | null>(null);
  const [lastFetchPath, setLastFetchPath] = useState<string | null>(null);
  const [suggestedField, setSuggestedField] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Window sizing
  const [winSize, setWinSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const [isMaximized, setIsMaximized] = useState(false);
  const prevSizeRef = useRef<{ width: number; height: number } | null>(null);
  const startYRef = useRef(0);
  const startHRef = useRef(DEFAULT_HEIGHT);
  const isResizingRef = useRef(false);

  /** Init on open */
  useEffect(() => {
    if (isOpen) {
      setMessages([{ sender: "bot", text: "👋 Hi Guest, I’m **Dedge**. How can I help you today?" }]);
      setLastDatasetKey(null);
      setLastFetchPath(null);
      setSuggestedField(null);
    }
  }, [isOpen]);

  /** Scroll logic */
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isOverflowing = el.scrollHeight > el.clientHeight + 10;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setShowScrollButton(isOverflowing && !nearBottom);
  };

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => el.removeEventListener("scroll", handleScroll);
  }, [messages]);

  /** Helpers */
  const pushBot = (text: string, chart?: ChartData) => {
    setMessages((prev) => [...prev, { sender: "bot", text, chart }]);
  };

  /** Actions */
  const handleCount = async (path: string) => {
    try {
      const res = await fetch(resolveURL(path));
      const data = await res.json();
      pushBot(`📊 This dataset contains **${data.length}** records.`);
    } catch {
      pushBot("⚠️ Unable to count records.");
    }
  };

  const handlePreview = async (path: string) => {
    try {
      const res = await fetch(resolveURL(path));
      const data = await res.json();
      if (!data.length) return pushBot("No data found.");
      const cols = Object.keys(data[0]);
      const rows = data.slice(0, 3);
      const header = `| ${cols.join(" | ")} |`;
      const lines = rows.map((r: any) => `| ${cols.map((c) => r[c] ?? "").join(" | ")} |`).join("\n");
      pushBot(`Here’s a preview:\n${header}\n${lines}`);
    } catch {
      pushBot("⚠️ Couldn’t preview data.");
    }
  };

  const showPivotSummary = async (path: string, field: string) => {
    try {
      const res = await fetch(resolveURL(path));
      const data = await res.json();
      const grouped: Record<string, number> = {};
      for (const row of data) {
        const k = String(row[field]);
        grouped[k] = (grouped[k] || 0) + 1;
      }
      const header = `| ${field} | Count |\n`;
      const lines = Object.entries(grouped)
        .map(([k, v]) => `| ${k} | ${v} |`)
        .join("\n");
      pushBot(`Here’s a summary grouped by **${field}**:\n${header}${lines}`);
    } catch {
      pushBot("⚠️ Couldn’t generate summary.");
    }
  };

  const handleVisualization = async (path: string, groupField: string) => {
    try {
      const res = await fetch(resolveURL(path));
      const data = await res.json();
      const numCol = firstNumericColumn(data[0], groupField);
      const agg: Record<string, number> = {};
      for (const row of data) {
        const key = String(row[groupField]);
        const val = numCol ? Number(row[numCol]) : 1;
        agg[key] = (agg[key] || 0) + (isNaN(val) ? 0 : val);
      }
      const labels = Object.keys(agg);
      const values = labels.map((k) => agg[k]);
      pushBot(
        `Here’s a ${numCol ? "sum of **" + numCol + "**" : "count"} grouped by **${groupField}**.`,
        { type: labels.length <= 6 ? "pie" : "bar", labels, values }
      );
    } catch {
      pushBot("⚠️ Couldn’t generate visualization.");
    }
  };

  /** Numeric quick options */
  const handleQuickOption = async (n: number) => {
    if (!lastDatasetKey || !lastFetchPath) return pushBot("I need a dataset first.");
    const field = suggestedField || pickSuggestedGroupField(lastDatasetKey)!;
    switch (n) {
      case 1:
        pushBot(`Fields: ${KnowledgeMap.accessible[lastDatasetKey].keyFields.join(", ")}`);
        break;
      case 2:
        await handleCount(lastFetchPath);
        break;
      case 3:
        await handlePreview(lastFetchPath);
        break;
      case 4:
        await showPivotSummary(lastFetchPath, field);
        break;
      case 5:
        await handleVisualization(lastFetchPath, field);
        break;
    }
  };

  /** Handle Send */
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { sender: "user", text: userMsg }]);
    setInput("");

    // Handle numbered replies
    if (/^[1-5]$/.test(userMsg)) return handleQuickOption(parseInt(userMsg));

    // Handle regroup choice
    if (suggestedField && lastDatasetKey && lastFetchPath) {
      const fields = KnowledgeMap.accessible[lastDatasetKey].keyFields;
      const match = fields.find((f) => f.toLowerCase() === userMsg.toLowerCase());
      if (match) {
        setSuggestedField(match);
        pushBot(`Got it — regrouping by **${match}**...`);
        await showPivotSummary(lastFetchPath, match);
        await handleVisualization(lastFetchPath, match);
        return;
      }
    }

    const result = interpretIntent(userMsg, { lastDatasetKey });
    if (result.datasetKey) setLastDatasetKey(result.datasetKey);
    if (result.fetchPath) setLastFetchPath(result.fetchPath);

    // Controlled: only respond once (no auto-summary)
    if (result.intent === "dataset" && result.datasetKey && result.fetchPath) {
      const ds = result.datasetKey;
      const g = pickSuggestedGroupField(ds)!;
      setSuggestedField(g);
      pushBot(
        `✅ You have access to **${ds.replace(/_/g, " ")}**.\nDescription: ${
          KnowledgeMap.accessible[ds].description
        }\n\nI can help you with:\n1️⃣ List fields\n2️⃣ Count rows\n3️⃣ Preview sample data\n4️⃣ Group data\n5️⃣ Visualize with charts\n\n💡 Default grouping field suggestion: **${g}**\n(You can also choose another field: [${KnowledgeMap.accessible[ds].keyFields.join(
          ", "
        )}])`
      );
      return;
    }

    // Handle explicit group or chart commands
    if (result.fetchPath && (result.intent === "group" || result.intent === "chart")) {
      const match = userMsg.match(/by ([a-zA-Z0-9_ ]+)/i);
      let groupField = match ? match[1].trim().replace(/\s+/g, "_") : null;
      if (!groupField && result.datasetKey) {
        groupField = pickSuggestedGroupField(result.datasetKey);
      }
      if (!groupField) return pushBot("Which field should I group by?");
      setSuggestedField(groupField);
      await showPivotSummary(result.fetchPath, groupField);
      await handleVisualization(result.fetchPath, groupField);
    } else {
      pushBot(result.response);
    }
  };

  /** Resize */
  const startTextResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sY = e.clientY;
    const sH = textHeight;
    const move = (ev: MouseEvent) => setTextHeight(Math.max(60, sH + (sY - ev.clientY)));
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const startWindowResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    e.preventDefault();
    startYRef.current = e.clientY;
    startHRef.current = winSize.height;
    isResizingRef.current = true;
    const move = (ev: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dy = ev.clientY - startYRef.current;
      setWinSize((p) => ({ ...p, height: Math.max(MIN_HEIGHT, startHRef.current - dy) }));
    };
    const up = () => {
      isResizingRef.current = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const toggleMaximize = () => {
    if (!isMaximized) {
      prevSizeRef.current = { ...winSize };
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
      if (prevSizeRef.current) setWinSize(prevSizeRef.current);
    }
  };

  const containerStyle: React.CSSProperties = isMaximized
    ? { width: "90vw", height: "90vh" }
    : { width: `${winSize.width}px`, height: `${winSize.height}px` };

  /** Render */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={containerStyle}
            className="relative z-10 bg-white/70 backdrop-blur-md border border-gray-300/40 rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-yellow-400 text-black font-semibold px-5 py-4 rounded-t-2xl flex justify-between items-center border-b border-black relative select-none">
              <div className="flex items-center gap-2">
                <img src={logoEBlack} alt="Dedge" className="w-6 h-6" />
                <span className="text-lg">Dedge</span>
              </div>

              <div
                onMouseDown={startWindowResize}
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-2 rounded-full ${
                  isMaximized ? "opacity-30 pointer-events-none" : "cursor-ns-resize"
                } bg-gray-600/70 hover:bg-gray-800 transition`}
                title="Drag to resize window height"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMaximize}
                  className="text-black text-xl leading-none hover:opacity-80"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? "❐" : "⛶"}
                </button>
                <button
                  onClick={onClose}
                  className="text-black font-bold text-xl hover:opacity-70"
                  title="Close"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-white relative">
              {messages.map((msg, i) => (
                <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
                  {msg.sender === "bot" ? (
                    <div className="inline-block text-left bg-gray-200 px-4 py-2 rounded-xl text-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                      {msg.chart && <DedgeChart chart={msg.chart} />}
                    </div>
                  ) : (
                    <span className="inline-block px-4 py-2 rounded-xl bg-blue-500 text-white whitespace-pre-line text-left">
                      {msg.text}
                    </span>
                  )}
                </div>
              ))}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 bg-yellow-400 border border-black text-black px-3 py-1 rounded-full shadow hover:bg-yellow-300 transition"
                  title="Scroll to bottom"
                >
                  ⬇️
                </button>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 bg-white/70 rounded-b-2xl flex flex-col gap-2 relative">
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  const sY = e.clientY;
                  const sH = textHeight;
                  const move = (ev: MouseEvent) => setTextHeight(Math.max(60, sH + (sY - ev.clientY)));
                  const up = () => {
                    document.removeEventListener("mousemove", move);
                    document.removeEventListener("mouseup", up);
                  };
                  document.addEventListener("mousemove", move);
                  document.addEventListener("mouseup", up);
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 cursor-n-resize bg-gray-400/60 rounded-full hover:bg-gray-500/90 transition"
                title="Drag to resize text input"
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                style={{ height: `${textHeight}px` }}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <button
                onClick={handleSend}
                className="self-end bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg border border-black hover:bg-yellow-300 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
