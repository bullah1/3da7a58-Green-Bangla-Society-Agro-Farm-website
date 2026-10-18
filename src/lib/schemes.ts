import { supabase } from "@/integrations/supabase/client";

export type SchemeKind = "dps" | "fdr";

export type Scheme = {
  id: string;
  kind: SchemeKind;
  years: number;
  rate: number;
  min_amount: number;
  active: boolean;
  sort_order: number;
};

/** Shown if the database cannot be reached, so the pages never go blank. */
export const fallbackSchemes: Scheme[] = [
  { id: "d3", kind: "dps", years: 3, rate: 8, min_amount: 500, active: true, sort_order: 1 },
  { id: "d5", kind: "dps", years: 5, rate: 9, min_amount: 1000, active: true, sort_order: 2 },
  { id: "d10", kind: "dps", years: 10, rate: 10, min_amount: 1000, active: true, sort_order: 3 },
  { id: "f1", kind: "fdr", years: 1, rate: 9, min_amount: 25000, active: true, sort_order: 1 },
  { id: "f2", kind: "fdr", years: 2, rate: 9.5, min_amount: 25000, active: true, sort_order: 2 },
  { id: "f3", kind: "fdr", years: 3, rate: 10, min_amount: 25000, active: true, sort_order: 3 },
  { id: "f5", kind: "fdr", years: 5, rate: 11, min_amount: 25000, active: true, sort_order: 4 },
];

const select = "id, kind, years, rate, min_amount, active, sort_order";

function normalise(rows: unknown[]): Scheme[] {
  return (rows as Scheme[]).map((r) => ({
    ...r,
    rate: Number(r.rate),
    min_amount: Number(r.min_amount),
  }));
}

/** Public: active schemes only (RLS also enforces this). */
export const schemesQuery = {
  queryKey: ["schemes", "public"],
  queryFn: async (): Promise<Scheme[]> => {
    const { data, error } = await supabase
      .from("schemes")
      .select(select)
      .eq("active", true)
      .order("kind")
      .order("sort_order")
      .order("years");
    if (error) throw error;
    const rows = normalise(data ?? []);
    return rows.length ? rows : fallbackSchemes;
  },
  staleTime: 60 * 1000,
};

/** Admin: every scheme, including inactive ones. */
export const allSchemesQuery = {
  queryKey: ["schemes", "all"],
  queryFn: async (): Promise<Scheme[]> => {
    const { data, error } = await supabase
      .from("schemes")
      .select(select)
      .order("kind")
      .order("sort_order")
      .order("years");
    if (error) throw error;
    return normalise(data ?? []);
  },
};

export function schemesOf(list: Scheme[] | undefined, kind: SchemeKind) {
  return (list ?? fallbackSchemes).filter((s) => s.kind === kind && s.active);
}

export function fmtRate(rate: number, lang: "bn" | "en") {
  // Show exactly what the admin entered (up to 2 decimals), never rounded.
  const v = Math.round(rate * 100) / 100;
  return `${v.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { maximumFractionDigits: 2 })}%`;
}

export function fmtYears(years: number, lang: "bn" | "en") {
  if (lang === "bn") return `${years.toLocaleString("bn-BD")} বছর`;
  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

export function fmtTaka(n: number, lang: "bn" | "en") {
  return `৳${n.toLocaleString(lang === "bn" ? "bn-BD" : "en-IN", { maximumFractionDigits: 0 })}`;
}
