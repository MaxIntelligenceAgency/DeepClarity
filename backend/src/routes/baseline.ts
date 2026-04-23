import express, { type Router, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { openSSE } from "../utils/sse.ts";
import { appendRequestLog, newRequestId } from "../utils/logger.ts";
import { createTokenBatcher } from "../utils/token_batcher.ts";

const MODEL = process.env.MODEL_SPECIALIST ?? "claude-opus-4-6";
const MAX_TOKENS = 1500;
const BATCH_MS = 16;

type ChatBody = { message?: unknown };

export function makeBaselineRouter(client: Anthropic): Router {
  const router = express.Router();

  router.post(
    "/chat-baseline",
    async (req: Request<unknown, unknown, ChatBody>, res: Response) => {
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

      sse.send("meta", { request_id, timestamp, endpoint: "chat-baseline" });

      let firstTokenAt: number | null = null;
      let fullResponse = "";

      const batcher = createTokenBatcher(BATCH_MS, (text) => {
        if (firstTokenAt === null) {
          firstTokenAt = Date.now();
          sse.send("first_token", { latency_ms: firstTokenAt - started });
        }
        fullResponse += text;
        sse.send("content", { delta: text });
      });

      try {
        const stream = await client.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: "You are a helpful AI assistant.",
            messages: [{ role: "user", content: message }],
          },
          { signal: controller.signal },
        );

        let stopReason: string | null = null;
        for await (const event of stream) {
          if (controller.signal.aborted) break;
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            batcher.push(event.delta.text);
          } else if (event.type === "message_delta" && event.delta.stop_reason) {
            stopReason = event.delta.stop_reason;
          }
        }

        batcher.close();
        sse.send("specialist_done", { stopReason });
        sse.close();

        appendRequestLog({
          request_id,
          timestamp,
          endpoint: "chat-baseline",
          message,
          full_response: fullResponse,
          total_latency_ms: Date.now() - started,
          first_token_latency_ms: firstTokenAt !== null ? firstTokenAt - started : undefined,
          status: "ok",
        });
      } catch (err) {
        batcher.close();
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[chat-baseline] error:", err);
        if (!sse.closed()) {
          sse.send("error", { message: errMsg, recoverable: false });
          sse.close();
        }
        appendRequestLog({
          request_id,
          timestamp,
          endpoint: "chat-baseline",
          message,
          full_response: fullResponse,
          total_latency_ms: Date.now() - started,
          status: "error",
          error: errMsg,
        });
      }
    },
  );

  return router;
}
