import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ROUTER_PROMPT } from "../prompts/router.ts";

const MODEL = process.env.MODEL_ROUTER ?? "claude-haiku-4-5-20251001";

export const RouterResultSchema = z.object({
  selected_skills: z.array(z.enum(["mhgap", "29k", "ifme"])),
  reasoning: z.string(),
  user_role: z.string(),
});

export type RouterResult = z.infer<typeof RouterResultSchema>;

const DEFAULT: RouterResult = {
  selected_skills: ["mhgap", "29k", "ifme"],
  reasoning: "defaulting to full composition",
  user_role: "other",
};

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) return null;
  return text.slice(start, end + 1);
}

export async function runRouter(client: Anthropic, message: string): Promise<RouterResult> {
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: ROUTER_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const jsonText = extractJsonObject(text);
    if (!jsonText) {
      console.warn("[router] no JSON found, defaulting:", text.slice(0, 200));
      return DEFAULT;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.warn("[router] JSON parse failed, defaulting:", e);
      return DEFAULT;
    }

    const result = RouterResultSchema.safeParse(parsed);
    if (!result.success) {
      console.warn("[router] schema validation failed, defaulting:", result.error.message);
      return DEFAULT;
    }
    return result.data;
  } catch (err) {
    console.warn("[router] API call failed, defaulting:", err instanceof Error ? err.message : err);
    return DEFAULT;
  }
}
