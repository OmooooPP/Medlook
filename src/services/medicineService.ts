import { supabase, MEDICINE_BUCKET } from "./supabaseClient";
import type {
  Medicine,
  MedicineFilter,
  MedicineImage,
  MedicineUpsert,
} from "@/types/medicine";

export function getReadableErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof error === "string" && error.trim()) return error;
  return "Unknown Supabase error";
}

function fail(step: string, error: unknown): never {
  throw new Error(`${step}: ${getReadableErrorMessage(error)}`);
}

export async function searchMedicines(query: string): Promise<Medicine[]> {
  const q = query.trim();
  let req = supabase
    .from("medicines")
    .select("*, images:medicine_images(*)")
    .order("name");
  if (q.length > 0) {
    req = req.or(
      `name.ilike.%${q}%,generic_name.ilike.%${q}%,code.ilike.%${q}%`,
    );
  }
  const { data, error } = await req.limit(50);
  if (error) {
    console.error("Search Query Error: ", error);
    fail("Search failed", error);
  }
  return (data ?? []) as Medicine[];
}

export async function getMedicineByCode(
  code: string,
): Promise<Medicine | null> {
  const { data, error } = await supabase
    .from("medicines")
    .select("*, images:medicine_images(*)")
    .eq("code", code)
    .maybeSingle();
  if (error) {
    console.error("Scan Query Error: ", error);
    fail("Lookup failed", error);
  }
  return (data as Medicine) ?? null;
}

export async function filterMedicines(
  filter: MedicineFilter,
): Promise<Medicine[]> {
  let req = supabase
    .from("medicines")
    .select("*, images:medicine_images(*)")
    .order("name");

  // Sanitize colors: must be a non-empty array of non-empty strings
  const colors = Array.isArray(filter.colors)
    ? filter.colors.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    : [];
  if (colors.length > 0) {
    // text[] column — use overlaps so any selected color matches
    req = req.overlaps("colors", colors);
  }
  if (filter.shape && filter.shape.trim()) req = req.eq("shape", filter.shape.trim());
  if (filter.scoring) req = req.eq("scoring", filter.scoring);
  if (filter.labels && filter.labels.trim().length > 0) {
    req = req.ilike("labels", `%${filter.labels.trim()}%`);
  }
  const { data, error } = await req.limit(100);
  if (error) {
    console.error("Identify Query Error: ", error);
    fail("Identify query failed", error);
  }
  return (data ?? []) as Medicine[];
}

export async function upsertMedicine(
  payload: MedicineUpsert,
  userId: string,
): Promise<Medicine> {
  const { id, ...rest } = payload;
  const row: Record<string, unknown> = { ...rest };

  const request = id
    ? supabase.from("medicines").update(row).eq("id", id)
    : supabase.from("medicines").insert({ ...row, created_by: userId });

  const { data, error } = await request
    .select("*, images:medicine_images(*)")
    .single();
  if (error) fail(id ? "Failed to update medicine" : "Failed to create medicine", error);
  return data as Medicine;
}


export async function uploadMedicineImage(
  medicineId: string,
  file: File,
  manufacturer: string | null,
): Promise<MedicineImage> {
  const ext = (file.name.split(".").pop() ?? "jpg").replace(/[^a-z0-9]/gi, "");
  const path = `${medicineId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(MEDICINE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });
  if (upErr) fail(`Image upload failed for ${file.name}`, upErr);

  const { data } = supabase.storage.from(MEDICINE_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) {
    await supabase.storage.from(MEDICINE_BUCKET).remove([path]);
    throw new Error(`Image upload failed for ${file.name}: public URL was not returned`);
  }

  const { data: image, error: insErr } = await supabase
    .from("medicine_images")
    .insert({
      medicine_id: medicineId,
      image_url: data.publicUrl,
      manufacturer,
    })
    .select()
    .single();
  if (insErr) {
    await supabase.storage.from(MEDICINE_BUCKET).remove([path]);
    fail(`Image metadata save failed for ${file.name}`, insErr);
  }
  return image as MedicineImage;
}

export async function deleteMedicineImage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from("medicine_images")
    .delete()
    .eq("id", imageId);
  if (error) fail("Image delete failed", error);
}
