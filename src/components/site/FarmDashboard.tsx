import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { tx, useLang } from "@/lib/i18n";

type FarmStats = {
  updatedAt: string;
  stats: { label: string; value: string; pct: number }[];
  capacity: { label: string; pct: number }[];
  monthlyProduction: { month: string; crop: number; livestock: number; poultry: number }[];
};

const fallback: FarmStats = {
  updatedAt: "",
  stats: [
    { label: "Total land under cultivation", value: "42 acres", pct: 84 },
    { label: "Cattle & goats (livestock)", value: "260 heads", pct: 62 },
    { label: "Poultry birds", value: "12,500 birds", pct: 92 },
    { label: "Fish ponds (water area)", value: "9 acres", pct: 45 },
    { label: "Nursery saplings", value: "38,000 plants", pct: 74 },
    { label: "Direct employment", value: "120 people", pct: 55 },
  ],
  capacity: [
    { label: "Crop", pct: 78 },
    { label: "Livestock", pct: 64 },
    { label: "Poultry", pct: 88 },
    { label: "Fishery", pct: 52 },
    { label: "Nursery", pct: 70 },
  ],
  monthlyProduction: [],
};

const labelMap: Record<string, { en: string; bn: string }> = {
  "Total land under cultivation": { en: "Total land under cultivation", bn: "মোট আবাদি জমি" },
  "42 acres": { en: "42 acres", bn: "৪২ একর" },
  "Cattle & goats (livestock)": {
    en: "Cattle & goats (livestock)",
    bn: "গবাদি পশু ও ছাগল (লাইভস্টক)",
  },
  "260 heads": { en: "260 heads", bn: "২৬০টি" },
  "Poultry birds": { en: "Poultry birds", bn: "হাঁস-মুরগি" },
  "12,500 birds": { en: "12,500 birds", bn: "১২,৫০০টি" },
  "Fish ponds (water area)": { en: "Fish ponds (water area)", bn: "মাছের পুকুর (জলাশয়)" },
  "9 acres": { en: "9 acres", bn: "৯ একর" },
  "Nursery saplings": { en: "Nursery saplings", bn: "নার্সারি চারা" },
  "38,000 plants": { en: "38,000 plants", bn: "৩৮,০০০টি গাছ" },
  "Direct employment": { en: "Direct employment", bn: "সরাসরি কর্মসংস্থান" },
  "120 people": { en: "120 people", bn: "১২০ জন" },
  Crop: { en: "Crop", bn: "শস্য" },
  Livestock: { en: "Livestock", bn: "গবাদি পশু" },
  Poultry: { en: "Poultry", bn: "হাঁস-মুরগি" },
  Fishery: { en: "Fishery", bn: "মৎস্য" },
  Nursery: { en: "Nursery", bn: "নার্সারি" },
};

function tVal(lang: "en" | "bn", val: string) {
  const m = labelMap[val];
  if (m) return lang === "en" ? m.en : m.bn;
  return val;
}

async function loadStats(): Promise<FarmStats> {
  const res = await fetch("/farm-stats.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load farm stats");
  return res.json();
}

const monthBn: Record<string, string> = {
  Jan: "জানুয়ারি",
  Feb: "ফেব্রুয়ারি",
  Mar: "মার্চ",
  Apr: "এপ্রিল",
  May: "মে",
  Jun: "জুন",
  Jul: "জুলাই",
  Aug: "আগস্ট",
  Sep: "সেপ্টেম্বর",
  Oct: "অক্টোবর",
  Nov: "নভেম্বর",
  Dec: "ডিসেম্বর",
};

const series = [
  { key: "crop" as const, en_name: "Crop", bn_name: "শস্য", color: "#008e4c" },
  { key: "livestock" as const, en_name: "Livestock", bn_name: "গবাদি পশু", color: "#1d6fd1" },
  { key: "poultry" as const, en_name: "Poultry", bn_name: "হাঁস-মুরগি", color: "#c21118" },
];

export function TrendLegend() {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => (
        <span
          key={s.key}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
        >
          <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} />
          {tx(lang, s.en_name, s.bn_name)}
        </span>
      ))}
    </div>
  );
}

