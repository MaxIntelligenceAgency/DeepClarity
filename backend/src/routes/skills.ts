import express, { type Router } from "express";
import { listSkillMetas } from "../skills/loader.ts";

export function makeSkillsRouter(): Router {
  const router = express.Router();
  router.get("/skills", async (_req, res) => {
    try {
      const metas = await listSkillMetas();
      res.json(
        metas.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          license: m.license ?? null,
        })),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[skills] error:", msg);
      res.status(500).json({ error: msg });
    }
  });
  return router;
}
