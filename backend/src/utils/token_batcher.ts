/**
 * Coalesces token deltas arriving within `batchMs` into single `onFlush` calls.
 * Used to smooth SSE emission of Anthropic stream deltas without breaking streaming perception.
 *
 * Contract:
 * - `push(delta)` buffers `delta` and (re)arms a flush timer if one isn't already armed.
 * - `close()` cancels any pending timer and flushes the buffer synchronously.
 * - Calling `close()` is idempotent.
 */
export type TokenBatcher = {
  push: (delta: string) => void;
  close: () => void;
};

export function createTokenBatcher(
  batchMs: number,
  onFlush: (text: string) => void,
): TokenBatcher {
  let buffer = "";
  let timer: NodeJS.Timeout | null = null;
  let closed = false;

  const flush = (): void => {
    if (buffer.length > 0) {
      const text = buffer;
      buffer = "";
      onFlush(text);
    }
    timer = null;
  };

  return {
    push(delta: string): void {
      if (closed || delta.length === 0) return;
      buffer += delta;
      if (timer === null) timer = setTimeout(flush, batchMs);
    },
    close(): void {
      if (closed) return;
      closed = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      flush();
    },
  };
}
