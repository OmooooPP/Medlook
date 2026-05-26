import { useState, useEffect } from "react";
import { SHAPES, SCORINGS } from "@/constants/medicine";
import type { Medicine, MedicineImage, Scoring } from "@/types/medicine";
import {
  upsertMedicine,
  uploadMedicineImage,
  deleteMedicineImage,
  getReadableErrorMessage,
} from "@/services/medicineService";
import { useAuth } from "@/hooks/useAuth";
import { ColorSwatchPicker, normalizeColors } from "@/components/ColorSwatches";
import { Save, Upload, Trash2, Loader2 } from "lucide-react";

interface Props {
  initial?: Medicine | null;
  onSaved?: (m: Medicine) => void;
}

export function UploadForm({ initial, onSaved }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [code, setCode] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [shape, setShape] = useState("");
  const [scoring, setScoring] = useState<Scoring | "">("");
  const [labels, setLabels] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [current, setCurrent] = useState<Medicine | null>(initial ?? null);

  useEffect(() => {
    if (initial) {
      setCurrent(initial);
      setName(initial.name);
      setGenericName(initial.generic_name ?? "");
      setCode(initial.code ?? "");
      const fromArray = normalizeColors(initial.colors);
      setColors(fromArray.length > 0 ? fromArray : normalizeColors(initial.color));
      setShape(initial.shape ?? "");
      setScoring((initial.scoring as Scoring) ?? "");
      setLabels(initial.labels ?? "");
    }
  }, [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("You must be signed in.");
      return;
    }
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    setSaving(true);
    const payload = {
      id: current?.id,
      name: name.trim(),
      generic_name: genericName.trim() || null,
      code: code.trim() || null,
      colors: colors.length ? colors : null,
      shape: shape || null,
      scoring: (scoring as Scoring) || null,
      labels: labels.trim() || null,
    };
    try {
      let saved = await upsertMedicine(payload, user.id);
      if (files && files.length > 0) {
        const uploadedImages: MedicineImage[] = [];
        for (const f of Array.from(files)) {
          uploadedImages.push(
            await uploadMedicineImage(saved.id, f, manufacturer.trim() || null),
          );
        }
        saved = {
          ...saved,
          images: [...(saved.images ?? []), ...uploadedImages],
        };
      }
      setSuccess("Saved successfully.");
      setFiles(null);
      setCurrent(saved);
      onSaved?.(saved);
    } catch (err) {
      console.error("Supabase Save Error: ", {
        error: err,
        payload,
        files: files
          ? Array.from(files).map((file) => ({
              name: file.name,
              size: file.size,
              type: file.type,
            }))
          : [],
      });
      setError(`Save failed: ${getReadableErrorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const removeImage = async (id: string) => {
    if (!current) return;
    setError(null);
    try {
      await deleteMedicineImage(id);
      setCurrent({
        ...current,
        images: current.images?.filter((i) => i.id !== id),
      });
    } catch (err) {
      console.error("Supabase Save Error: ", { error: err, imageId: id });
      setError(`Save failed: ${getReadableErrorMessage(err)}`);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Product Name (Trade Name) *">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Generic Name">
        <input
          value={genericName}
          onChange={(e) => setGenericName(e.target.value)}
          placeholder="e.g. Amoxicillin"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm italic outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Code (QR / NDC)">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>

      <Field label={`Colors${colors.length ? ` · ${colors.length} selected` : ""}`}>
        <ColorSwatchPicker value={colors} onChange={setColors} />
      </Field>

      <Field label="Shape">
        <Select value={shape} onChange={setShape} options={SHAPES} />
      </Field>
      <Field label="Scoring">
        <select
          value={scoring}
          onChange={(e) => setScoring(e.target.value as Scoring | "")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">—</option>
          {SCORINGS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Labels / Imprint">
        <input
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          placeholder="e.g. M 30"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Add manufacturer photos
        </p>
        <Field label="Manufacturer (optional)">
          <input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="e.g. Pfizer"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background px-3 py-6 text-sm text-muted-foreground hover:bg-accent">
          <Upload className="h-4 w-4" />
          {files && files.length > 0
            ? `${files.length} file(s) selected`
            : "Choose images (multiple allowed)"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {current?.images && current.images.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Existing images
          </p>
          <div className="grid grid-cols-3 gap-2">
            {current.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white dark:bg-muted flex items-center justify-center"
              >
                <img
                  src={img.image_url}
                  alt={img.manufacturer ?? ""}
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                {img.manufacturer && (
                  <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-background/85 px-1.5 py-0.5 text-[10px]">
                    {img.manufacturer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {current ? "Update medicine" : "Save medicine"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
