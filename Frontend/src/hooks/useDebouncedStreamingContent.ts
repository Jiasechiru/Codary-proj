import { useEffect, useRef, useState } from "react";

const STREAMING_THROTTLE_MS = 75;

/**
 * Throttles markdown re-renders during streaming.
 * Debounce breaks continuous token streams because each delta resets the timer.
 */
export function useDebouncedStreamingContent(
  content: string,
  isStreaming: boolean,
  intervalMs = STREAMING_THROTTLE_MS
) {
  const [streamContent, setStreamContent] = useState(content);
  const latestRef = useRef(content);
  const timeoutRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    latestRef.current = content;

    const clearScheduled = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (!isStreaming) {
      clearScheduled();
      setStreamContent(content);
      lastUpdateRef.current = 0;
      return;
    }

    const publish = () => {
      setStreamContent(latestRef.current);
      lastUpdateRef.current = Date.now();
      timeoutRef.current = null;
    };

    const now = Date.now();
    const elapsed =
      lastUpdateRef.current === 0 ? intervalMs : now - lastUpdateRef.current;

    if (elapsed >= intervalMs) {
      publish();
      return;
    }

    if (timeoutRef.current === null) {
      timeoutRef.current = window.setTimeout(publish, intervalMs - elapsed);
    }
  }, [content, isStreaming, intervalMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isStreaming ? streamContent : content;
}
