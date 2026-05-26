import { useState } from "react";
import { SHAPES, SCORINGS } from "@/constants/medicine";
import type { MedicineFilter, Scoring } from "@/types/medicine";
import { ColorSwatchPicker } from "@/components/ColorSwatches";
import { Search, X } from "lucide-react";

interface Props {
  onSubmit: (f: MedicineFilter) => void;
  loading?: boolean;
}

export function IdentifyForm({ onSubmit, loading }: Props) {
  const [colors, setColors] = useState<string[]>([]);
  const [shape, setShape] = useState("");
  const [scoring, setScoring] = useState<Scoring | "">("");
  const [labels, setLabels] = useState("");

  const reset = () => {
    setColors([]);
    setShape("");
    setScoring("");
    setLabels("");
    onSubmit({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      colors: colors.length ? colors : undefined,
      shape: shape || undefined,
      scoring: (scoring as Scoring) || undefined,
      labels: labels || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Color {colors.length > 0 && `· ${colors.length} selected`}
        </p>
        <ColorSwatchPicker value={colors} onChange={setColors} />
      </div>

      <Pills label="Shape" options={SHAPES} value={shape} onChange={setShape} />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Scoring
        </p>
        <div className="flex flex-wrap gap-2">
          {SCORINGS.map((s) => {
            const active = scoring === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setScoring(active ? "" : s.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Imprint / Labels
        </label>
        <input
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          placeholder="e.g. M 30, AZ 250"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          <Search className="h-4 w-4" /> {loading ? "Searching…" : "Identify"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-accent"
        >
          <X className="h-4 w-4" /> Clear
        </button>
      </div>
    </form>
  );
}

function Pills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(active ? "" : o)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
