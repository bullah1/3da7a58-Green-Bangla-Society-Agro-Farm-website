import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { allSchemesQuery, fmtRate, fmtTaka, type Scheme, type SchemeKind } from "@/lib/schemes";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/manage/schemes")({
  head: () => ({ meta: [{ title: "DPS / FDR rates | Green Bangla Admin" }] }),
  component: SchemesPage,
});

const kinds: { kind: SchemeKind; en: string; bn: string; minEn: string; minBn: string }[] = [
  {
    kind: "dps",
    en: "DPS",
    bn: "ডিপিএস",
    minEn: "Minimum monthly deposit (৳)",
    minBn: "ন্যূনতম মাসিক জমা (৳)",
  },
  { kind: "fdr", en: "FDR", bn: "এফডিআর", minEn: "Minimum deposit (৳)", minBn: "ন্যূনতম জমা (৳)" },
];

function SchemesPage() {
  const { lang } = useLang();
  const { data = [], isLoading, isError, error } = useQuery(allSchemesQuery);

  if (isError) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-red-dark">
        {tx(
          lang,
          "Rates could not be loaded. Check that the database update (schemes table) has been applied.",
          "হার লোড করা যায়নি। ডাটাবেসে schemes টেবিল যোগ করা হয়েছে কিনা দেখে নিন।",
        )}{" "}
        <span className="text-muted-foreground">({(error as Error)?.message})</span>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {tx(
          lang,
          "Changes here update the DPS and FDR pages and the savings calculator straight away. Turn a term off to hide it without deleting it.",
          "এখানে পরিবর্তন করলে ডিপিএস ও এফডিআর পাতা এবং সঞ্চয় ক্যালকুলেটর সাথে সাথে আপডেট হবে। কোনো মেয়াদ মুছে না ফেলে লুকাতে চাইলে ‘চালু’ বন্ধ করে দিন।",
        )}
      </p>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{tx(lang, "Loading…", "লোড হচ্ছে…")}</p>
      ) : (
        kinds.map((k) => (
          <KindTable key={k.kind} meta={k} rows={data.filter((s) => s.kind === k.kind)} />
        ))
      )}
    </div>
  );
}

type Draft = {
  years: string;
  rate: string;
  min_amount: string;
  active: boolean;
  sort_order: string;
};

const toDraft = (s: Scheme): Draft => ({
  years: String(s.years),
  rate: String(s.rate),
  min_amount: String(s.min_amount),
  active: s.active,
  sort_order: String(s.sort_order),
});

function parse(d: Draft, lang: "bn" | "en") {
  const years = Math.round(Number(d.years));
  const rate = Number(d.rate);
  const min_amount = Number(d.min_amount);
  if (!Number.isFinite(years) || years < 1 || years > 30)
    throw new Error(tx(lang, "Term must be 1–30 years.", "মেয়াদ ১ থেকে ৩০ বছরের মধ্যে হতে হবে।"));
  if (!Number.isFinite(rate) || rate < 0 || rate > 50)
    throw new Error(tx(lang, "Rate must be 0–50%.", "হার ০ থেকে ৫০% এর মধ্যে হতে হবে।"));
  if (!Number.isFinite(min_amount) || min_amount < 0)
    throw new Error(
      tx(lang, "Minimum amount can't be negative.", "ন্যূনতম পরিমাণ ঋণাত্মক হতে পারে না।"),
    );
  return {
    years,
    rate,
    min_amount,
    active: d.active,
    sort_order: Math.round(Number(d.sort_order)) || 0,
  };
}

function friendly(message: string, lang: "bn" | "en") {
  if (message.includes("duplicate key"))
    return tx(
      lang,
      "That term already exists for this scheme.",
      "এই স্কিমে এই মেয়াদ আগে থেকেই আছে।",
    );
  return message;
}

const cell =
  "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground";

