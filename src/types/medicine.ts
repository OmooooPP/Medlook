export type Scoring = "none" | "single" | "crossing";

export interface MedicineImage {
  id: string;
  medicine_id: string;
  image_url: string;
  manufacturer: string | null;
  created_at: string;
}

export interface Medicine {
  id: string;
  code: string | null;
  name: string;
  generic_name: string | null;
  color: string | null; // legacy single-color (kept for back-compat reads)
  colors: string[] | null;
  shape: string | null;
  labels: string | null;
  scoring: Scoring | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  images?: MedicineImage[];
}

export interface MedicineFilter {
  colors?: string[];
  shape?: string;
  scoring?: Scoring;
  labels?: string;
}

export interface MedicineUpsert {
  id?: string;
  code?: string | null;
  name: string;
  generic_name?: string | null;
  colors?: string[] | null;
  shape?: string | null;
  labels?: string | null;
  scoring?: Scoring | null;
}
