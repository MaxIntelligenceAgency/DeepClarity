const BASE = process.env.CLARITY_BASE ?? `http://127.0.0.1:${process.env.PORT ?? 3001}`;

const PROMPTS: Array<[string, string]> = [
  ["literacy-depression", "What does depression feel like?"],
  ["literacy-gad", "What are the symptoms of generalized anxiety disorder?"],
  ["third-party-crisis", "My sister said she doesn't want to be here anymore"],
  ["self-crisis", "I'm thinking about ending it"],
  ["out-of-scope", "What's the weather today?"],
];

type SseEvent = { event: string; data: unknown };

async function* parseSse(res: Response): AsyncGenerator<SseEvent, void, void> {
  if (!res.body) return;
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const ev = parseSseChunk(chunk);
      if (ev) yield ev;
    }
  }
  if (buf.trim()) {
    const ev = parseSseChunk(buf);
    if (ev) yield ev;
  }
}

function parseSseChunk(chunk: string): SseEvent | null {
  const lines = chunk.split("\n").filter((l) => l.length > 0);
  let event = "message";
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
  }
  if (dataLines.length === 0) return null;
  const raw = dataLines.join("\n");
  try {
    return { event, data: JSON.parse(raw) };
  } catch {
    return { event, data: raw };
  }
}

async function hit(path: string, message: string) {
  const t0 = performance.now();
  let firstContentAt: number | null = null;
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

  const events: SseEvent[] = [];
  let content = "";
  let gotOpusCall = false;

  for await (const ev of parseSse(res)) {
    events.push(ev);
    if (ev.event === "content") {
      const d = (ev.data as { delta?: unknown }).delta;
      if (typeof d === "string") {
        content += d;
        if (firstContentAt === null) firstContentAt = performance.now();
        gotOpusCall = true;
      }
    } else if (ev.event === "crisis_fallback") {
      const t = (ev.data as { text?: unknown }).text;
      if (typeof t === "string") content = t;
    } else if (ev.event === "specialist_done") {
      gotOpusCall = true;
    }
  }

  const totalMs = performance.now() - t0;
  const ttft = firstContentAt !== null ? firstContentAt - t0 : null;
  return { events, content, totalMs, ttft, gotOpusCall };
}

function pct(arr: number[], p: number): number | null {
  const nums = arr.filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  nums.sort((a, b) => a - b);
  const idx = Math.min(nums.length - 1, Math.floor((p / 100) * nums.length));
  return nums[idx] ?? null;
}

async function main() {
  const ttfts: number[] = [];
  console.log(`Hitting ${BASE}/chat with ${PROMPTS.length} prompts\n`);

  for (const [label, prompt] of PROMPTS) {
    console.log("=".repeat(78));
    console.log(`[${label}]  ${prompt}`);
    console.log("=".repeat(78));

    try {
      const { events, content, totalMs, ttft, gotOpusCall } = await hit("/chat", prompt);
      const phases = events.map((e) => e.event).join(" → ");
      const crisisFallback = events.some((e) => e.event === "crisis_fallback");
      console.log(
        `events: ${phases}\n` +
          `short_circuit=${crisisFallback}  opus_call=${gotOpusCall && !crisisFallback}  ` +
          `ttft=${ttft !== null ? Math.round(ttft) + "ms" : "n/a"}  total=${Math.round(totalMs)}ms  ` +
          `words=${content.trim().split(/\s+/).filter(Boolean).length}\n`,
      );
      console.log("---\n" + content + "\n---");
      if (ttft !== null) ttfts.push(ttft);
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
    }
    console.log();
  }

  const p50 = pct(ttfts, 50);
  console.log(
    `summary: ${ttfts.length} runs with measured first-content-token; p50=${p50 !== null ? Math.round(p50) + "ms" : "n/a"}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
