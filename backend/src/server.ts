import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { makeHealthRouter } from "./routes/health.ts";
import { makeSkillsRouter } from "./routes/skills.ts";
import { makeChatRouter } from "./routes/chat.ts";
import { makeBaselineRouter } from "./routes/baseline.ts";

const PORT = Number(process.env.PORT ?? 3001);

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.warn(
    "[server] ANTHROPIC_API_KEY is not set. /chat and /chat-baseline will error; /health and /skills still work.",
  );
}

const client = new Anthropic({ apiKey: apiKey ?? "unset" });

const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      try {
        const { hostname } = new URL(origin);
        if (hostname === "localhost" || hostname === "127.0.0.1") return cb(null, true);
      } catch {
        /* fall through */
      }
      cb(null, false);
    },
  }),
);
app.use(express.json({ limit: "256kb" }));

app.use(makeHealthRouter());
app.use(makeSkillsRouter());
app.use(makeChatRouter(client));
app.use(makeBaselineRouter(client));

app.listen(PORT, () => {
  console.log(`[server] listening on http://127.0.0.1:${PORT}`);
  console.log(`[server] routes: GET /health  GET /skills  POST /chat  POST /chat-baseline`);
});
