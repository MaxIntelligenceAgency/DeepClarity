import express, { type Router, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { runSafeguard } from "../pipeline/safeguard.ts";
import { runRouter } from "../pipeline/router.ts";
import { streamSpecialist } from "../pipeline/specialist.ts";
import { FALLBACK_RESPONSE } from "../pipeline/fallback.ts";
import { loadSkills } from "../skills/loader.ts";
import { openSSE } from "../utils/sse.ts";
import { appendRequestLog, newRequestId } from "../utils/logger.ts";

type ChatBody = { message?: unknown };

export function makeChatRouter(client: Anthropic): Router {
  const router = express.Router();

  router.post("/chat", async (req: Request<unknown, unknown, ChatBody>, res: Response) => {
    const started = Date.now();
    const request_id = newRequestId();
    const timestamp = new Date(started).toISOString();
    const message = typeof req.body.message === "string" ? req.body.message : "";

    if (!message.trim()) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const sse = openSSE(res);
    const controller = new AbortController();
    req.on("close", () => controller.abort());

    sse.send("meta", { request_id, timestamp, endpoint: "chat" });

    let firstTokenAt: number | null = null;
    let fullResponse = "";

    try {
      const tSafeguardStart = Date.now();
      const tRouterStart = tSafeguardStart;

      const [safeguardResult, routerResult] = await Promise.all([
        runSafeguard(client, message),
        runRouter(client, message, null),
      ]);

      const safeguard_latency_ms = Date.now() - tSafeguardStart;
      const router_latency_ms = Date.now() - tRouterStart;

      sse.send("safeguard_result", { ...safeguardResult, latency_ms: safeguard_latency_ms });

      if (
        safeguardResult.crisis &&
        safeguardResult.crisis_for === "self" &&
        safeguardResult.severity === "high"
      ) {
        sse.send("crisis_fallback", { text: FALLBACK_RESPONSE });
        fullResponse = FALLBACK_RESPONSE;
        sse.close();

        appendRequestLog({
          request_id,
          timestamp,
          endpoint: "chat",
          message,
          safeguard_result: safeguardResult,
          router_result: routerResult,
          skill_names: [],
          full_response: fullResponse,
          total_latency_ms: Date.now() - started,
          safeguard_latency_ms,
          router_latency_ms,
          status: "crisis_fallback",
        });
        return;
      }

      sse.send("router_decision", { ...routerResult, latency_ms: router_latency_ms });

      const skillContents = await loadSkills(routerResult.selected_skills);
      const skillNames = Object.keys(skillContents);

      await new Promise<void>((resolve) => {
        streamSpecialist(
          client,
          { message, skillContents, signal: controller.signal },
          {
            onToken: (text) => {
              if (firstTokenAt === null) {
                firstTokenAt = Date.now();
                sse.send("first_token", { latency_ms: firstTokenAt - started });
              }
              fullResponse += text;
              sse.send("content", { delta: text });
            },
            onDone: ({ stopReason }) => {
              sse.send("specialist_done", { stopReason });
              resolve();
            },
            onError: (err) => {
              sse.send("error", { message: err.message, recoverable: false });
              resolve();
            },
          },
        );
      });

      sse.close();

      appendRequestLog({
        request_id,
        timestamp,
        endpoint: "chat",
        message,
        safeguard_result: safeguardResult,
        router_result: routerResult,
        skill_names: skillNames,
        full_response: fullResponse,
        total_latency_ms: Date.now() - started,
        safeguard_latency_ms,
        router_latency_ms,
        first_token_latency_ms: firstTokenAt ? firstTokenAt - started : undefined,
        status: "ok",
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("[chat] error:", err);
      if (!sse.closed()) {
        sse.send("error", { message: errMsg, recoverable: false });
        sse.close();
      }
      appendRequestLog({
        request_id,
        timestamp,
        endpoint: "chat",
        message,
        full_response: fullResponse,
        total_latency_ms: Date.now() - started,
        status: "error",
        error: errMsg,
      });
    }
  });

  return router;
}
