import { useCallback, useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import { createScanner, SCANNER_CONFIG } from "@/services/scannerService";

interface Options {
  /** When true, scanner is stopped and will not auto-restart. */
  paused?: boolean;
  /** Min ms between two emissions of the same payload. */
  dedupeWindowMs?: number;
}

export function useScanner(
  elementId: string,
  onDetected: (code: string) => void,
  { paused = false, dedupeWindowMs = 1500 }: Options = {},
) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onDetectedRef = useRef(onDetected);
  const lastEmitRef = useRef<{ code: string; at: number } | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep latest callback without re-binding the camera.
  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const stop = useCallback(async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
    } catch {
      /* noop */
    }
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = createScanner(elementId);
      }
      if (scannerRef.current.isScanning) return;
      await scannerRef.current.start(
        { facingMode: "environment" },
        SCANNER_CONFIG,
        (decoded) => {
          const now = Date.now();
          const last = lastEmitRef.current;
          if (last && last.code === decoded && now - last.at < dedupeWindowMs) {
            return;
          }
          lastEmitRef.current = { code: decoded, at: now };
          onDetectedRef.current(decoded);
        },
        () => {},
      );
      setActive(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to start camera";
      setError(msg);
      setActive(false);
    }
  }, [elementId, dedupeWindowMs]);

  // React to `paused` toggling.
  useEffect(() => {
    if (paused) {
      stop();
    } else {
      start();
    }
  }, [paused, start, stop]);

  // Cleanup on unmount — releases camera.
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
      scannerRef.current = null;
    };
  }, []);

  const resetDedupe = useCallback(() => {
    lastEmitRef.current = null;
  }, []);

  return { active, error, start, stop, resetDedupe };
}