function KindTable({ meta, rows }: { meta: (typeof kinds)[number]; rows: Scheme[] }) {
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState<Draft | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["schemes"] });

  async function add() {
    if (!adding) return;
    setErr(null);
    try {
      const row = parse(adding, lang);
      setBusy(true);
      const { error } = await supabase.from("schemes").insert({ ...row, kind: meta.kind });
      if (error) throw error;
      setAdding(null);
      await refresh();
    } catch (e) {
      setErr(friendly((e as Error).message, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-xl font-bold text-green-deep">{tx(lang, meta.en, meta.bn)}</h2>
        <button
          type="button"
          onClick={() => {
            const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
            setAdding({
              years: "",
              rate: "",
              min_amount: rows[0] ? String(rows[0].min_amount) : "0",
              active: true,
              sort_order: String(maxOrder + 1),
            });
            setErr(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-dark px-3 py-2 text-xs font-bold text-white hover:bg-green-deep"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          {tx(lang, "Add term", "মেয়াদ যোগ করুন")}
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-bold">{tx(lang, "Term (years)", "মেয়াদ (বছর)")}</th>
              <th className="px-2 py-3 font-bold">
                {tx(lang, "Annual profit rate (%)", "বার্ষিক মুনাফার হার (%)")}
              </th>
              <th className="px-2 py-3 font-bold">{tx(lang, meta.minEn, meta.minBn)}</th>
              <th className="px-2 py-3 font-bold">{tx(lang, "Order", "ক্রম")}</th>
              <th className="px-2 py-3 font-bold">{tx(lang, "Shown", "চালু")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <SchemeRow key={s.id} scheme={s} onChanged={refresh} />
            ))}
            {adding && (
              <tr className="border-t border-border bg-secondary/60">
                <td className="px-5 py-3">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    autoFocus
                    value={adding.years}
                    onChange={(e) => setAdding({ ...adding, years: e.target.value })}
                    className={cell}
                    aria-label={tx(lang, "Term (years)", "মেয়াদ (বছর)")}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step="0.1"
                    value={adding.rate}
                    onChange={(e) => setAdding({ ...adding, rate: e.target.value })}
                    className={cell}
                    aria-label={tx(lang, "Rate", "হার")}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="number"
                    min={0}
                    step="100"
                    value={adding.min_amount}
                    onChange={(e) => setAdding({ ...adding, min_amount: e.target.value })}
                    className={cell}
                    aria-label={tx(lang, meta.minEn, meta.minBn)}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="number"
                    value={adding.sort_order}
                    onChange={(e) => setAdding({ ...adding, sort_order: e.target.value })}
                    className={`${cell} w-20`}
                    aria-label={tx(lang, "Order", "ক্রম")}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="checkbox"
                    checked={adding.active}
                    onChange={(e) => setAdding({ ...adding, active: e.target.checked })}
                    className="size-4 accent-[var(--green-dark)]"
                    aria-label={tx(lang, "Shown", "চালু")}
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void add()}
                      className="rounded-lg bg-green-dark px-3 py-2 text-xs font-bold text-white hover:bg-green-deep disabled:opacity-60"
                    >
                      {tx(lang, "Save", "সেভ")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdding(null)}
                      className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground"
                    >
                      {tx(lang, "Cancel", "বাতিল")}
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && !adding && (
        <p className="px-5 pb-5 text-sm text-muted-foreground">
          {tx(
            lang,
            "No terms yet. Add one to show it on the website.",
            "এখনো কোনো মেয়াদ নেই। ওয়েবসাইটে দেখাতে একটি যোগ করুন।",
          )}
        </p>
      )}
      {err && <p className="px-5 pb-4 text-xs font-semibold text-red-dark">{err}</p>}
    </section>
  );
}

function SchemeRow({ scheme, onChanged }: { scheme: Scheme; onChanged: () => Promise<unknown> }) {
  const { lang } = useLang();
  const [d, setD] = useState<Draft>(toDraft(scheme));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const original = toDraft(scheme);
  const dirty = (Object.keys(d) as (keyof Draft)[]).some(
    (k) => String(d[k]) !== String(original[k]),
  );

  async function save(next = d) {
    setErr(null);
    setSaved(false);
    try {
      const row = parse(next, lang);
      setBusy(true);
      const { error } = await supabase.from("schemes").update(row).eq("id", scheme.id);
      if (error) throw error;
      await onChanged();
      setSaved(true);
    } catch (e) {
      setErr(friendly((e as Error).message, lang));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(tx(lang, "Delete this term?", "এই মেয়াদটি ডিলিট করবেন?"))) return;
    setBusy(true);
    const { error } = await supabase.from("schemes").delete().eq("id", scheme.id);
    setBusy(false);
    if (error) setErr(error.message);
    else await onChanged();
  }

  return (
    <>
      <tr className={`border-t border-border ${scheme.active ? "" : "opacity-60"}`}>
        <td className="px-5 py-3">
          <input
            type="number"
            min={1}
            max={30}
            value={d.years}
            onChange={(e) => setD({ ...d, years: e.target.value })}
            className={cell}
            aria-label={tx(lang, "Term (years)", "মেয়াদ (বছর)")}
          />
        </td>
        <td className="px-2 py-3">
          <input
            type="number"
            min={0}
            max={50}
            step="0.1"
            value={d.rate}
            onChange={(e) => setD({ ...d, rate: e.target.value })}
            className={cell}
            aria-label={tx(lang, "Rate", "হার")}
          />
        </td>
        <td className="px-2 py-3">
          <input
            type="number"
            min={0}
            step="100"
            value={d.min_amount}
            onChange={(e) => setD({ ...d, min_amount: e.target.value })}
            className={cell}
            aria-label={tx(lang, "Minimum", "ন্যূনতম")}
          />
        </td>
        <td className="px-2 py-3">
          <input
            type="number"
            value={d.sort_order}
            onChange={(e) => setD({ ...d, sort_order: e.target.value })}
            className={`${cell} w-20`}
            aria-label={tx(lang, "Order", "ক্রম")}
          />
        </td>
        <td className="px-2 py-3">
          <input
            type="checkbox"
            checked={d.active}
            disabled={busy}
            onChange={(e) => {
              const next = { ...d, active: e.target.checked };
              setD(next);
              void save(next);
            }}
            className="size-4 accent-[var(--green-dark)]"
            aria-label={tx(lang, "Shown on website", "ওয়েবসাইটে দেখাবে")}
          />
        </td>
        <td className="px-5 py-3">
          <div className="flex items-center justify-end gap-2">
            {dirty ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save()}
                  className="rounded-lg bg-green-dark px-3 py-2 text-xs font-bold text-white hover:bg-green-deep disabled:opacity-60"
                >
                  {tx(lang, "Save", "সেভ")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setD(original);
                    setErr(null);
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground"
                >
                  {tx(lang, "Undo", "আগের মতো")}
                </button>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                {saved
                  ? tx(lang, "Saved", "সেভ হয়েছে")
                  : `${fmtRate(scheme.rate, lang)} · ${fmtTaka(scheme.min_amount, lang)}`}
              </span>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove()}
              aria-label={tx(lang, "Delete term", "মেয়াদ ডিলিট করুন")}
              className="rounded-lg p-2 text-red-dark hover:bg-red/5 disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>
      {err && (
        <tr>
          <td colSpan={6} className="px-5 pb-3 text-xs font-semibold text-red-dark">
            {err}
          </td>
        </tr>
      )}
    </>
  );
}
