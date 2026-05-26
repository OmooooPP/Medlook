import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { Pill } from "lucide-react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "apple-mobile-web-app-capable", content: "yes" }, // สั่งให้รันแบบไม่มีแถบ URL
        { name: "apple-mobile-web-app-title", content: "MedLook" }, // ชื่อแอปตอนไปอยู่บนหน้าจอโฮม
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { title: "MedLook — Medicine Identification" },
        {
          name: "description",
          content:
            "MedLook: scan, search and identify medicines by physical characteristics.",
        },
        { name: "theme-color", content: "#0b1220" },
        { property: "og:title", content: "MedLook — Medicine Identification" },
        { name: "twitter:title", content: "MedLook — Medicine Identification" },
        { name: "description", content: "Drug Identify which easy to use and searching" },
        { property: "og:description", content: "Drug Identify which easy to use and searching" },
        { name: "twitter:description", content: "Drug Identify which easy to use and searching" },
        { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3a922cb6-c171-4af1-b8d4-f0835c36a5ce/id-preview-eba89aa8--c2cb2676-2482-4202-a20d-a5b1772d3a48.lovable.app-1778932369780.png" },
        { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3a922cb6-c171-4af1-b8d4-f0835c36a5ce/id-preview-eba89aa8--c2cb2676-2482-4202-a20d-a5b1772d3a48.lovable.app-1778932369780.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/x-icon", href: "/pillsnobg.png" } // <--- บรรทัดที่เพิ่มเข้าใหม่
        { rel: "apple-touch-icon", href: "/pillsnobg.png" }
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen pb-24">
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                  <Pill className="h-4 w-4 -rotate-45" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none tracking-tight">
                    MedLook
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Identify · Verify · Manage
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="mx-auto max-w-xl px-4 py-5">
            <Outlet />
          </main>
          <BottomNav />
          <Toaster position="top-center" richColors />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
