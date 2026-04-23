import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SAFEGUARD_PROMPT } from "../prompts/safeguard.ts";
import { fillTemplate } from "../prompts/template.ts";

const MODEL = process.env.MODEL_SAFEGUARD ?? "claude-haiku-4-5-20251001";

export const SafeguardResultSchema = z.object({
  crisis: z.boolean(),
  crisis_for: z.enum(["self", "third_party", "none"]),
  severity: z.enum(["low", "medium", "high"]),
});

export type SafeguardResult = z.infer<typeof SafeguardResultSchema>;

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
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [
        { role: "user", content: fillTemplate(SAFEGUARD_PROMPT, { message }) },
      ],
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
