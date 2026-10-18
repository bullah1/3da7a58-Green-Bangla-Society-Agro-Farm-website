import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, MessageCircle, PhoneCall, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  applicationsQuery,
  statuses,
  type Application,
  type ApplicationStatus,
} from "@/lib/applications";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/manage/applications")({
  head: () => ({ meta: [{ title: "Applications | Green Bangla Admin" }] }),
  component: ApplicationsPage,
});

const serviceBn: Record<string, string> = {
  "Loan / Investment": "ঋণ / বিনিয়োগ",
  "DPS Scheme": "ডিপিএস স্কিম",
  "FDR Scheme": "এফডিআর স্কিম",
  "Savings Account": "সঞ্চয়ী হিসাব",
  "Agro Shop Order": "অ্যাগ্রো শপ অর্ডার",
  "General Enquiry": "সাধারণ জিজ্ঞাসা",
};

/** Bangladeshi mobile numbers → wa.me format (8801XXXXXXXXX). */
function waNumber(phone: string) {
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const ascii = phone.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
  const digits = ascii.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

function toCsv(rows: Application[]) {
  const cols: (keyof Application)[] = [
    "created_at",
    "name",
    "phone",
    "email",
    "address",
    "service",
    "amount",
    "message",
    "status",
    "admin_note",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
}

function ApplicationsPage() {
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const { data = [], isLoading, isError, error } = useQuery(applicationsQuery);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data.length };
    for (const s of statuses) c[s.value] = data.filter((a) => a.status === s.value).length;
    return c;
  }, [data]);

  const shown = data.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (!q.trim()) return true;
    const needle = q.trim().toLowerCase();
    return [a.name, a.phone, a.email, a.service, a.message]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(needle));
  });

  const n = (v: number) => (lang === "bn" ? v.toLocaleString("bn-BD") : String(v));

  function downloadCsv() {
    // BOM so Excel opens Bangla text correctly.
    const blob = new Blob(["﻿" + toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-red-dark">
        {tx(
          lang,
          "Applications could not be loaded. Check that the database update (applications table) has been applied.",
          "আবেদনগুলো লোড করা যায়নি। ডাটাবেসে applications টেবিল যোগ করা হয়েছে কিনা দেখে নিন।",
        )}{" "}
        <span className="text-muted-foreground">({(error as Error)?.message})</span>
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[{ value: "all" as const, en: "All", bn: "সব" }, ...statuses].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              aria-pressed={filter === s.value}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filter === s.value
                  ? "border-green-dark bg-green-dark text-white"
                  : "border-border bg-card text-muted-foreground hover:text-green-deep"
              }`}
            >
              {tx(lang, s.en, s.bn)} · {n(counts[s.value] ?? 0)}
            </button>
          ))}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <label className="relative flex-1 sm:w-64">
            <span className="sr-only">{tx(lang, "Search", "খুঁজুন")}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tx(lang, "Name or phone", "নাম বা মোবাইল নম্বর")}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={shown.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-green-deep hover:bg-secondary disabled:opacity-50"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Excel (CSV)
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {tx(lang, "Loading applications…", "আবেদন লোড হচ্ছে…")}
        </p>
      ) : shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm font-bold text-green-deep">
            {data.length === 0
              ? tx(lang, "No applications yet", "এখনো কোনো আবেদন আসেনি")
              : tx(lang, "Nothing matches this filter", "এই ফিল্টারে কোনো আবেদন নেই")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.length === 0
              ? tx(
                  lang,
                  "Applications sent from the website form will appear here.",
                  "ওয়েবসাইটের আবেদন ফর্ম থেকে পাঠানো আবেদন এখানে দেখা যাবে।",
                )
              : tx(lang, "Try another status or clear the search.", "অন্য স্ট্যাটাস বেছে নিন বা খোঁজা মুছে দিন।")}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {shown.map((a) => (
            <ApplicationRow
              key={a.id}
              app={a}
              onChanged={() => queryClient.invalidateQueries({ queryKey: ["applications"] })}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ApplicationRow({ app, onChanged }: { app: Application; onChanged: () => void }) {
  const { lang } = useLang();
  const [note, setNote] = useState(app.admin_note ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const status = statuses.find((s) => s.value === app.status) ?? statuses[0]!;

  async function update(patch: { status?: ApplicationStatus; admin_note?: string | null }) {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("applications").update(patch).eq("id", app.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onChanged();
  }

  async function remove() {
    if (
      !window.confirm(
        tx(lang, `Delete the application from ${app.name}?`, `${app.name}-এর আবেদনটি ডিলিট করবেন?`),
      )
    )
      return;
    setBusy(true);
    const { error } = await supabase.from("applications").delete().eq("id", app.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onChanged();
  }

  const date = new Date(app.created_at).toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const service = lang === "bn" ? (serviceBn[app.service] ?? app.service) : app.service;
  const noteChanged = note.trim() !== (app.admin_note ?? "").trim();

  return (
    <li
      className={`rounded-2xl border bg-card p-5 ${app.status === "new" ? "border-red/40" : "border-border"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-green-deep">{app.name}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${status.tone}`}>
              {tx(lang, status.en, status.bn)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {service}
            {app.amount ? ` — ${tx(lang, "Amount", "পরিমাণ")}: ৳${app.amount}` : ""}
            {"  ·  "}
            {date}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${app.phone.replace(/[^+\d০-৯]/g, "")}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-green-deep hover:bg-secondary"
          >
            <PhoneCall className="size-3.5" aria-hidden="true" />
            {app.phone}
          </a>
          <a
            href={`https://wa.me/${waNumber(app.phone)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-dark px-3 py-1.5 text-xs font-bold text-white hover:bg-green-deep"
          >
            <MessageCircle className="size-3.5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>

      {(app.message || app.address || app.email) && (
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[7rem_1fr]">
          {app.message && (
            <>
              <dt className="text-xs font-bold text-muted-foreground">{tx(lang, "Message", "বার্তা")}</dt>
              <dd className="whitespace-pre-line text-foreground">{app.message}</dd>
            </>
          )}
          {app.address && (
            <>
              <dt className="text-xs font-bold text-muted-foreground">{tx(lang, "Address", "ঠিকানা")}</dt>
              <dd className="text-foreground">{app.address}</dd>
            </>
          )}
          {app.email && (
            <>
              <dt className="text-xs font-bold text-muted-foreground">{tx(lang, "Email", "ইমেইল")}</dt>
              <dd>
                <a href={`mailto:${app.email}`} className="text-green-dark hover:underline">
                  {app.email}
                </a>
              </dd>
            </>
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <label className="text-xs font-bold text-muted-foreground">
          {tx(lang, "Status", "স্ট্যাটাস")}
          <select
            value={app.status}
            disabled={busy}
            onChange={(e) => void update({ status: e.target.value as ApplicationStatus })}
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {tx(lang, s.en, s.bn)}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[14rem] flex-1 text-xs font-bold text-muted-foreground">
          {tx(lang, "Office note (only you see this)", "অফিস নোট (শুধু আপনি দেখবেন)")}
          <input
            value={note}
            maxLength={2000}
            onChange={(e) => setNote(e.target.value)}
            placeholder={tx(lang, "e.g. Called on Monday, visiting office", "যেমন: সোমবার কল করা হয়েছে, অফিসে আসবেন")}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal text-foreground"
          />
        </label>
        {noteChanged && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void update({ admin_note: note.trim() || null })}
            className="rounded-lg bg-green-dark px-3 py-2 text-xs font-bold text-white hover:bg-green-deep disabled:opacity-60"
          >
            {tx(lang, "Save note", "নোট সেভ করুন")}
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          aria-label={tx(lang, "Delete application", "আবেদন ডিলিট করুন")}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-red-dark hover:bg-red/5 disabled:opacity-60"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {tx(lang, "Delete", "ডিলিট")}
        </button>
      </div>
      {err && <p className="mt-2 text-xs font-semibold text-red-dark">{err}</p>}
    </li>
  );
}
