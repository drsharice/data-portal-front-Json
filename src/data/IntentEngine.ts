// src/data/IntentEngine.ts
// Reasoning layer for Dedge: detects intents, maps to datasets, supports context.

import { KnowledgeMap } from "./KnowledgeMap";

export type IntentType =
  | "help"
  | "catalog"
  | "list_datasets"
  | "dataset"
  | "list_fields"
  | "count"
  | "chart"
  | "group"
  | "unknown";

export interface IntentContext {
  lastDatasetKey?: keyof typeof KnowledgeMap.accessible | null;
}

export interface IntentResult {
  intent: IntentType;
  datasetKey?: keyof typeof KnowledgeMap.accessible;
  response: string;
  fetchPath?: string;
}

/** -------- Helpers -------- */
const normalize = (s: string) =>
  s.toLowerCase().replace(/[_\-]+/g, " ").replace(/\s+/g, " ").trim();

const DATASET_ALIASES: Record<string, string[]> = {
  Active_Directory_Computers: ["ad computers", "active directory computers", "computers"],
  Active_Directory_Groups: ["ad groups", "active directory groups", "groups"],
  Bloomberg_User_ReportTable: ["bloomberg", "bloomberg users"],
  Computer_Hardware: ["hardware", "computer hardware", "devices hardware"],
  Finance_Budget: ["finance budget", "budget", "budgets"],
  HR_Devices: ["hr devices", "devices", "mobile devices"],
  HR_Employees: ["hr employees", "employees", "staff"],
  IT_Software: ["it software", "software", "licenses"],
  OCC_Unified_Patching_Report: ["patching", "patch report", "occ patching"],
  RightFax_Users: ["rightfax", "fax users", "rightfax users"],
  User_Entitlements: ["entitlements", "wave", "onedrive", "exchange", "user entitlements"],
};

function findDatasetKey(msg: string): keyof typeof KnowledgeMap.accessible | undefined {
  const n = normalize(msg);
  for (const key of Object.keys(KnowledgeMap.accessible) as Array<
    keyof typeof KnowledgeMap.accessible
  >) {
    const label = normalize(key.replace(/_/g, " "));
    if (n.includes(label)) return key;
  }
  for (const [key, aliases] of Object.entries(DATASET_ALIASES) as Array<
    [keyof typeof KnowledgeMap.accessible, string[]]
  >) {
    if (aliases.some(a => n.includes(normalize(a)))) return key;
  }
  return undefined;
}

