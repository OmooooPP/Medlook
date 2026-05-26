export interface ColorOption {
  name: string;
  hex: string;
  ring?: boolean; // show subtle border for very light swatches
}

export const COLOR_OPTIONS: readonly ColorOption[] = [
  { name: "White", hex: "#ffffff", ring: true },
  { name: "Cream", hex: "#fef3c7", ring: true },
  { name: "Light Yellow", hex: "#fef08a" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Gold", hex: "#eab308" },
  { name: "Light Orange", hex: "#fed7aa" },
  { name: "Orange", hex: "#fb923c" },
  { name: "Peach", hex: "#fdba74" },
  { name: "Light Pink", hex: "#fbcfe8" },
  { name: "Pink", hex: "#f472b6" },
  { name: "Hot Pink", hex: "#ec4899" },
  { name: "Light Red", hex: "#fca5a5" },
  { name: "Red", hex: "#ef4444" },
  { name: "Dark Red", hex: "#991b1b" },
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Tan", hex: "#d2b48c" },
  { name: "Brown", hex: "#92400e" },
  { name: "Dark Brown", hex: "#451a03" },
  { name: "Light Green", hex: "#bbf7d0" },
  { name: "Mint", hex: "#86efac" },
  { name: "Green", hex: "#22c55e" },
  { name: "Dark Green", hex: "#15803d" },
  { name: "Olive", hex: "#65a30d" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Cyan", hex: "#22d3ee" },
  { name: "Light Blue", hex: "#bfdbfe" },
  { name: "Sky Blue", hex: "#7dd3fc" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Dark Blue", hex: "#1e3a8a" },
  { name: "Navy", hex: "#1e293b" },
  { name: "Lavender", hex: "#ddd6fe" },
  { name: "Light Purple", hex: "#c4b5fd" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Dark Purple", hex: "#6b21a8" },
  { name: "Magenta", hex: "#d946ef" },
  { name: "Light Gray", hex: "#e5e7eb" },
  { name: "Gray", hex: "#9ca3af" },
  { name: "Dark Gray", hex: "#4b5563" },
  { name: "Black", hex: "#0f172a" },
  { name: "Clear", hex: "transparent", ring: true },
] as const;

export const COLORS = COLOR_OPTIONS.map((c) => c.name);

export const colorHex = (name: string): string =>
  COLOR_OPTIONS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hex ??
  "#6b7280";

export const SHAPES = [
  "Round",
  "Oval",
  "Capsule",
  "Oblong",
  "Triangle",
  "Square",
  "Rectangle",
  "Diamond",
  "Pentagon",
  "Hexagon",
  "Heart",
] as const;

export const SCORINGS = [
  { value: "none", label: "None" },
  { value: "single", label: "Single line" },
  { value: "crossing", label: "Crossing (cross)" },
] as const;
