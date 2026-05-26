import { useCallback, useState } from "react";
import {
  searchMedicines,
  filterMedicines,
  getMedicineByCode,
} from "@/services/medicineService";
import type { Medicine, MedicineFilter } from "@/types/medicine";

export function useMedicines() {
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = async (fn: () => Promise<Medicine[] | Medicine | null>) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fn();
      if (Array.isArray(r)) setResults(r);
      else if (r) setResults([r]);
      else setResults([]);
    } catch (e) {
      console.error("Identify Query Error: ", e);
      const msg =
        e instanceof Error
          ? e.message
          : e && typeof e === "object" && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Request failed";
      setError(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const search = useCallback((q: string) => wrap(() => searchMedicines(q)), []);
  const filter = useCallback(
    (f: MedicineFilter) => wrap(() => filterMedicines(f)),
    [],
  );
  const byCode = useCallback(
    (code: string) => wrap(() => getMedicineByCode(code)),
    [],
  );
  const reset = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, filter, byCode, reset };
}
