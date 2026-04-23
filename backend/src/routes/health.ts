import express, { type Router } from "express";

export function makeHealthRouter(): Router {
  const router = express.Router();
  router.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  return router;
}
