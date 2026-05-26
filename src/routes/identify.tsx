import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { IdentifyForm } from "@/components/IdentifyForm";
import { useMedicines } from "@/hooks/useMedicines";
import { useAuth } from "@/hooks/useAuth";
import { MedicineCard } from "@/components/MedicineCard";

export const Route = createFileRoute("/identify")({
  component: IdentifyPage,
});

function IdentifyPage() {
  const { results, loading, error, filter, reset } = useMedicines();
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" /> Identify
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Filter by physical characteristics when you can't scan or search.
        </p>
      </section>

      <IdentifyForm
        loading={loading}
        onSubmit={(f) => {
          if (Object.keys(f).length === 0) reset();
          else filter(f);
        }}
      />

      {loading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-4">
        {results.map((m) => (
          <MedicineCard key={m.id} medicine={m} canEdit={!!user} />
        ))}
      </div>
    </div>
  );
}
