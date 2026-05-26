import { COLOR_OPTIONS, colorHex } from "@/constants/medicine";
import { Check } from "lucide-react";

interface PickerProps {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  size?: "sm" | "md";
}

export function ColorSwatchPicker({
  value,
  onChange,
  max,
  size = "md",
}: PickerProps) {
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const toggle = (name: string) => {
    const has = value.includes(name);
    if (has) return onChange(value.filter((c) => c !== name));
    if (max && value.length >= max) {
      // replace oldest to respect cap
      return onChange([...value.slice(1), name]);
    }
    onChange([...value, name]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((c) => {
        const active = value.includes(c.name);
        const isClear = c.hex === "transparent";
        return (
          <button
            key={c.name}
            type="button"
            title={c.name}
            aria-label={c.name}
            aria-pressed={active}
            onClick={() => toggle(c.name)}
            className={`relative ${dim} rounded-full transition-transform ${
              active
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                : "ring-1 ring-border hover:scale-105"
            }`}
            style={{
              background: isClear
                ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 8px 8px"
                : c.hex,
            }}
          >
            {active && (
              <Check
                className={`absolute inset-0 m-auto ${
                  size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
                } ${
                  /white|yellow|cream|light|mint|peach|tan|lavender|sky|clear|gold/i.test(c.name)
                    ? "text-slate-900"
                    : "text-white"
                }`}
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface DisplayProps {
  colors: unknown;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function normalizeColors(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.filter((c): c is string => typeof c === "string" && c.length > 0);
  }
  if (typeof input === "string" && input.trim().length > 0) {
    // legacy: could be "Red" or "Red, Blue" or JSON-ish
    const trimmed = input.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return normalizeColors(parsed);
      } catch {
        /* fallthrough */
      }
    }
    return trimmed
      .split(/[,/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function ColorSwatchDisplay({
  colors,
  size = "sm",
  showLabel,
}: DisplayProps) {
  const list = normalizeColors(colors);
  if (list.length === 0) {
    return <span className="text-sm text-muted-foreground">No colors assigned</span>;
  }
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {list.map((name) => {
        const hex = colorHex(name);
        const isClear = hex === "transparent";
        return (
          <span
            key={name}
            title={name}
            aria-label={name}
            className={`${dim} rounded-full ring-1 ring-border shadow-sm`}
            style={{
              background: isClear
                ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 6px 6px"
                : hex,
            }}
          />
        );
      })}
      {showLabel && (
        <span className="text-xs text-muted-foreground ml-1">
          {list.join(" / ")}
        </span>
      )}
    </div>
  );
}
