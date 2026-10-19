import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ImageUp, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroFarm from "@/assets/hero-farm.jpg";
import agroFarm from "@/assets/agro-farm.jpg";
import {
  defaultSettings,
  fetchSettings,
  settingKeys,
  toBnDigits,
  type SiteSettings,
} from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/manage/settings")({
  head: () => ({ meta: [{ title: "Site settings | Green Bangla Admin" }] }),
  component: SettingsPage,
});

const input =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground";

function pick(site: SiteSettings): SiteSettings {
  const out = { ...defaultSettings };
  for (const k of settingKeys) out[k] = site[k];
  return out;
}

function SettingsPage() {
  const { lang } = useLang();
  // Always load the saved values fresh before showing the form, so saving never
  // overwrites real settings with the built-in defaults.
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["site-settings", "admin"],
    queryFn: fetchSettings,
    staleTime: 0,
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">{tx(lang, "Loading…", "লোড হচ্ছে…")}</p>;
  if (isError)
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-red-dark">
        {tx(
          lang,
          "Settings could not be loaded. Check that the database update (site_settings table) has been applied.",
          "সেটিং লোড করা যায়নি। ডাটাবেসে site_settings টেবিল যোগ করা হয়েছে কিনা দেখে নিন।",
        )}{" "}
        <span className="text-muted-foreground">({(error as Error)?.message})</span>
      </p>
    );
  return <SettingsForm saved={pick(data)} />;
}

