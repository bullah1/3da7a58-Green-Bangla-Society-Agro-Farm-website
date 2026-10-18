import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Sign In — Manage Agro Shop | Green Bangla" },
      {
        name: "description",
        content:
          "Private sign-in for the Green Bangla team to update Agro Shop product prices, stock and photos.",
      },
      { property: "og:title", content: "Green Bangla — Owner Sign In" },
      {
        property: "og:description",
        content: "Sign in to manage Green Bangla Agro Shop products.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/manage" },
        });
        if (err) throw err;
        if (data.session) {
          navigate({ to: "/manage" });
        } else {
          setMessage(
            tx(
              lang,
              "Account created. Check your email and confirm it, then sign in.",
              "অ্যাকাউন্ট তৈরি হয়েছে। আপনার ইমেইল চেক করুন এবং নিশ্চিত করুন, তারপর সাইন ইন করুন।",
            ),
          );
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/manage" });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : tx(
              lang,
              "Something went wrong. Please try again.",
              "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
            ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Owner area", "মালিকের এলাকা")}
        title={tx(lang, "Sign in to manage your shop", "আপনার শপ পরিচালনা করতে সাইন ইন করুন")}
        description={tx(
          lang,
          "This page is only for the Green Bangla team. Sign in to change product prices, stock status and photos.",
          "এই পাতাটি শুধুমাত্র গ্রিন বাংলা টিমের জন্য। পণ্যের দাম, স্টকের অবস্থা এবং ছবি পরিবর্তন করতে সাইন ইন করুন।",
        )}
      />
      <Section>
        <div className="mx-auto max-w-md">
          <Card>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {tx(lang, "Email", "ইমেইল")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {tx(lang, "Password", "পাসওয়ার্ড")}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              {error ? <p className="text-sm font-semibold text-red-dark">{error}</p> : null}
              {message ? <p className="text-sm font-semibold text-green-dark">{message}</p> : null}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-green-dark px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-green-deep disabled:opacity-60"
              >
                {busy
                  ? tx(lang, "Please wait…", "অনুগ্রহ করে অপেক্ষা করুন…")
                  : mode === "signin"
                    ? tx(lang, "Sign in", "সাইন ইন করুন")
                    : tx(lang, "Create owner account", "ওনার অ্যাকাউন্ট তৈরি করুন")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setMessage(null);
                }}
                className="w-full text-center text-xs font-bold text-green-dark"
              >
                {mode === "signin"
                  ? tx(lang, "First time? Create the owner account", "প্রথমবার? ওনার অ্যাকাউন্ট তৈরি করুন")
                  : tx(lang, "Already have an account? Sign in", "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন")}
              </button>
            </form>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {tx(
              lang,
              "The first account created becomes the owner and is the only one allowed to change products.",
              "প্রথম তৈরি করা অ্যাকাউন্টটি মালিকের হবে এবং শুধুমাত্র সেটিই পণ্য পরিবর্তনের অনুমতি পাবে।",
            )}
          </p>
        </div>
      </Section>
    </Page>
  );
}
