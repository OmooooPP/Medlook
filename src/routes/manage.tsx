import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthPanel } from "@/components/AuthPanel";
import { UploadForm } from "@/components/UploadForm";
import { useMedicines } from "@/hooks/useMedicines";
import type { Medicine } from "@/types/medicine";

export const Route = createFileRoute("/manage")({
  component: ManagePage,
});

function ManagePage() {
  const { user } = useAuth();
  const { results, loading, search } = useMedicines();
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" /> Manage
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add and update medicine details and pictures.
        </p>
      </section>

      <AuthPanel />

      {!user ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Sign in or register to add or update medicines.
        </p>
      ) : editing || creating ? (
        <div className="space-y-3">
          <button
            onClick={() => {
              setEditing(null);
              setCreating(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to list
          </button>
          <UploadForm
            initial={editing}
            onSaved={(m) => {
              setEditing(m);
              setCreating(false);
            }}
          />
        </div>
      ) : (
        <>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New medicine
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(q);
            }}
            className="flex gap-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find medicine to edit"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              Find
            </button>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          <ul className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setEditing(m)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    {m.generic_name && (
                      <p className="text-xs italic text-muted-foreground truncate">
                        {m.generic_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">
                      {m.code ?? "—"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {m.images?.length ?? 0} img
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 && !loading && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                Search above to find a medicine to edit.
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