function SettingsForm({ saved }: { saved: SiteSettings }) {
  const { lang } = useLang();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState<SiteSettings>(saved);
  const [draft, setDraft] = useState<SiteSettings>(saved);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = settingKeys.some((k) => draft[k] !== current[k]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const set = (k: keyof SiteSettings) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    setSaving(true);
    setMsg(null);
    const data: Record<string, string> = {};
    for (const k of settingKeys) data[k] = draft[k].trim();
    const { error } = await supabase.from("site_settings").upsert({ id: 1, data });
    setSaving(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    const next = { ...draft };
    setCurrent(next);
    queryClient.setQueryData(["site-settings"], next);
    queryClient.setQueryData(["site-settings", "admin"], next);
    await queryClient.invalidateQueries({ queryKey: ["site-settings"], exact: true });
    await router.invalidate();
    setMsg({
      ok: true,
      text: tx(
        lang,
        "Saved. The website now shows these details.",
        "সেভ হয়েছে। ওয়েবসাইটে এখন এই তথ্য দেখাবে।",
      ),
    });
  }

  return (
    <div className="space-y-6 pb-24">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {tx(
          lang,
          "Change contact details, the home page banner and numbers, and page photos. Empty boxes use the original text.",
          "যোগাযোগের তথ্য, হোম পেজের ব্যানার ও সংখ্যা এবং পাতার ছবি এখান থেকে বদলান। কোনো ঘর খালি রাখলে আগের লেখাটাই দেখাবে।",
        )}
      </p>

      <Group title={tx(lang, "Contact details", "যোগাযোগের তথ্য")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={tx(lang, "Phone", "ফোন")}
            value={draft.phone}
            onChange={set("phone")}
            type="tel"
          />
          <Field
            label={tx(lang, "Second phone", "দ্বিতীয় ফোন")}
            value={draft.phone2}
            onChange={set("phone2")}
            type="tel"
          />
          <Field
            label="WhatsApp"
            hint={tx(
              lang,
              "Customers' messages go to this number",
              "গ্রাহকদের সব মেসেজ এই নম্বরে যাবে",
            )}
            value={draft.whatsapp}
            onChange={set("whatsapp")}
            type="tel"
          />
          <Field label="Facebook" value={draft.facebook} onChange={set("facebook")} type="url" />
          <Field
            label={tx(lang, "Email", "ইমেইল")}
            hint={tx(lang, "Applications are emailed here", "আবেদন এই ইমেইলে যাবে")}
            value={draft.email}
            onChange={set("email")}
            type="email"
          />
          <Field
            label={tx(lang, "Second email", "দ্বিতীয় ইমেইল")}
            value={draft.email2}
            onChange={set("email2")}
            type="email"
          />
          <Field
            label={tx(lang, "Address", "ঠিকানা")}
            value={draft.address}
            onChange={set("address")}
          />
          <Field
            label={tx(lang, "Website", "ওয়েবসাইট")}
            value={draft.domain}
            onChange={set("domain")}
          />
        </div>
      </Group>

      <Group title={tx(lang, "Home page banner", "হোম পেজের ব্যানার")}>
        <ImageField
          label={tx(lang, "Banner photo", "ব্যানারের ছবি")}
          hint={tx(
            lang,
            "Wide landscape photo, at least 1600 × 900",
            "চওড়া (আড়াআড়ি) ছবি, কমপক্ষে ১৬০০ × ৯০০",
          )}
          value={draft.hero_image}
          fallback={heroFarm}
          slot="hero"
          onChange={set("hero_image")}
        />
        <div className="mt-5 space-y-4">
          <Pair
            label={tx(lang, "Small line above the title", "শিরোনামের উপরের ছোট লাইন")}
            bn={draft.hero_tag_bn}
            en={draft.hero_tag_en}
            onBn={set("hero_tag_bn")}
            onEn={set("hero_tag_en")}
          />
          <Pair
            label={tx(lang, "Title — first line", "শিরোনাম — প্রথম লাইন")}
            bn={draft.hero_title1_bn}
            en={draft.hero_title1_en}
            onBn={set("hero_title1_bn")}
            onEn={set("hero_title1_en")}
          />
          <Pair
            label={tx(lang, "Title — second line", "শিরোনাম — দ্বিতীয় লাইন")}
            bn={draft.hero_title2_bn}
            en={draft.hero_title2_en}
            onBn={set("hero_title2_bn")}
            onEn={set("hero_title2_en")}
          />
          <Pair
            label={tx(lang, "Description", "বিবরণ")}
            bn={draft.hero_text_bn}
            en={draft.hero_text_en}
            onBn={set("hero_text_bn")}
            onEn={set("hero_text_en")}
            multiline
          />
        </div>
      </Group>

      <Group title={tx(lang, "Home page numbers", "হোম পেজের সংখ্যা")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label={tx(lang, "Years of service", "বছরের অভিজ্ঞতা")}
            value={draft.stat_years}
            onChange={set("stat_years")}
            hint={`${tx(lang, "Shows as", "দেখাবে")}: ${toBnDigits(draft.stat_years || defaultSettings.stat_years)}`}
          />
          <Field
            label={tx(lang, "Active members", "সক্রিয় সদস্য")}
            value={draft.stat_members}
            onChange={set("stat_members")}
            hint={`${tx(lang, "Shows as", "দেখাবে")}: ${toBnDigits(draft.stat_members || defaultSettings.stat_members)}`}
          />
          <Field
            label={tx(lang, "Farm land (acres)", "খামারের জমি (একর)")}
            value={draft.stat_land}
            onChange={set("stat_land")}
            hint={`${tx(lang, "Shows as", "দেখাবে")}: ${toBnDigits(draft.stat_land || defaultSettings.stat_land)} একর`}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {tx(
            lang,
            "Type numbers in English digits (e.g. 9,500+); the Bangla site converts them automatically.",
            "সংখ্যা ইংরেজি অঙ্কে লিখুন (যেমন 9,500+), বাংলা সাইটে নিজে থেকেই বাংলা অঙ্কে দেখাবে।",
          )}
        </p>
      </Group>

      <Group title={tx(lang, "Other page photos", "অন্যান্য পাতার ছবি")}>
        <div className="grid gap-6 lg:grid-cols-2">
          <ImageField
            label={tx(lang, "Agro Farm page photo", "অ্যাগ্রো ফার্ম পাতার ছবি")}
            value={draft.agro_image}
            fallback={agroFarm}
            slot="agro"
            onChange={set("agro_image")}
          />
          <ImageField
            label={tx(lang, "About page photo", "আমাদের সম্পর্কে পাতার ছবি")}
            value={draft.about_image}
            fallback={agroFarm}
            slot="about"
            onChange={set("about_image")}
          />
        </div>
      </Group>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p
            role="status"
            aria-live="polite"
            className={`text-sm font-semibold ${msg ? (msg.ok ? "text-green-dark" : "text-red-dark") : "text-muted-foreground"}`}
          >
            {msg?.text ??
              (dirty
                ? tx(lang, "You have unsaved changes.", "পরিবর্তন এখনো সেভ হয়নি।")
                : tx(lang, "All changes saved.", "সব পরিবর্তন সেভ করা আছে।"))}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button
                type="button"
                onClick={() => {
                  setDraft(current);
                  setMsg(null);
                }}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-secondary"
              >
                {tx(lang, "Discard", "বাতিল")}
              </button>
            )}
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => void save()}
              className="rounded-lg bg-green-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-green-deep disabled:opacity-50"
            >
              {saving
                ? tx(lang, "Saving…", "সেভ হচ্ছে…")
                : tx(lang, "Save changes", "পরিবর্তন সেভ করুন")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-bold text-green-deep">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-xs font-bold text-muted-foreground">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={input}
      />
      {hint && <span className="mt-1 block font-normal">{hint}</span>}
    </label>
  );
}

function Pair({
  label,
  bn,
  en,
  onBn,
  onEn,
  multiline,
}: {
  label: string;
  bn: string;
  en: string;
  onBn: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
}) {
  const Box = (props: {
    value: string;
    onChange: (v: string) => void;
    lang: string;
    tag: string;
  }) =>
    multiline ? (
      <textarea
        rows={4}
        lang={props.lang}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        aria-label={`${label} (${props.tag})`}
        className={input}
      />
    ) : (
      <input
        lang={props.lang}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        aria-label={`${label} (${props.tag})`}
        className={input}
      />
    );
  return (
    <fieldset>
      <legend className="text-xs font-bold text-muted-foreground">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="mt-1 block text-[11px] font-semibold text-green-dark">বাংলা</span>
          {Box({ value: bn, onChange: onBn, lang: "bn", tag: "বাংলা" })}
        </div>
        <div>
          <span className="mt-1 block text-[11px] font-semibold text-green-dark">English</span>
          {Box({ value: en, onChange: onEn, lang: "en", tag: "English" })}
        </div>
      </div>
    </fieldset>
  );
}

const MAX_MB = 5;

function ImageField({
  label,
  hint,
  value,
  fallback,
  slot,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  fallback: string;
  slot: string;
  onChange: (v: string) => void;
}) {
  const { lang } = useLang();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr(tx(lang, "Please choose an image file.", "একটি ছবির ফাইল বেছে নিন।"));
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(
        tx(
          lang,
          `Image must be under ${MAX_MB} MB.`,
          `ছবি ${toBnDigits(String(MAX_MB))} MB-এর কম হতে হবে।`,
        ),
      );
      return;
    }
    setBusy(true);
    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${slot}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onChange(supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl);
  }

  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 overflow-hidden rounded-xl border border-border bg-secondary">
        <img src={value || fallback} alt="" className="aspect-[16/7] w-full object-cover" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-dark px-3 py-2 text-xs font-bold text-white hover:bg-green-deep has-[:disabled]:opacity-60">
          <ImageUp className="size-3.5" aria-hidden="true" />
          {busy
            ? tx(lang, "Uploading…", "আপলোড হচ্ছে…")
            : tx(lang, "Upload new photo", "নতুন ছবি আপলোড")}
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void upload(f);
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {tx(lang, "Use original photo", "আগের ছবিতে ফেরত যান")}
          </button>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {err && <p className="mt-1 text-xs font-semibold text-red-dark">{err}</p>}
    </div>
  );
}
