import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Pencil } from "lucide-react";
import type { Medicine } from "@/types/medicine";
import { ColorSwatchDisplay, normalizeColors } from "@/components/ColorSwatches";

interface Props {
  medicine: Medicine;
  canEdit?: boolean;
  onEdit?: (m: Medicine) => void;
}

export function MedicineCard({ medicine, canEdit, onEdit }: Props) {
  const images = Array.isArray(medicine.images) ? medicine.images : [];
  const [idx, setIdx] = useState(0);
  const current = images[idx];

  const colors = (() => {
    const fromArray = normalizeColors(medicine.colors);
    if (fromArray.length > 0) return fromArray;
    return normalizeColors(medicine.color);
  })();

  return (
    <article className="rounded-2xl border border-border bg-card text-card-foreground overflow-hidden shadow-sm">
      <div className="relative h-64 w-full bg-white dark:bg-muted flex items-center justify-center overflow-hidden">
        {current ? (
          <img
            src={current.image_url}
            alt={`${medicine.name}${current.manufacturer ? " — " + current.manufacturer : ""}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next image"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-primary" : "bg-background/60"}`}
                />
              ))}
            </div>
          </>
        )}
        {current?.manufacturer && (
          <span className="absolute top-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-xs">
            {current.manufacturer}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight truncate">
              {medicine.name}
            </h3>
            {medicine.generic_name && (
              <p className="text-sm italic text-muted-foreground mt-0.5 truncate">
                {medicine.generic_name}
              </p>
            )}
            {medicine.code && (
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                {medicine.code}
              </p>
            )}
          </div>
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(medicine)}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-accent"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Color
            </dt>
            <dd className="mt-1">
              <ColorSwatchDisplay colors={colors} />
            </dd>
          </div>
          <Field label="Shape" value={medicine.shape} />
          <Field label="Scoring" value={medicine.scoring} />
          <Field label="Labels" value={medicine.labels} />
        </dl>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}
