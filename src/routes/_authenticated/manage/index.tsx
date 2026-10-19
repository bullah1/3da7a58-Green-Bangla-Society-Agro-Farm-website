import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { imageSrc, productsQuery, type Product } from "@/lib/products";
import { bdt } from "@/lib/site";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/manage/")({
  head: () => ({
    meta: [
      { title: "Manage Agro Shop Products | Green Bangla" },
      {
        name: "description",
        content:
          "Owner tools to add products, update prices, change stock status and upload photos for the Green Bangla Agro Shop.",
      },
      { property: "og:title", content: "Manage Green Bangla Agro Shop" },
      {
        property: "og:description",
        content: "Update prices, stock and product photos for the Agro Shop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ManagePage,
});

type Draft = {
  id?: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  available: boolean;
  image: string | null;
  description: string;
  sort_order: string;
};

const emptyDraft: Draft = {
  name: "",
  category: "Grocery",
  price: "0",
  unit: "per kg",
  available: true,
  image: null,
  description: "",
  sort_order: "0",
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: String(p.price),
    unit: p.unit,
    available: p.available,
    image: p.image,
    description: p.description ?? "",
    sort_order: String(p.sort_order),
  };
}

function ManagePage() {
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery(productsQuery);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  async function uploadPhoto(file: File) {
    setBusy(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: err } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type || "image/jpeg" });
      if (err) throw err;
      setDraft((d) => (d ? { ...d, image: `storage:${path}` } : d));
      setNotice(
        tx(lang, "Photo uploaded. Remember to save.", "ছবি আপলোড হয়েছে। সংরক্ষণ করতে ভুলবেন না।"),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : tx(lang, "Photo upload failed.", "ছবি আপলোড ব্যর্থ হয়েছে।"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const row = {
        name: draft.name.trim(),
        category: draft.category.trim() || "Grocery",
        price: Number(draft.price) || 0,
        unit: draft.unit.trim() || "per kg",
        available: draft.available,
        image: draft.image,
        description: draft.description.trim() || null,
        sort_order: Number(draft.sort_order) || 0,
      };
      if (!row.name) throw new Error(tx(lang, "Product name is required.", "পণ্যের নাম প্রয়োজন।"));

      if (draft.id) {
        const { error: err } = await supabase.from("products").update(row).eq("id", draft.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("products").insert(row);
        if (err) throw err;
      }
      await refresh();
      setDraft(null);
      setNotice(
        tx(
          lang,
          "Saved. Your shop page is updated.",
          "সংরক্ষিত হয়েছে। আপনার শপ পেজ আপডেট করা হয়েছে।",
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : tx(lang, "Could not save the product.", "পণ্যটি সংরক্ষণ করা যায়নি।"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: Product) {
    if (
      !window.confirm(
        tx(lang, `Delete “${p.name}” from the shop?`, `শপ থেকে “${p.name}” ডিলিট করবেন?`),
      )
    )
      return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("products").delete().eq("id", p.id);
    if (err) setError(err.message);
    else {
      await refresh();
      setNotice(tx(lang, "Product deleted.", "পণ্য ডিলিট করা হয়েছে।"));
    }
    setBusy(false);
  }

  async function toggleStock(p: Product) {
    setBusy(true);
    const { error: err } = await supabase
      .from("products")
      .update({ available: !p.available })
      .eq("id", p.id);
    if (err) setError(err.message);
    else await refresh();
    setBusy(false);
  }

  return (
    <>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDraft({ ...emptyDraft, sort_order: String(data.length + 1) });
              setNotice(null);
              setError(null);
            }}
            className="rounded-lg bg-green-dark px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-green-deep"
          >
            {tx(lang, "+ Add product", "+ পণ্য যোগ করুন")}
          </button>
          {error ? <span className="text-sm font-semibold text-red-dark">{error}</span> : null}
          {notice ? <span className="text-sm font-semibold text-green-dark">{notice}</span> : null}
        </div>

        {draft ? (
          <Card className="mt-5">
            <div className="mt-0 grid gap-4 sm:grid-cols-2">
              <Field label={tx(lang, "Product name", "পণ্যের নাম")}>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={tx(lang, "Category", "ক্যাটেগরি")}>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={tx(lang, "Price (৳)", "দাম (৳)")}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={tx(lang, "Unit (e.g. per kg)", "ইউনিট (যেমন: কেজি প্রতি)")}>
                <input
                  value={draft.unit}
                  onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={tx(lang, "Display order", "প্রদর্শনের ক্রম")}>
                <input
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={tx(lang, "Stock", "স্টক")}>
                <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={draft.available}
                    onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                    className="h-4 w-4 accent-[var(--green-dark)]"
                  />
                  {tx(lang, "In stock", "স্টকে আছে")}
                </label>
              </Field>
              <div className="sm:col-span-2">
                <Field label={tx(lang, "Description", "বিবরণ")}>
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={tx(lang, "Photo", "ছবি")}>
                  <div className="mt-1.5 flex flex-wrap items-center gap-4">
                    {imageSrc(draft.image) ? (
                      <img
                        src={imageSrc(draft.image) as string}
                        alt={draft.name || tx(lang, "Product photo", "পণ্যের ছবি")}
                        className="h-20 w-20 rounded-xl border border-border object-cover"
                      />
                    ) : (
                      <span className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-border text-[11px] text-muted-foreground">
                        {tx(lang, "No photo", "ছবি নেই")}
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadPhoto(file);
                      }}
                      className="text-sm"
                    />
                  </div>
                </Field>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void save()}
                className="rounded-lg bg-green-dark px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-green-deep disabled:opacity-60"
              >
                {busy
                  ? tx(lang, "Saving…", "সংরক্ষণ করা হচ্ছে…")
                  : tx(lang, "Save product", "পণ্য সংরক্ষণ করুন")}
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground"
              >
                {tx(lang, "Cancel", "বাতিল")}
              </button>
            </div>
          </Card>
        ) : null}

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {tx(lang, "Loading products…", "পণ্য লোড হচ্ছে…")}
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {data.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                {imageSrc(p.image) ? (
                  <img
                    src={imageSrc(p.image) as string}
                    alt={p.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <span className="h-16 w-16 rounded-xl border border-dashed border-border" />
                )}
                <div className="min-w-[180px] flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-dark">
                    {p.category}
                  </p>
                  <p className="text-sm font-bold text-green-deep">{p.name}</p>
                  <p className="text-sm font-semibold text-foreground">
                    ৳ {bdt(p.price)} <span className="text-xs text-muted-foreground">{p.unit}</span>
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void toggleStock(p)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold ${
                    p.available
                      ? "border-green-dark text-green-dark"
                      : "border-red-dark text-red-dark"
                  }`}
                >
                  {p.available
                    ? tx(lang, "In stock", "স্টকে আছে")
                    : tx(lang, "Out of stock", "স্টক শেষ")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(toDraft(p));
                    setNotice(null);
                    setError(null);
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-green-deep"
                >
                  {tx(lang, "Edit", "এডিট")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(p)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-red-dark"
                >
                  {tx(lang, "Delete", "ডিলিট")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground";

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