function toBnNum(n: number) {
  return n.toLocaleString("bn-BD");
}

function useWidth<T extends HTMLElement>() {
  // Callback ref: starts observing whenever the element actually mounts.
  const [el, setEl] = useState<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!el) return;
    setWidth(Math.round(el.getBoundingClientRect().width));
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return [setEl, width] as const;
}

function TrendChart({ data }: { data: FarmStats["monthlyProduction"] }) {
  const { lang } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  const [wrapRef, measured] = useWidth<HTMLDivElement>();
  if (data.length === 0) return null;
  const W = Math.max(280, measured || 640);

  const compact = W < 520;
  const H = compact ? 220 : 260;
  const m = { top: 14, right: compact ? 62 : 112, bottom: 30, left: 38 };
  const innerW = W - m.left - m.right;
  const innerH = H - m.top - m.bottom;

  // Zoom the y-axis to the data, rounded down to the nearest 10, capped at 100.
  const all = data.flatMap((d) => series.map((s) => d[s.key]));
  const yMin = Math.max(0, Math.floor((Math.min(...all) - 5) / 10) * 10);
  const yMax = 100;
  const ticks: number[] = [];
  const step = yMax - yMin > 50 ? 20 : 10;
  for (let t = yMin; t <= yMax; t += step) ticks.push(t);

  const x = (i: number) => m.left + (i * innerW) / Math.max(data.length - 1, 1);
  const y = (v: number) => m.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const num = (v: number) => (lang === "bn" ? toBnNum(v) : String(v));
  const pct = (v: number) => `${num(v)}%`;
  const monthLabel = (mo: string) => (lang === "bn" ? (monthBn[mo] ?? mo) : mo);
  const name = (s: (typeof series)[number]) => tx(lang, s.en_name, s.bn_name);

  // End-of-line labels, nudged apart so they never overlap.
  const last = data[data.length - 1]!;
  const ends = series
    .map((s) => ({ s, v: last[s.key], ty: y(last[s.key]) }))
    .sort((a, b) => a.ty - b.ty);
  for (let i = 1; i < ends.length; i++) {
    const prev = ends[i - 1]!;
    const cur = ends[i]!;
    if (cur.ty - prev.ty < 16) cur.ty = prev.ty + 16;
  }

  const colW = innerW / Math.max(data.length - 1, 1);
  const active = hover !== null ? data[hover] : null;
  const tipLeft = hover !== null ? x(hover) : 0;
  const tipFlip = hover !== null && tipLeft > W - 200;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className={`block max-w-full touch-pan-y outline-none ${measured ? "" : "invisible"}`}
        role="img"
        aria-label={tx(lang, "Monthly production trend", "মাসিক উৎপাদন প্রবণতা")}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight")
            setHover((h) => (h === null ? 0 : Math.min(data.length - 1, h + 1)));
          if (e.key === "ArrowLeft")
            setHover((h) => (h === null ? data.length - 1 : Math.max(0, h - 1)));
          if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => setHover(null)}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={W - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray={t === yMin ? undefined : "2 4"}
            />
            <text
              x={m.left - 8}
              y={y(t) + 4}
              fontSize="11"
              textAnchor="end"
              fill="var(--muted-text)"
            >
              {pct(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) =>
          compact && i % 2 === 1 && hover !== i ? null : (
            <text
              key={d.month}
              x={x(i)}
              y={H - 8}
              fontSize="11"
              textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
              fill={hover === i ? "var(--text)" : "var(--muted-text)"}
              fontWeight={hover === i ? 700 : 400}
            >
              {monthLabel(d.month)}
            </text>
          ),
        )}

        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={m.top}
            y2={m.top + innerH}
            stroke="var(--muted-text)"
            strokeWidth="1"
            opacity="0.45"
          />
        )}

        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")}
          />
        ))}

        {series.map((s) =>
          data.map((d, i) => (
            <circle
              key={`${s.key}-${d.month}`}
              cx={x(i)}
              cy={y(d[s.key])}
              r={hover === i ? 5 : i === data.length - 1 ? 3.5 : 0}
              fill={s.color}
              stroke="#fff"
              strokeWidth="2"
              className="pointer-events-none"
            />
          )),
        )}

        {ends.map(({ s, v, ty }) => (
          <g key={`end-${s.key}`}>
            <text x={W - m.right + 10} y={ty + 4} fontSize="12" fontWeight="700" fill="var(--text)">
              {pct(v)}
            </text>
            {!compact && (
              <text x={W - m.right + 46} y={ty + 4} fontSize="11" fill="var(--muted-text)">
                {name(s)}
              </text>
            )}
          </g>
        ))}

        {/* One full-height hit column per month: easy to hover or tap. */}
        {data.map((d, i) => (
          <rect
            key={`hit-${d.month}`}
            x={x(i) - colW / 2}
            y={m.top}
            width={colW}
            height={innerH}
            fill="transparent"
            className="cursor-crosshair"
            onMouseEnter={() => setHover(i)}
            onClick={() => setHover(hover === i ? null : i)}
          />
        ))}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 min-w-36 rounded-lg border border-border bg-card px-3 py-2 shadow-card"
          style={{
            top: m.top,
            left: tipFlip ? undefined : tipLeft + 12,
            right: tipFlip ? W - tipLeft + 12 : undefined,
          }}
        >
          <p className="mb-1.5 text-xs font-bold text-foreground">{monthLabel(active.month)}</p>
          <ul className="space-y-1">
            {[...series]
              .sort((a, b) => active[b.key] - active[a.key])
              .map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                    {name(s)}
                  </span>
                  <span className="font-bold text-foreground">{pct(active[s.key])}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <details className="mt-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-green-dark">
          {tx(lang, "Show as table", "টেবিল আকারে দেখুন")}
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-1.5 pr-3 font-semibold">{tx(lang, "Month", "মাস")}</th>
                {series.map((s) => (
                  <th key={s.key} className="py-1.5 pr-3 text-right font-semibold">
                    {name(s)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.month} className="border-b border-border/60">
                  <td className="py-1.5 pr-3">{monthLabel(d.month)}</td>
                  {series.map((s) => (
                    <td key={s.key} className="py-1.5 pr-3 text-right text-foreground">
                      {pct(d[s.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function FarmDashboard() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["farm-stats"],
    queryFn: loadStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const stats = data ?? fallback;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold text-muted-foreground">{tVal(lang, s.label)}</p>
              <p className="mt-1.5 font-display text-2xl font-extrabold text-green-deep">
                {tVal(lang, s.value)}
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="brand-grad h-full rounded-full" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-base font-bold text-green-deep">
            {tx(lang, "Capacity utilisation by unit", "ইউনিট ভিত্তিক সক্ষমতা ব্যবহার")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {tx(lang, "Current season, share of full capacity", "চলতি মৌসুম, পূর্ণ সক্ষমতার অংশ")}
          </p>
          <div className="mt-6 flex h-56 items-stretch gap-4">
            {stats.capacity.map((p) => (
              <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-green-deep">{p.pct}%</span>
                <div className="flex w-full flex-1 items-end rounded-t-lg bg-secondary">
                  <div
                    className="brand-grad w-full rounded-t-lg transition-all"
                    style={{ height: `${p.pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {tVal(lang, p.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-green-deep">
              {tx(lang, "Production trend (last 6 months)", "উৎপাদন প্রবণতা (গত ৬ মাস)")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {tx(lang, "Production rate (%)", "উৎপাদনের হার (%)")}
            </p>
          </div>
          {stats.updatedAt && (
            <p className="text-[11px] font-semibold text-muted-foreground">
              {tx(lang, "Last updated", "সর্বশেষ আপডেট")}:{" "}
              {new Date(stats.updatedAt).toLocaleDateString(lang === "en" ? "en-GB" : "bn-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="mt-4">
          <TrendLegend />
        </div>
        <div className="mt-3">
          <TrendChart data={stats.monthlyProduction} />
        </div>
      </div>
    </div>
  );
}
