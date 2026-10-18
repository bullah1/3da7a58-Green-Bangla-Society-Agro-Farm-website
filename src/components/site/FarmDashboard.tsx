import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  "Cattle & goats (livestock)": { en: "Cattle & goats (livestock)", bn: "গবাদি পশু ও ছাগল (লাইভস্টক)" },
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
  { key: "crop" as const, en_name: "Crop", bn_name: "শস্য", color: "#15803d" },
  { key: "livestock" as const, en_name: "Livestock", bn_name: "গবাদি পশু", color: "#b45309" },
  { key: "poultry" as const, en_name: "Poultry", bn_name: "হাঁস-মুরগি", color: "#b91c1c" },
];

export function TrendLegend() {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap gap-4">
      {series.map((s) => (
        <span
          key={s.key}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
          {tx(lang, s.en_name, s.bn_name)}
        </span>
      ))}
    </div>
  );
}

function toBnNum(n: number) {
  return n.toLocaleString("bn-BD");
}

function TrendChart({ data }: { data: FarmStats["monthlyProduction"] }) {
  const { lang } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  if (data.length === 0) return null;
  const W = 620;
  const H = 220;
  const pad = 32;
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(data.length - 1, 1);
  const y = (v: number) => H - pad - (v / 100) * (H - pad * 2);
  const monthLabel = (m: string) => (lang === "bn" ? (monthBn[m] ?? m) : m);
  const fmt = (v: number) => `${lang === "bn" ? toBnNum(v) : v}%`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-56 w-full"
        role="img"
        aria-label={tx(lang, "Monthly production trend", "মাসিক উৎপাদন প্রবণতা")}
      >
        {[25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line
              x1={pad}
              x2={W - pad}
              y1={y(g)}
              y2={y(g)}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            <text
              x={4}
              y={y(g) + 4}
              fontSize="10"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {lang === "bn" ? toBnNum(g) : g}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")}
          />
        ))}
        {/* Data points with hover/tap targets */}
        {series.map((s) =>
          data.map((d, i) => (
            <g key={`${s.key}-${d.month}`}>
              <circle
                cx={x(i)}
                cy={y(d[s.key])}
                r={hover === i ? 5 : 3.5}
                fill={s.color}
                stroke="#fff"
                strokeWidth="1.5"
                className="pointer-events-none transition-all"
              />
              {/* Larger invisible hit area for hover / tap */}
              <circle
                cx={x(i)}
                cy={y(d[s.key])}
                r={14}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover(hover === i ? null : i)}
              >
                <title>{`${tx(lang, s.en_name, s.bn_name)}: ${fmt(d[s.key])}`}</title>
              </circle>
            </g>
          )),
        )}
        {/* Last-point value labels */}
        {series.map((s) => {
          const last = data[data.length - 1]!;
          return (
            <text
              key={`label-${s.key}`}
              x={x(data.length - 1) + 8}
              y={y(last[s.key]) + 4}
              fontSize="11"
              fontWeight="700"
              fill={s.color}
            >
              {fmt(last[s.key])}
            </text>
          );
        })}
        {/* Hover guideline */}
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={pad - 6}
            y2={H - pad}
            stroke="currentColor"
            className="text-muted-foreground"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        )}
        {data.map((d, i) => (
          <text
            key={d.month}
            x={x(i)}
            y={H - 8}
            fontSize="10"
            textAnchor="middle"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {monthLabel(d.month)}
          </text>
        ))}
      </svg>
      {/* Tooltip */}
      {hover !== null && (
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 shadow-card">
          <p className="mb-1 text-[11px] font-bold text-green-deep">
            {monthLabel(data[hover]!.month)}
          </p>
          <div className="flex gap-3">
            {series.map((s) => (
              <span key={s.key} className="flex items-center gap-1 text-[11px] font-semibold">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{tx(lang, s.en_name, s.bn_name)}:</span>
                <span style={{ color: s.color }}>{fmt(data[hover]![s.key])}</span>
              </span>
            ))}
          </div>
        </div>
      )}
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
          <TrendLegend />
          {stats.updatedAt && (
            <p className="text-[11px] font-semibold text-muted-foreground">
              {tx(lang, "Last updated", "সর্বশেষ আপডেট")}:{" "}
              {new Date(stats.updatedAt).toLocaleString(lang === "en" ? "en-GB" : "bn-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>
        <div className="mt-4">
          <TrendChart data={stats.monthlyProduction} />
        </div>
      </div>
    </div>
  );
}
