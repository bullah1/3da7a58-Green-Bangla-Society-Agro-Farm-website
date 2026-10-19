import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fmtRate, fmtTaka, fmtYears, schemesOf, schemesQuery } from "@/lib/schemes";
import { useSite } from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";

type Mode = "dps" | "fdr";

const field =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-green-dark focus:ring-2 focus:ring-ring/25";

export function SavingsCalculator({ defaultMode = "dps" }: { defaultMode?: Mode }) {
  const { lang } = useLang();
  const site = useSite();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [amount, setAmount] = useState(defaultMode === "dps" ? 2000 : 100000);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const { data: schemeList } = useQuery(schemesQuery);
  const options = schemesOf(schemeList, mode);

  // The rate is fixed by the admin for each term; visitors only choose the term.
  const selected =
    options.find((o) => o.id === pickedId) ?? options.find((o) => o.years === 5) ?? options[0];
  const years = selected?.years ?? 1;
  const rate = selected?.rate ?? 0;
  const belowMin = selected ? amount < selected.min_amount : false;

  const result = useMemo(() => {
    const months = years * 12;
    if (mode === "dps") {
      const r = rate / 100 / 12;
      const fv = r === 0 ? amount * months : amount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const deposited = amount * months;
      return { deposited, profit: fv - deposited, total: fv };
    }
    const total = amount * Math.pow(1 + rate / 100, years);
    return { deposited: amount, profit: total - amount, total };
  }, [mode, amount, years, rate]);

  function switchMode(next: Mode) {
    setMode(next);
    setPickedId(null);
    setAmount(next === "dps" ? 2000 : 100000);
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-card lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="inline-flex rounded-xl bg-secondary p-1">
          {(["dps", "fdr"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                mode === m
                  ? "bg-card text-green-deep shadow-card"
                  : "text-muted-foreground hover:text-green-dark"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-green-deep">
            {tx(lang, "Choose a term", "মেয়াদ বেছে নিন")}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((o) => {
              const on = o.id === selected?.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setPickedId(o.id);
                    if (amount < o.min_amount) setAmount(o.min_amount);
                  }}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-bold transition-colors ${
                    on
                      ? "border-green-dark bg-green-dark text-white"
                      : "border-border bg-card text-green-deep hover:bg-secondary"
                  }`}
                >
                  {fmtYears(o.years, lang)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-green-deep">
            {mode === "dps"
              ? tx(lang, "Monthly deposit (BDT)", "মাসিক জমা (টাকা)")
              : tx(lang, "One-time deposit (BDT)", "এককালীন জমা (টাকা)")}
            <input
              type="number"
              min={selected?.min_amount ?? 0}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              aria-invalid={belowMin}
              className={field}
            />
            {selected && (
              <span
                className={`mt-1 block text-xs font-normal ${belowMin ? "font-semibold text-red-dark" : "text-muted-foreground"}`}
              >
                {tx(lang, "Minimum", "ন্যূনতম")} {fmtTaka(selected.min_amount, lang)}
                {mode === "dps" ? tx(lang, " per month", " প্রতি মাসে") : ""}
              </span>
            )}
          </label>
          <div className="text-sm font-semibold text-green-deep">
            {tx(lang, "Annual profit rate", "বার্ষিক মুনাফার হার")}
            <p className="mt-1 flex items-baseline gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
              <span className="font-display text-xl font-extrabold text-green-dark">
                {fmtRate(rate, lang)}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {tx(lang, `for ${fmtYears(years, lang)}`, `${fmtYears(years, lang)} মেয়াদে`)}
              </span>
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {tx(
            lang,
            "Rates are set by Green Bangla Society. This is an estimate; the final amount is confirmed when you open the scheme.",
            "মুনাফার হার গ্রীন বাংলা সোসাইটি নির্ধারণ করে। এটি একটি আনুমানিক হিসাব; স্কিম খোলার সময় চূড়ান্ত পরিমাণ নিশ্চিত করা হবে।",
          )}
        </p>
      </div>

      <div className="surface-grad rounded-xl border border-border p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
          {tx(lang, "Projected maturity", "মেয়াদ শেষে সম্ভাব্য পরিমাণ")}
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold text-green-deep">
          {fmtTaka(Math.round(result.total), lang)}
        </p>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">{tx(lang, "Total deposit", "মোট জমা")}</dt>
            <dd className="font-bold text-foreground">
              {fmtTaka(Math.round(result.deposited), lang)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">
              {tx(lang, "Estimated profit", "আনুমানিক মুনাফা")}
            </dt>
            <dd className="font-bold text-green-dark">
              {fmtTaka(Math.round(result.profit), lang)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">{tx(lang, "Term", "মেয়াদ")}</dt>
            <dd className="font-bold text-foreground">{fmtYears(years, lang)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{tx(lang, "Profit rate", "মুনাফার হার")}</dt>
            <dd className="font-bold text-foreground">{fmtRate(rate, lang)}</dd>
          </div>
        </dl>
        <a
          href={site.waLink(
            `Hello, I am interested in a ${mode.toUpperCase()} scheme. Amount: ${amount} BDT, Term: ${years} years, Rate: ${rate}%.`,
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-green-dark px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-green-deep"
        >
          {tx(lang, "Discuss on WhatsApp", "হোয়াটসঅ্যাপে আলাপ করুন")}
        </a>
      </div>
    </div>
  );
}
