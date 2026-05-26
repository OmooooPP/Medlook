import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScannerView, type ScannerStatus } from "@/components/ScannerView";
import { MedicineCard } from "@/components/MedicineCard";
import { useAuth } from "@/hooks/useAuth";
import { getMedicineByCode } from "@/services/medicineService";
import type { Medicine } from "@/types/medicine";
import { ScanLine, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  component: ScannerPage,
});

function ScannerPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ScannerStatus>("scanning");
  const [match, setMatch] = useState<Medicine | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const handleDetected = useCallback(async (code: string) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLastCode(code);
    setStatus("loading");
    try {
      const found = await getMedicineByCode(code);
      if (found) {
        setMatch(found);
        setStatus("detected");
      } else {
        toast.error("Item not found in database.", {
          description: "Try the Identify tab to search by appearance.",
        });
        setStatus("scanning");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lookup failed");
      setStatus("scanning");
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    setMatch(null);
    setLastCode(null);
    setStatus("scanning");
  }, []);

  // Release camera on unmount (route change) — handled by useScanner cleanup,
  // but pausing here makes the intent explicit.
  useEffect(() => () => setStatus("idle"), []);

  const paused = match !== null;

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-primary" /> Scanner
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Point the camera at a unit-dose pack — matches open instantly.
        </p>
      </section>

      <ScannerView
        onDetected={handleDetected}
        paused={paused}
        status={status}
      />

      {lastCode && !match && (
        <p className="text-center text-xs font-mono text-muted-foreground truncate">
          {status === "loading" ? "Querying " : "Last "}
          <span className="text-foreground">{lastCode}</span>
        </p>
      )}

      {match && (
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Result
            </span>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Scan again
            </button>
          </div>
          <MedicineCard medicine={match} canEdit={!!user} />
        </div>
      )}
    </div>
  );
}
