import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = path.resolve(__dirname, "../../../skills");

export type SkillMeta = {
  id: string;          // on-disk directory name under ../skills/ — stable, router-facing
  name: string;        // human-readable display name from SKILL.md frontmatter (may differ from id)
  description: string;
  license?: string;
  version?: string;
};

const metaCache = new Map<string, SkillMeta>();
const bodyCache = new Map<string, string>();

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readDir(p: string): Promise<string[]> {
  try {
    return await fs.readdir(p);
  } catch {
    return [];
  }
}

export async function listSkillMetas(): Promise<SkillMeta[]> {
  const out: SkillMeta[] = [];
  const entries = await readDir(SKILLS_ROOT);
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const skillMd = path.join(SKILLS_ROOT, entry, "SKILL.md");
    if (!(await exists(skillMd))) continue;

    const cached = metaCache.get(entry);
    if (cached) {
      out.push(cached);
      continue;
    }

    const raw = await fs.readFile(skillMd, "utf8");
    const { data } = matter(raw);
    const meta: SkillMeta = {
      id: entry,
      name: String(data.name ?? entry),
      description: String(data.description ?? ""),
      license: data.license ? String(data.license) : undefined,
      version: data.version ? String(data.version) : undefined,
    };
    metaCache.set(entry, meta);
    out.push(meta);
  }
  return out;
}

export async function loadSkills(names: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const name of names) {
    if (bodyCache.has(name)) {
      result[name] = bodyCache.get(name)!;
      continue;
    }
    const skillDir = path.join(SKILLS_ROOT, name);
    const skillMdPath = path.join(skillDir, "SKILL.md");
    if (!(await exists(skillMdPath))) {
      console.warn(`[skills] skipping unknown skill: ${name}`);
      continue;
    }
    const raw = await fs.readFile(skillMdPath, "utf8");
    const { content: body } = matter(raw);

    const parts: string[] = [`# ${name} — SKILL.md\n`, body.trim()];

    const refDir = path.join(skillDir, "references");
    if (await exists(refDir)) {
      const refFiles = (await readDir(refDir))
        .filter((f) => !f.startsWith("."))
        .sort();
      for (const f of refFiles) {
        const refPath = path.join(refDir, f);
        const stat = await fs.stat(refPath);
        if (!stat.isFile()) continue;
        const refRaw = await fs.readFile(refPath, "utf8");
        parts.push(`\n---\n## reference: ${f}\n`, refRaw.trim());
      }
    }

    const concatenated = parts.join("\n").trim();
    bodyCache.set(name, concatenated);
    result[name] = concatenated;
  }
  return result;
}