/** -------- Interpreter -------- */
export function interpretIntent(message: string, ctx?: IntentContext): IntentResult {
  const msg = normalize(message);

  // HELP
  if (["help", "what can you do", "commands", "abilities"].some(q => msg.includes(normalize(q)))) {
    return {
      intent: "help",
      response:
        "I can help you with:\n" +
        "• List your accessible datasets\n" +
        "• Summarize or preview data samples\n" +
        "• List fields or row counts\n" +
        "• Create charts or group data by fields\n" +
        "• Access APIs, reports, and catalog items",
    };
  }

  // CATALOG
  if (msg.includes("catalog") || msg.includes("request access") || msg.includes("available datasets")) {
    return {
      intent: "catalog",
      response:
        "The Catalog contains datasets, APIs, and reports you can request. I’ll only provide metadata for those until access is granted.",
      fetchPath: KnowledgeMap.restricted.catalog.path,
    };
  }

  // LIST MY DATASETS
  if (
    /(what|which)\s+(data\s*sets|datasets).*(have|access|available|mine)/.test(msg) ||
    /(my|available)\s+datasets?/.test(msg) ||
    /show\s+(me\s+)?(my\s+)?datasets?/.test(msg)
  ) {
    const names = Object.keys(KnowledgeMap.accessible)
      .map(k => k.replace(/_/g, " "))
      .sort();
    return {
      intent: "list_datasets",
      response:
        `You currently have access to ${names.length} dataset(s):\n• ` +
        names.join("\n• "),
    };
  }

  // LIST FIELDS / COLUMNS
  if (/(fields|columns|schema|headers)/.test(msg)) {
    const explicitKey = findDatasetKey(msg);
    const datasetKey = explicitKey || ctx?.lastDatasetKey;
    if (!datasetKey) {
      return {
        intent: "list_fields",
        response: "Which dataset should I list fields for? (e.g., 'List Finance Budget fields')",
      };
    }
    const info = KnowledgeMap.accessible[datasetKey];
    return {
      intent: "list_fields",
      datasetKey,
      response: `Fields in ${datasetKey.replace(/_/g, " ")}: ${info.keyFields.join(", ")}`,
    };
  }

  // COUNT
  if (/(how many|count|number of|row count|record count)/.test(msg)) {
    const explicitKey = findDatasetKey(msg);
    const datasetKey = explicitKey || ctx?.lastDatasetKey;
    if (!datasetKey) {
      return {
        intent: "count",
        response: "Which dataset should I count? (e.g., 'How many records in HR Employees?')",
      };
    }
    const info = KnowledgeMap.accessible[datasetKey];
    return {
      intent: "count",
      datasetKey,
      fetchPath: info.path,
      response: `Counting records in ${datasetKey.replace(/_/g, " ")}…`,
    };
  }

  // CHART INTENT
  if (/(chart|graph|visualize|plot)/.test(msg)) {
    const datasetKey = findDatasetKey(msg) || ctx?.lastDatasetKey;
    if (!datasetKey) {
      return {
        intent: "chart",
        response: "Which dataset would you like me to chart? (e.g., 'Show a bar chart of Finance Budget')",
      };
    }
    const match = msg.match(/by ([a-zA-Z0-9_ ]+)/);
    const groupField = match ? match[1].trim().replace(/\s+/g, "_") : undefined;
    const info = KnowledgeMap.accessible[datasetKey];
    return {
      intent: "chart",
      datasetKey,
      response: groupField
        ? `📊 Sure! I’ll generate a chart of ${datasetKey.replace(/_/g, " ")} grouped by ${groupField}.`
        : `📊 I’ll visualize the ${datasetKey.replace(/_/g, " ")} dataset.`,
      fetchPath: info.path,
    };
  }

  // GROUP INTENT
  if (/(group|summarize|aggregate)/.test(msg)) {
    const datasetKey = findDatasetKey(msg) || ctx?.lastDatasetKey;
    if (!datasetKey) {
      return {
        intent: "group",
        response: "Which dataset should I group? (e.g., 'Group HR Employees by title')",
      };
    }
    const match = msg.match(/by ([a-zA-Z0-9_ ]+)/);
    const groupField = match ? match[1].trim().replace(/\s+/g, "_") : undefined;
    const info = KnowledgeMap.accessible[datasetKey];
    return {
      intent: "group",
      datasetKey,
      response: groupField
        ? `📊 I’ll group ${datasetKey.replace(/_/g, " ")} by ${groupField}.`
        : `📊 I’ll summarize ${datasetKey.replace(/_/g, " ")}.`,
      fetchPath: info.path,
    };
  }

 // DATASET
const key = findDatasetKey(msg);
if (key) {
  const info = KnowledgeMap.accessible[key];
  const summary =
    `✅ You have access to **${key.replace(/_/g, " ")}**.\n` +
    `Description: ${info.description}\n\n` +
    `Key fields: ${info.keyFields.join(", ")}\n\n` +
    `I can help you with:\n` +
    `**1. List fields**\n` +
    `**2. Count rows**\n` +
    `**3. Preview sample data**\n` +
    `**4. Group data**\n` +
    `**5. Visualize with charts**\n` +
    `*(Reply with a number to choose an option)*`;
  return { intent: "dataset", datasetKey: key, response: summary, fetchPath: info.path };
}

  return {
    intent: "unknown",
    response:
      "I didn’t quite catch that. Try:\n" +
      "• 'What datasets do I have access to?'\n" +
      "• 'Show me Finance Budget'\n" +
      "• 'List HR Employees fields'\n" +
      "• 'Show a chart of Finance Budget by department'",
  };
}
