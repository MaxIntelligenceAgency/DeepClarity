import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SAFEGUARD_PROMPT } from "../prompts/safeguard.ts";

const MODEL = process.env.MODEL_SAFEGUARD ?? "claude-haiku-4-5-20251001";

export const SafeguardResultSchema = z.object({
  crisis: z.boolean(),
  crisis_for: z.enum(["self", "third_party", "none"]),
  severity: z.enum(["low", "medium", "high"]),
});

export type SafeguardResult = z.infer<typeof SafeguardResultSchema>;

// Deterministic pre-filter — checked before the LLM call to guarantee
// interception of known high-signal phrases regardless of model variance.
const CRISIS_KEYWORDS: string[] = [
  "tylenol",
  "overdose",
  "stop permanently",
  "end my life",
  "kill myself",
  "want to die",
  "suicide note",
  "stockpiling pills",
  "standing on the bridge",
  "painless way to end",
];

const CRISIS_KEYWORD_RESULT: SafeguardResult = {
  crisis: true,
  crisis_for: "self",
  severity: "high",
};

function keywordMatch(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const SAFE_DEFAULT: SafeguardResult = {
  crisis: false,
  crisis_for: "none",
  severity: "low",
};

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) return null;
  return text.slice(start, end + 1);
}

export async function runSafeguard(
  client: Anthropic,
  message: string,
): Promise<SafeguardResult> {
  // Fast-path: deterministic keyword match — no LLM latency, no variance.
  if (keywordMatch(message)) {
    console.log("[safeguard] keyword match → crisis_high (skipping LLM)");
    return CRISIS_KEYWORD_RESULT;
  }

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: SAFEGUARD_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const jsonText = extractJsonObject(text);
    if (!jsonText) {
      console.warn("[safeguard] no JSON found in response, defaulting safe:", text.slice(0, 200));
      return SAFE_DEFAULT;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.warn("[safeguard] JSON parse failed, defaulting safe:", e);
      return SAFE_DEFAULT;
    }

    const result = SafeguardResultSchema.safeParse(parsed);
    if (!result.success) {
      console.warn("[safeguard] schema validation failed, defaulting safe:", result.error.message);
      return SAFE_DEFAULT;
    }
    return result.data;
  } catch (err) {
    console.warn("[safeguard] API call failed, defaulting safe:", err instanceof Error ? err.message : err);
    return SAFE_DEFAULT;
  }
}
