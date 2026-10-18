import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { bdt, orderLink } from "@/lib/site";
import { imageSrc, productsQuery, type Product } from "@/lib/products";
import { tx, useLang } from "@/lib/i18n";

export type { Product };

export function ProductGrid() {
  const { lang } = useLang();
  const { data = [], isLoading, isError } = useQuery(productsQuery);
  const [active, setActive] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const rawCategories = Array.from(new Set(data.map((p) => p.category)));
  const categories = ["All", ...rawCategories];
  
  const shown = data
    .filter((p) => (active === "All" ? true : p.category === active))
    .filter((p) => (availableOnly ? p.available : true));
  const hiddenCount = data.filter(
    (p) => !p.available && (active === "All" || p.category === active),
  ).length;

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl border border-border bg-secondary"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-red-dark">
        {tx(
          lang,
          "Products could not be loaded. Please refresh the page.",
          "পণ্যগুলো লোড করা যায়নি। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।",
        )}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
              active === c
                ? "border-green-dark bg-green-dark text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-green-dark"
            }`}
          >
            {c === "All" ? tx(lang, "All", "সবগুলো") : c}
          </button>
        ))}
      </div>

      <label className="mt-4 flex w-fit cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => setAvailableOnly(e.target.checked)}
          className="h-4 w-4 accent-[var(--green-dark)]"
        />
        {tx(lang, "Show only available products", "শুধুমাত্র সহজলভ্য পণ্যগুলো দেখান")}
        {hiddenCount > 0 && availableOnly ? (
          <span className="text-red-dark">
            ({hiddenCount} {tx(lang, "hidden", "টি লুকানো")})
          </span>
        ) : null}
      </label>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {tx(
            lang,
            "No products to show in this selection right now.",
            "এই মুহূর্তে দেখানোর মতো কোনো পণ্য নেই।",
          )}
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <article
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(p);
                }
              }}
              className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-shadow hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-green-dark"
            >
              <img
                src={imageSrc(p.image) ?? undefined}
                alt={p.name}
                loading="lazy"
                width={800}
                height={600}
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-dark">
                  {p.category}
                </p>
                <h3 className="mt-1.5 text-base font-bold text-green-deep">{p.name}</h3>
                <p className="mt-2 font-display text-xl font-extrabold text-foreground">
                  ৳ {bdt(p.price)}{" "}
                  <span className="text-xs font-semibold text-muted-foreground">{p.unit}</span>
                </p>
                <p
                  className={`mt-2 text-xs font-bold ${
                    p.available ? "text-green-dark" : "text-red-dark"
                  }`}
                >
                  {p.available ? tx(lang, "In stock", "মজুদ আছে") : tx(lang, "Out of stock", "মজুদ নেই")}
                </p>
                <span className="mt-5 inline-flex items-center justify-center rounded-lg border border-green-dark px-4 py-2.5 text-sm font-bold text-green-dark">
                  {tx(lang, "View details", "বিস্তারিত দেখুন")}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card shadow-lift sm:rounded-2xl"
          >
            <div className="relative">
              <img
                src={imageSrc(selected.image) ?? undefined}
                alt={selected.name}
                className="h-56 w-full object-cover sm:rounded-t-2xl"
              />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card text-lg font-bold text-green-deep shadow-card"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-dark">
                {selected.category}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-extrabold text-green-deep">
                {selected.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {selected.description ??
                  tx(
                    lang,
                    "Details will be shared on WhatsApp.",
                    "বিস্তারিত হোয়াটসঅ্যাপে জানানো হবে।",
                  )}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border bg-secondary p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {tx(lang, "Price", "মূল্য")}
                  </dt>
                  <dd className="mt-1 font-display text-lg font-extrabold text-foreground">
                    ৳ {bdt(selected.price)}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-secondary p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {tx(lang, "Unit", "ইউনিট")}
                  </dt>
                  <dd className="mt-1 font-bold text-foreground">{selected.unit}</dd>
                </div>
                <div className="col-span-2 rounded-xl border border-border bg-secondary p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {tx(lang, "Stock status", "মজুদ অবস্থা")}
                  </dt>
                  <dd
                    className={`mt-1 font-bold ${
                      selected.available ? "text-green-dark" : "text-red-dark"
                    }`}
                  >
                    {selected.available
                      ? tx(lang, "In stock — ready to deliver", "মজুদ আছে — ডেলিভারির জন্য প্রস্তুত")
                      : tx(lang, "Out of stock right now", "এই মুহূর্তে মজুদ নেই")}
                  </dd>
                </div>
              </dl>

              <a
                href={orderLink(selected.name)}
                target="_blank"
                rel="noreferrer"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-bold transition-colors ${
                  selected.available
                    ? "bg-green-dark text-primary-foreground hover:bg-green-deep"
                    : "pointer-events-none bg-secondary text-muted-foreground"
                }`}
              >
                {selected.available
                  ? tx(lang, "Order on WhatsApp", "হোয়াটসঅ্যাপে অর্ডার করুন")
                  : tx(lang, "Unavailable", "অপ্রাপ্য")}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
