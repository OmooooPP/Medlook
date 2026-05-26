import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useMedicines } from "@/hooks/useMedicines";
import { useAuth } from "@/hooks/useAuth";
import { MedicineCard } from "@/components/MedicineCard";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  const { results, loading, error, search } = useMedicines();
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    search(q);
  };

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" /> Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find medicines by name or code.
        </p>
      </section>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Amoxicillin or NDC code"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && results.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No results yet. Try a search.
        </p>
      )}

      <div className="space-y-4">
        {results.map((m) => (
          <MedicineCard key={m.id} medicine={m} canEdit={!!user} />
        ))}
      </div>
    </div>
  );
}
