import type { Response } from "express";

export type SseStream = {
  send: (event: string, data: unknown) => void;
  close: () => void;
  closed: () => boolean;
};

export function openSSE(res: Response): SseStream {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  let isClosed = false;

  const send = (event: string, data: unknown): void => {
    if (isClosed || res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const close = (): void => {
    if (isClosed || res.writableEnded) {
      isClosed = true;
      return;
    }
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
    isClosed = true;
  };

  return { send, close, closed: () => isClosed || res.writableEnded };
}
