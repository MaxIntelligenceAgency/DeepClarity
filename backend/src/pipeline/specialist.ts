import Anthropic from "@anthropic-ai/sdk";
import { CLARITY_SYSTEM_TEMPLATE } from "../prompts/clarity.ts";
import { fillTemplate } from "../prompts/template.ts";
import { createTokenBatcher } from "../utils/token_batcher.ts";

const MODEL = process.env.MODEL_SPECIALIST ?? "claude-opus-4-6";
const MAX_TOKENS = 1500;
const BATCH_MS = 16;

export type StreamCallbacks = {
  onToken: (text: string) => void;
  onDone: (info: { fullText: string; stopReason: string | null }) => void;
  onError: (err: Error) => void;
};

function formatSkillContents(skillContents: Record<string, string>): string {
  const keys = Object.keys(skillContents);
  if (keys.length === 0) {
    return "(no skills were selected for this turn — the router determined the user message was out of scope)";
  }
  return keys
    .map((k) => `================\nSKILL: ${k}\n================\n\n${skillContents[k]}`)
    .join("\n\n");
}

export async function streamSpecialist(
  client: Anthropic,
  opts: {
    message: string;
    skillContents: Record<string, string>;
    signal?: AbortSignal;
  },
  cb: StreamCallbacks,
): Promise<void> {
  const system = fillTemplate(CLARITY_SYSTEM_TEMPLATE, {
    skill_contents: formatSkillContents(opts.skillContents),
  });

  // Hoisted out of the try block so the catch branch can report it
  // even if the stream is aborted mid-flight.
  let fullText = "";
  let stopReason: string | null = null;

  const batcher = createTokenBatcher(BATCH_MS, (text) => cb.onToken(text));

  try {
    const stream = await client.messages.stream(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: "user", content: opts.message }],
      },
      { signal: opts.signal },
    );

    for await (const event of stream) {
      if (opts.signal?.aborted) break;
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        fullText += event.delta.text;
        batcher.push(event.delta.text);
      } else if (event.type === "message_delta" && event.delta.stop_reason) {
        stopReason = event.delta.stop_reason;
      }
    }

    batcher.close();
    cb.onDone({ fullText, stopReason });
  } catch (err) {
    batcher.close();
    if (opts.signal?.aborted) {
      cb.onDone({ fullText, stopReason: "aborted" });
      return;
    }
    cb.onError(err instanceof Error ? err : new Error(String(err)));
  }
}
