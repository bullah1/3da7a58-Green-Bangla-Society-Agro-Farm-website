import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, MessageCircle, PhoneCall, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { site, waLink } from "@/lib/site";
import { tx, useLang, type Lang } from "@/lib/i18n";

const nav = [
  { to: "/", en: "Home", bn: "হোম" },
  { to: "/about", en: "About", bn: "আমাদের সম্পর্কে" },
  { to: "/services", en: "Services", bn: "সেবাসমূহ" },
  { to: "/loan", en: "Loan", bn: "লোন" },
  { to: "/dps", en: "DPS", bn: "ডিপিএস" },
  { to: "/fdr", en: "FDR", bn: "এফডিআর" },
  { to: "/transparency", en: "Transparency", bn: "স্বচ্ছতা" },
  { to: "/agro", en: "Agro Farm", bn: "অ্যাগ্রো ফার্ম" },
  { to: "/shop", en: "Agro Shop", bn: "অ্যাগ্রো শপ" },
  { to: "/contact", en: "Contact", bn: "যোগাযোগ" },
] as const;

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Green Bangla home">
      <img
        src="/logo.png"
        alt="Green Bangla Society logo"
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full bg-white object-contain"
      />
      <span className="min-w-0 leading-tight">
        <span
          className={`block truncate font-display text-base font-extrabold sm:text-lg ${
            light ? "text-white" : "text-green-deep"
          }`}
        >
          Green Bangla
        </span>
        <span
          className={`block truncate text-[11px] font-semibold sm:text-xs ${
            light ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          Society &amp; Agro Farm
        </span>
      </span>
    </Link>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggle}
      aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
      className={`h-9 min-w-12 border-border bg-card px-3 text-xs font-extrabold text-green-deep shadow-none hover:bg-secondary ${className}`}
    >
      {lang === "bn" ? "EN" : "বাংলা"}
    </Button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-card">
      <div className="bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6 lg:py-4">
          <Logo />
          <div className="flex shrink-0 items-center gap-2 lg:gap-4">
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="group hidden items-center gap-3 lg:flex"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-green-deep transition-colors group-hover:bg-green-dark group-hover:text-white">
                <PhoneCall className="size-4" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold text-muted-foreground">
                  {tx(lang, "Call us", "কল করুন")}
                </span>
                <span className="block text-sm font-bold text-foreground">{site.phone}</span>
              </span>
              <span className="mx-1 h-8 w-px bg-border" aria-hidden="true" />
            </a>
            <LangToggle />
            <Button asChild size="sm" className="hidden h-9 bg-green-dark font-bold hover:bg-green-deep sm:inline-flex">
              <a href={waLink("Hello Green Bangla, I would like to know more.")} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? tx(lang, "Close menu", "মেনু বন্ধ করুন") : tx(lang, "Open menu", "মেনু খুলুন")}
              aria-expanded={open}
              className="border-border bg-card text-green-deep xl:hidden"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden bg-green-deep xl:block">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3 px-6">
          <nav aria-label={tx(lang, "Primary navigation", "প্রধান নেভিগেশন")} className="flex min-w-0 items-stretch">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-primary/25 border-primary-foreground" }}
                className="flex items-center border-b-2 border-transparent px-3 py-3.5 text-[13px] font-bold text-primary-foreground/90 transition-colors hover:border-primary-foreground/60 hover:bg-primary/20 hover:text-primary-foreground"
              >
                {tx(lang, item.en, item.bn)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center py-2">
            <Link
              to="/services"
              hash="apply"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red px-5 text-sm font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-red-dark"
            >
              {tx(lang, "Apply Online", "অনলাইন আবেদন")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 shadow-lift xl:hidden">
          <nav aria-label={tx(lang, "Mobile navigation", "মোবাইল নেভিগেশন")} className="mx-auto grid max-w-7xl grid-cols-2 gap-1 sm:grid-cols-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-green-deep" }}
                onClick={() => setOpen(false)}
                className="min-w-0 rounded-md px-3 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-green-deep"
              >
                {tx(lang, item.en, item.bn)}
              </Link>
            ))}
            <Link
              to="/services"
              hash="apply"
              onClick={() => setOpen(false)}
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-md bg-red px-4 py-3 text-sm font-extrabold text-primary-foreground hover:bg-red-dark sm:col-span-1"
            >
              {tx(lang, "Apply Online", "অনলাইন আবেদন")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={waLink("Hello Green Bangla, I would like to know more.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-green-dark px-4 py-3 text-sm font-bold text-white hover:bg-green-deep"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-bold text-green-deep hover:bg-secondary"
            >
              <PhoneCall className="size-4" aria-hidden="true" />
              {tx(lang, "Call", "কল করুন")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-green-deep text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo tone="light" />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            {tx(
              lang,
              "A cooperative society for Shariah-conscious savings and investment, and an integrated agro farm serving fresh produce across Bangladesh.",
              "শরিয়াহ-সম্মত সঞ্চয় ও বিনিয়োগের একটি সমবায় সমিতি, এবং সারা বাংলাদেশে তাজা পণ্য সরবরাহকারী একটি সমন্বিত অ্যাগ্রো ফার্ম।",
            )}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {tx(lang, "Financial Services", "আর্থিক সেবা")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <Link to="/loan" className="hover:text-white hover:underline">
                {tx(lang, "Loan & Investment", "লোন ও বিনিয়োগ")}
              </Link>
            </li>
            <li>
              <Link to="/dps" className="hover:text-white hover:underline">
                {tx(lang, "DPS Scheme", "ডিপিএস স্কিম")}
              </Link>
            </li>
            <li>
              <Link to="/fdr" className="hover:text-white hover:underline">
                {tx(lang, "FDR Scheme", "এফডিআর স্কিম")}
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white hover:underline">
                {tx(lang, "Savings Account", "সঞ্চয়ী অ্যাকাউন্ট")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{tx(lang, "Agro", "অ্যাগ্রো")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <Link to="/agro" className="hover:text-white hover:underline">
                {tx(lang, "Farm Overview", "ফার্ম পরিচিতি")}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white hover:underline">
                {tx(lang, "Agro Shop", "অ্যাগ্রো শপ")}
              </Link>
            </li>
            <li>
              <Link to="/transparency" className="hover:text-white hover:underline">
                {tx(lang, "Transparency", "স্বচ্ছতা")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white hover:underline">
                {tx(lang, "About Us", "আমাদের সম্পর্কে")}
              </Link>
            </li>
            <li>
              <Link to="/manage" className="hover:text-white hover:underline">
                {tx(lang, "Manage Shop (owner)", "শপ ম্যানেজ (মালিক)")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {tx(lang, "Contact", "যোগাযোগ")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>{site.address}</li>
            <li>{site.phone}, {site.phone2}</li>
            <li>WhatsApp: {site.whatsappDisplay}</li>
            <li>{site.email}</li>
            <li>{site.email2}</li>
            <li>
              <a href={site.facebook} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">Facebook</a>
            </li>
            <li>{site.domain}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60">
          © {new Date().getFullYear()} {site.society} &amp; {site.farm}.{" "}
          {tx(lang, "All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
        </p>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="surface-grad border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="flex items-center gap-2 text-sm font-bold text-green-dark">
          <span className="red-dot" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold text-green-deep sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
  tone = "base",
  id,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  tone?: "base" | "surface";
  id?: string;
}) {
  return (
    <section id={id} className={tone === "surface" ? "bg-surface py-14 sm:py-20" : "py-14 sm:py-20"}>
      <div className="mx-auto max-w-6xl px-4">
        {title && (
          <h2 className="max-w-3xl text-2xl font-bold text-green-deep sm:text-4xl">{title}</h2>
        )}
        {description && (
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
        )}
        <div className={title || description ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export type { Lang };
