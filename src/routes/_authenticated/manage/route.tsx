import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, LogOut, Package, Percent } from "lucide-react";
import { Page } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { applicationsQuery } from "@/lib/applications";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/manage")({
  head: () => ({
    meta: [
      { title: "Admin | Green Bangla" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { lang } = useLang();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: apps } = useQuery(applicationsQuery);
  const newCount = apps?.filter((a) => a.status === "new").length ?? 0;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const tabs = [
    { to: "/manage" as const, exact: true, icon: Package, en: "Products", bn: "পণ্য", badge: 0 },
    {
      to: "/manage/applications" as const,
      exact: false,
      icon: ClipboardList,
      en: "Applications",
      bn: "আবেদন",
      badge: newCount,
    },
    { to: "/manage/schemes" as const, exact: false, icon: Percent, en: "DPS / FDR rates", bn: "ডিপিএস / এফডিআর হার", badge: 0 },
  ];

  return (
    <Page>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-green-dark">
                <span className="red-dot" aria-hidden="true" />
                {tx(lang, "Owner area", "মালিকের এলাকা")}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-green-deep sm:text-3xl">
                {tx(lang, "Admin panel", "অ্যাডমিন প্যানেল")}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{user.email}</span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-bold text-green-deep hover:bg-secondary"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                {tx(lang, "Sign out", "সাইন আউট")}
              </button>
            </div>
          </div>

          <nav
            aria-label={tx(lang, "Admin sections", "অ্যাডমিন বিভাগ")}
            className="-mb-px mt-6 flex gap-1 overflow-x-auto"
          >
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.exact }}
                activeProps={{ className: "border-green-dark text-green-deep" }}
                inactiveProps={{ className: "border-transparent text-muted-foreground hover:text-green-deep" }}
                className="inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition-colors"
              >
                <t.icon className="size-4" aria-hidden="true" />
                {tx(lang, t.en, t.bn)}
                {t.badge > 0 && (
                  <span className="rounded-full bg-red px-1.5 py-0.5 text-[11px] leading-none text-white">
                    {lang === "bn" ? t.badge.toLocaleString("bn-BD") : t.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Outlet />
      </div>
    </Page>
  );
}
