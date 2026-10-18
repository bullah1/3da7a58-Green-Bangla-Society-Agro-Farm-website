import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    // Only accounts with the 'admin' role may manage the shop (RLS enforces this too).
    const { data: adminRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    return { user: data.user, isAdmin: !!adminRow };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const { lang } = useLang();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (isAdmin) return <Outlet />;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Owner area", "মালিকের এলাকা")}
        title={tx(lang, "Access not allowed", "প্রবেশাধিকার নেই")}
        description={tx(
          lang,
          "This account is not the shop owner, so it cannot change products.",
          "এই অ্যাকাউন্টটি শপের মালিকের নয়, তাই পণ্য পরিবর্তন করা যাবে না।",
        )}
      />
      <Section>
        <div className="mx-auto max-w-md">
          <Card>
            <p className="text-sm text-muted-foreground">
              {tx(lang, "Signed in as", "সাইন ইন করা আছে")}:{" "}
              <span className="font-bold text-foreground">{user.email}</span>
            </p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-5 w-full rounded-lg bg-green-dark px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-green-deep"
            >
              {tx(lang, "Sign out", "সাইন আউট")}
            </button>
          </Card>
        </div>
      </Section>
    </Page>
  );
}
