import { Link, useLocation } from "@tanstack/react-router";
import { ScanLine, Search, SlidersHorizontal, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "Scanner", Icon: ScanLine },
  { to: "/search", label: "Search", Icon: Search },
  { to: "/identify", label: "Identify", Icon: SlidersHorizontal },
  { to: "/manage", label: "Manage", Icon: Settings },
] as const;

export function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <ul className="mx-auto flex max-w-xl items-stretch justify-around">
        {tabs.map(({ to, label, Icon }) => {
          const active = location.pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
