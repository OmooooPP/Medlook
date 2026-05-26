import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, LogOut } from "lucide-react";

export function AuthPanel() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (user) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="text-sm">
          <p className="font-medium">Signed in</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "in") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setInfo("Check your email to confirm your account.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="flex gap-1 rounded-lg bg-muted p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("in")}
          className={`flex-1 rounded-md px-3 py-1.5 ${mode === "in" ? "bg-card shadow" : "text-muted-foreground"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("up")}
          className={`flex-1 rounded-md px-3 py-1.5 ${mode === "up" ? "bg-card shadow" : "text-muted-foreground"}`}
        >
          Register
        </button>
      </div>
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {info && <p className="text-sm text-primary">{info}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {mode === "in" ? (
          <LogIn className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {mode === "in" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
