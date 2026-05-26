import { useScanner } from "@/hooks/useScanner";
import { Camera, CameraOff, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScannerStatus = "scanning" | "loading" | "detected" | "idle";

interface Props {
  onDetected: (code: string) => void;
  paused?: boolean;
  status?: ScannerStatus;
}

const ELEMENT_ID = "qr-scanner-region";

export function ScannerView({ onDetected, paused = false, status = "scanning" }: Props) {
  const { active, error, start, stop } = useScanner(ELEMENT_ID, onDetected, {
    paused,
  });

  const borderColor =
    status === "detected"
      ? "border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.6)]"
      : status === "loading"
        ? "border-primary"
        : "border-primary/80";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-2xl border border-border bg-black">
        <div id={ELEMENT_ID} className="absolute inset-0" />

        {!active && !paused && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Camera className="h-10 w-10 opacity-60" />
          </div>
        )}

        {/* Darkened mask + viewfinder */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "relative h-2/3 w-2/3 rounded-xl border-2 transition-all duration-150",
              "shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]",
              borderColor,
            )}
          >
            {/* Corner accents */}
            <Corner className="top-0 left-0 border-t-2 border-l-2 rounded-tl-xl" />
            <Corner className="top-0 right-0 border-t-2 border-r-2 rounded-tr-xl" />
            <Corner className="bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl" />
            <Corner className="bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl" />

            {/* Scan line */}
            {status === "scanning" && active && (
              <div className="absolute inset-x-2 top-0 h-0.5 bg-primary/80 animate-[scanline_2s_ease-in-out_infinite]" />
            )}

            {/* Status badge */}
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Looking up…
                </div>
              </div>
            )}
            {status === "detected" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Match found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
      )}

      <button
        onClick={() => (active ? stop() : start())}
        className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:opacity-90 transition"
      >
        {active ? (
          <>
            <CameraOff className="h-3.5 w-3.5" /> Stop camera
          </>
        ) : (
          <>
            <Camera className="h-3.5 w-3.5" /> Start camera
          </>
        )}
      </button>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "absolute h-5 w-5 border-current",
        className,
      )}
    />
  );
}
