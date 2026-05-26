import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jgzcfzbesfvrgjxtztpe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5PDCqxpx3aXXrYU_3vd6Aw_yjj2uiGb";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export const MEDICINE_BUCKET = "medicine-images";
