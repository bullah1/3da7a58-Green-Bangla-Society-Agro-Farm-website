import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fmtRate, fmtYears, schemesOf, schemesQuery } from "@/lib/schemes";
import { bdt, waLink } from "@/lib/site";
import { tx, useLang } from "@/lib/i18n";

type Mode = "dps" | "fdr";

const field =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-green-dark focus:ring-2 focus:ring-ring/25";

export function SavingsCalculator({ defaultMode = "dps" }: { defaultMode?: Mode }) {
  const { lang } = useLang();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [amount, setAmount] = useState(mode === "dps" ? 2000 : 100000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(mode === "dps" ? 9 : 10);
  const [touched, setTouched] = useState(false);
  const { data: schemeList } = useQuery(schemesQuery);
  const options = schemesOf(schemeList, mode);
  const rateMax = Math.max(15, ...options.map((o) => Math.ceil(o.rate)));

  // Start from the published rate for the chosen term until the visitor changes it.
  useEffect(() => {
    if (touched || options.length === 0) return;
    const match = options.find((o) => o.years === years) ?? options[0]!;
    setYears(match.years);
    setRate(match.rate);
    if (amount < match.min_amount) setAmount(match.min_amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemeList, mode]);

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
    setTouched(false);
    setAmount(next === "dps" ? 2000 : 100000);
    setRate(next === "dps" ? 9 : 10);
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

        {options.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-muted-foreground">
              {tx(lang, "Our current terms", "আমাদের বর্তমান মেয়াদ")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((o) => {
                const on = o.years === years && o.rate === rate;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setTouched(true);
                      setYears(o.years);
                      setRate(o.rate);
                      if (amount < o.min_amount) setAmount(o.min_amount);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      on
                        ? "border-green-dark bg-green-dark text-white"
                        : "border-border bg-card text-green-deep hover:bg-secondary"
                    }`}
                  >
                    {fmtYears(o.years, lang)} — {fmtRate(o.rate, lang)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-green-deep">
            {mode === "dps"
              ? tx(lang, "Monthly deposit (BDT)", "মাসিক জমা (টাকা)")
              : tx(lang, "One-time deposit (BDT)", "এককালীন জমা (টাকা)")}
            <input
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              className={field}
            />
          </label>
          <label className="block text-sm font-semibold text-green-deep">
            {tx(lang, "Term (years)", "মেয়াদ (বছর)")}
            <input
              type="number"
              min={1}
              max={30}
              value={years}
              onChange={(e) => {
                setTouched(true);
                setYears(Math.min(30, Math.max(1, Number(e.target.value) || 1)));
              }}
              className={field}
            />
          </label>
          <label className="block text-sm font-semibold text-green-deep sm:col-span-2">
            {tx(lang, "Expected annual profit rate", "প্রত্যাশিত বার্ষিক মুনাফার হার")}: {rate}%
            <input
              type="range"
              min={Math.min(4, ...options.map((o) => Math.floor(o.rate)))}
              max={rateMax}
              step={0.25}
              value={rate}
              onChange={(e) => {
                setTouched(true);
                setRate(Number(e.target.value));
              }}
              className="mt-3 w-full accent-[var(--green)]"
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {tx(
            lang,
            "Indicative projection only. Final profit rate is confirmed at the time of opening the scheme.",
            "এটি শুধুমাত্র একটি আনুমানিক হিসাব। স্কিম খোলার সময় চূড়ান্ত মুনাফার হার নিশ্চিত করা হবে।",
          )}
        </p>
      </div>

      <div className="surface-grad rounded-xl border border-border p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
          {tx(lang, "Projected maturity", "মেয়াদ শেষে সম্ভাব্য পরিমাণ")}
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold text-green-deep">
          ৳ {bdt(Math.round(result.total))}
        </p>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">{tx(lang, "Total deposit", "মোট জমা")}</dt>
            <dd className="font-bold text-foreground">৳ {bdt(Math.round(result.deposited))}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted-foreground">{tx(lang, "Estimated profit", "আনুমানিক মুনাফা")}</dt>
            <dd className="font-bold text-green-dark">৳ {bdt(Math.round(result.profit))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{tx(lang, "Term", "মেয়াদ")}</dt>
            <dd className="font-bold text-foreground">
              {years} {tx(lang, "years", "বছর")}
            </dd>
          </div>
        </dl>
        <a
          href={waLink(
            `Hello, I am interested in a ${mode.toUpperCase()} scheme. Amount: ${amount} BDT, Term: ${years} years.`,
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
