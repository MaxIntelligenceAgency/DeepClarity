import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SafeguardResult } from "../pipeline/safeguard.ts";
import type { RouterResult } from "../pipeline/router.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, "../../logs/requests.jsonl");

export type RequestLogEntry = {
  request_id: string;
  timestamp: string;
  endpoint: "chat" | "chat-baseline";
  message: string;
  safeguard_result?: SafeguardResult;
  router_result?: RouterResult;
  skill_names?: string[];
  full_response: string;
  total_latency_ms: number;
  router_latency_ms?: number;
  safeguard_latency_ms?: number;
  first_token_latency_ms?: number;
  status: "ok" | "crisis_fallback" | "error";
  error?: string;
};

let ensured = false;

function ensureDir(): void {
  if (ensured) return;
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  ensured = true;
}

export function appendRequestLog(entry: RequestLogEntry): void {
  ensureDir();
  try {
    fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.warn("[logger] append failed:", err);
  }
  const summary = [
    `[${entry.timestamp}]`,
    entry.endpoint,
    entry.status,
    `rid=${entry.request_id}`,
    entry.skill_names ? `skills=[${entry.skill_names.join(",")}]` : "",
    entry.first_token_latency_ms !== undefined ? `ttft=${entry.first_token_latency_ms}ms` : "",
    `total=${entry.total_latency_ms}ms`,
  ]
    .filter(Boolean)
    .join(" ");
  console.log(summary);
}

export function newRequestId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
