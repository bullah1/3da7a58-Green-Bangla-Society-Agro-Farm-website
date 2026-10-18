import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Clock3,
  PiggyBank,
  ShieldCheck,
  Sprout,
  Landmark,
  CalendarClock,
  HandCoins,
  type LucideIcon,
} from "lucide-react";
import { Page, Section } from "@/components/site/Layout";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { FarmDashboard } from "@/components/site/FarmDashboard";
import { site, waLink } from "@/lib/site";
import heroFarm from "@/assets/hero-farm.jpg";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Bangla Society & Agro Farm — Savings, Loan, DPS, FDR" },
      {
        name: "description",
        content:
          "Green Bangla Society (gbtizarah.com) offers loan, DPS, FDR and savings services, plus fresh produce from Green Bangla Agro Farm. Order directly on WhatsApp.",
      },
      { property: "og:title", content: "Green Bangla Society & Agro Farm" },
      {
        property: "og:description",
        content:
          "Cooperative savings, loan, DPS and FDR services alongside an integrated agro farm and agro shop in Bangladesh.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    en: "Loan & Investment",
    icon: HandCoins as LucideIcon,
    bn: "ঋণ ও বিনিয়োগ",
    bodyEn: "Purpose-based financing for small business, agriculture and family needs with transparent profit sharing.",
    bodyBn: "স্বচ্ছ মুনাফা বন্টনের মাধ্যমে ক্ষুদ্র ব্যবসা, কৃষি এবং পারিবারিক প্রয়োজনে উদ্দেশ্য-ভিত্তিক অর্থায়ন।",
    to: "/loan" as const,
  },
  {
    en: "DPS Scheme",
    icon: CalendarClock as LucideIcon,
    bn: "ডিপিএস স্কিম",
    bodyEn: "Build a habit of monthly saving from ৳500 and reach a planned goal with attractive returns.",
    bodyBn: "৳৫০০ থেকে মাসিক সঞ্চয়ের অভ্যাস গড়ে তুলুন এবং আকর্ষণীয় মুনাফায় আপনার লক্ষ্যে পৌঁছান।",
    to: "/dps" as const,
  },
  {
    en: "FDR Scheme",
    icon: Landmark as LucideIcon,
    bn: "এফডিআর স্কিম",
    bodyEn: "Place a one-time deposit for a fixed term and receive a stable, predictable profit.",
    bodyBn: "নির্দিষ্ট মেয়াদের জন্য এককালীন আমানত রাখুন এবং স্থিতিশীল মুনাফা গ্রহণ করুন।",
    to: "/fdr" as const,
  },
  {
    en: "Agro Farm & Shop",
    icon: Sprout as LucideIcon,
    bn: "এগ্রো ফার্ম ও শপ",
    bodyEn: "Crop, livestock, poultry, fishery and nursery — farm-fresh products delivered on order.",
    bodyBn: "শস্য, গবাদি পশু, হাঁস-মুরগি, মৎস্য এবং নার্সারি — অর্ডার অনুযায়ী খামারের তাজা পণ্য সরবরাহ।",
    to: "/agro" as const,
  },
];

export default function Home() {
  const { lang } = useLang();
  return (
    <Page>
      <section className="relative isolate overflow-hidden bg-green-deep">
        <img
          src={heroFarm}
          alt={tx(
            lang,
            "Green paddy fields of Green Bangla Agro Farm at golden hour",
            "গোধূলি বেলায় গ্রীন বাংলা এগ্রো ফার্মের সবুজ ধান ক্ষেত",
          )}
          width={1600}
          height={900}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-40 sm:pb-36 sm:pt-28 lg:pt-32">
          <div className="hero-rise max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <span className="red-dot" aria-hidden="true" />
              {tx(lang, "Cooperative society and agro farm, Faridpur", "সমবায় সমিতি ও এগ্রো ফার্ম, ফরিদপুর")}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.2] text-white sm:text-6xl">
              {tx(lang, "Grow your savings.", "আপনার সঞ্চয় বাড়ান।")}
              <br />
              {tx(lang, "Grow the land.", "দেশকে সমৃদ্ধ করুন।")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {tx(
                lang,
                `${site.society} brings cooperative savings, loan, DPS and FDR services to members — while ${site.farm} supplies honest, farm-fresh food. One trusted family, two strong roots.`,
                `${site.society} সদস্যদের জন্য সমবায় সঞ্চয়, ঋণ, ডিপিএস এবং এফডিআর সেবা নিয়ে এসেছে — পাশাপাশি ${site.farm} সরবরাহ করছে খামারের খাঁটি ও তাজা খাবার। এক বিশ্বস্ত পরিবার, দুই মজবুত ভিত্তি।`,
              )}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/services"
                hash="apply"
                className="rounded-lg bg-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-dark"
              >
                {tx(lang, "Apply online", "অনলাইনে আবেদন করুন")}
              </Link>
              <Link
                to="/shop"
                className="rounded-lg border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {tx(lang, "Visit agro shop", "এগ্রো শপ ভিজিট করুন")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-14 max-w-6xl px-4">
        <dl className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card shadow-lift">
          {[
            [tx(lang, "12+", "১২+"), tx(lang, "Years of service", "বছরের অভিজ্ঞতা")],
            [tx(lang, "9,500+", "৯,৫০০+"), tx(lang, "Active members", "সক্রিয় সদস্য")],
            [tx(lang, "42 acres", "৪২ একর"), tx(lang, "Farm land", "খামারের জমি")],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col-reverse gap-1 px-3 py-5 text-center sm:px-6 sm:py-7">
              <dt className="text-xs text-muted-foreground sm:text-sm">{l}</dt>
              <dd className="font-display text-xl font-extrabold text-green-deep sm:text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Section
        title={tx(lang, "What we offer", "আমাদের সেবা")}
        description={tx(lang, "Every service is member-first, documented and reviewed by our board.", "প্রতিটি সেবা সদস্য-কেন্দ্রিক, যথাযথভাবে নথিবদ্ধ এবং বোর্ড দ্বারা পর্যালোচিত।")}
      >
        <div className="grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Link
              key={p.en}
              to={p.to}
              className="group flex flex-col border-border p-6 transition-colors hover:bg-secondary [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-green-dark transition-colors group-hover:bg-green-dark group-hover:text-white">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-green-deep">{tx(lang, p.en, p.bn)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tx(lang, p.bodyEn, p.bodyBn)}
              </p>
              <span className="mt-5 text-sm font-bold text-green-dark underline-offset-4 group-hover:underline">
                {tx(lang, "Learn more", "আরও জানুন")}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        tone="surface"
        title={tx(lang, "Why Green Bangla Society?", "কেন Green Bangla Society?")}
        description={tx(lang, "Member-first cooperative services built on trust, transparency and Shariah-conscious values.", "বিশ্বাস, স্বচ্ছতা এবং শরিয়াহ-সম্মত মূল্যবোধের ওপর প্রতিষ্ঠিত সদস্য-কেন্দ্রিক সমবায় সেবা।")}
      >
        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              en: "Safe & transparent service",
              bn: "নিরাপদ ও স্বচ্ছ সেবা",
              bodyEn: "Every transaction is documented, board-reviewed and shared with members regularly.",
              bodyBn: "প্রতিটি লেনদেন নথিবদ্ধ, বোর্ড পর্যালোচিত এবং নিয়মিত সদস্যদের সাথে শেয়ার করা হয়।",
            },
            {
              icon: ClipboardCheck,
              en: "Easy application process",
              bn: "সহজ আবেদন প্রক্রিয়া",
              bodyEn: "Apply online or on WhatsApp in minutes. No long queues or complicated paperwork.",
              bodyBn: "মিনিটের মধ্যে অনলাইন বা হোয়াটসঅ্যাপে আবেদন করুন। কোনো দীর্ঘ লাইন বা জটিল কাগজপত্র নয়।",
            },
            {
              icon: Briefcase,
              en: "Small entrepreneur friendly loan",
              bn: "ক্ষুদ্র উদ্যোক্তাবান্ধব ঋণ",
              bodyEn: "Financing designed for small businesses, farmers and family needs with flexible terms.",
              bodyBn: "ক্ষুদ্র ব্যবসা, কৃষক এবং পারিবারিক প্রয়োজনের জন্য নমনীয় শর্তে অর্থায়নের ব্যবস্থা।",
            },
            {
              icon: PiggyBank,
              en: "Regular savings opportunity",
              bn: "নিয়মিত সঞ্চয়ের সুযোগ",
              bodyEn: "Start a DPS or savings account from as low as ৳500 per month and grow steadily.",
              bodyBn: "মাসে মাত্র ৳৫০০ থেকে ডিপিএস বা সঞ্চয়ী হিসাব শুরু করে ধীরে ধীরে বাড়ান।",
            },
            {
              icon: Clock3,
              en: "Fast member service",
              bn: "দ্রুত সদস্যসেবা",
              bodyEn: "Quick response to enquiries, fast document checking and timely disbursement.",
              bodyBn: "জিজ্ঞাসার দ্রুত উত্তর, দ্রুত কাগজপত্র যাচাই এবং সময়মত অর্থ প্রদান।",
            },
            {
              icon: BarChart3,
              en: "Transparent account management",
              bn: "স্বচ্ছ হিসাব ব্যবস্থাপনা",
              bodyEn: "Clear statements, profit calculations and annual audit reports available anytime.",
              bodyBn: "পরিষ্কার স্টেটমেন্ট, মুনাফা হিসাব এবং বার্ষিক অডিট রিপোর্ট সবসময় পাওয়া যায়।",
            },
          ].map((f) => (
            <div key={f.en} className="flex gap-4">
              <f.icon className="mt-1 size-6 shrink-0 text-green" aria-hidden="true" />
              <div>
                <h3 className="text-base font-bold text-green-deep">{tx(lang, f.en, f.bn)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {tx(lang, f.bodyEn, f.bodyBn)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={tx(lang, "Loan Services", "ঋণ সেবা")}
        description={tx(lang, "Flexible, purpose-based financing for members with clear terms and quick processing.", "স্পষ্ট শর্ত এবং দ্রুত প্রক্রিয়ায় সদস্যদের জন্য নমনীয়, উদ্দেশ্য-ভিত্তিক অর্থায়ন।")}
      >
        <div className="grid gap-6 lg:grid-cols-5">
          <dl className="divide-y divide-border rounded-2xl border border-border bg-card lg:col-span-3">
            {[
              {
                en: "Small business loan",
                bn: "ক্ষুদ্র ব্যবসা ঋণ",
                bodyEn: "Financing for shops, agriculture, livestock and family needs with profit-sharing instead of interest.",
                bodyBn: "দোকান, কৃষি, গবাদি পশু এবং পারিবারিক প্রয়োজনের জন্য সুদের পরিবর্তে মুনাফা-ভিত্তিক অর্থায়ন।",
              },
              {
                en: "Who can apply",
                bn: "কারা আবেদন করতে পারবেন",
                bodyEn: "Bangladeshi adults with valid NID, a stable income source and membership eligibility.",
                bodyBn: "বৈধ জাতীয় পরিচয়পত্র, স্থায়ী আয়ের উৎস এবং সদস্যপদের যোগ্যতা সম্পন্ন বাংলাদেশি প্রাপ্তবয়স্করা।",
              },
              {
                en: "Required documents",
                bn: "কী কী কাগজপত্র প্রয়োজন",
                bodyEn: "NID, passport-size photo, income proof, recent bank statement and one guarantor's details.",
                bodyBn: "জাতীয় পরিচয়পত্র, পাসপোর্ট সাইজ ছবি, আয়ের প্রমাণ, সাম্প্রতিক ব্যাংক স্টেটমেন্ট এবং একজন জামিনদারের তথ্য।",
              },
              {
                en: "Loan amount",
                bn: "কত টাকা পর্যন্ত ঋণ",
                bodyEn: "Up to ৳5,00,000 depending on purpose, repayment capacity and guarantor strength.",
                bodyBn: "উদ্দেশ্য, পরিশোধ ক্ষমতা এবং জামিনদারের ভিত্তিতে সর্বোচ্চ ৳৫,০০,০০০ পর্যন্ত।",
              },
              {
                en: "Tenure",
                bn: "মেয়াদ",
                bodyEn: "6 to 36 months with flexible repayment schedules matched to your cash flow.",
                bodyBn: "আপনার নগদ প্রবাহ অনুযায়ী নমনীয় পরিশোধ সময়সূচির সাথে ৬ থেকে ৩৬ মাস।",
              },
              {
                en: "Installment method",
                bn: "কিস্তি পদ্ধতি",
                bodyEn: "Choose monthly profit-sharing or equal principal-plus-profit installments.",
                bodyBn: "মাসিক মুনাফা-ভিত্তিক কিস্তি অথবা সমান মূলধন-সহ-মুনাফার কিস্তি বেছে নিন।",
              },
              {
                en: "Application process",
                bn: "আবেদন প্রক্রিয়া",
                bodyEn: "Apply online → document verification → board approval → agreement → disbursement.",
                bodyBn: "অনলাইনে আবেদন → কাগজপত্র যাচাই → বোর্ড অনুমোদন → চুক্তি → অর্থ বিতরণ।",
              },
            ].map((item) => (
              <div key={item.en} className="grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-6">
                <dt className="text-sm font-bold text-green-deep">{tx(lang, item.en, item.bn)}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {tx(lang, item.bodyEn, item.bodyBn)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-2">
            <div className="sticky top-36 rounded-2xl bg-green-deep p-7 text-white">
              <h3 className="font-display text-2xl font-bold text-white">
                {tx(lang, "Ready to apply?", "আবেদন করতে প্রস্তুত?")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                {tx(
                  lang,
                  "Become a member or apply for a loan today. Our team will guide you through every step.",
                  "আজই সদস্য হন অথবা ঋণের জন্য আবেদন করুন। আমাদের টিম প্রতিটি ধাপে আপনাকে সাহায্য করবে।"
                )}
              </p>
              <div className="mt-6 grid gap-3">
                <Link
                  to="/services"
                  hash="apply"
                  className="block rounded-lg bg-red px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-red-dark"
                >
                  {tx(lang, "Apply for membership", "সদস্য হওয়ার আবেদন করুন")}
                </Link>
                <Link
                  to="/loan"
                  className="block rounded-lg border border-white/30 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  {tx(lang, "Apply for a loan", "ঋণের জন্য আবেদন করুন")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="surface"
        title={tx(lang, "DPS / FDR calculator", "ডিপিএস / এফডিআর ক্যালকুলেটর")}
        description={tx(lang, "Estimate your maturity amount before you apply.", "আবেদন করার আগে আপনার জমার সম্ভাব্য লভ্যাংশ হিসাব করে নিন।")}
      >
        <SavingsCalculator />
      </Section>

      <Section
        title={tx(lang, "Farm dashboard", "ফার্ম ড্যাশবোর্ড")}
        description={tx(lang, "A live snapshot of land, livestock, poultry and employment at Green Bangla Agro Farm.", "গ্রীন বাংলা এগ্রো ফার্মের জমি, গবাদি পশু, হাঁস-মুরগি এবং কর্মসংস্থানের একটি চিত্র।")}
      >
        <FarmDashboard />
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-secondary p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-green-deep sm:text-3xl">{tx(lang, "Ready to start?", "শুরু করতে প্রস্তুত?")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {tx(lang, "Talk to our team on WhatsApp, or send an online application in two minutes.", "আমাদের টিমের সাথে হোয়াটসঅ্যাপে কথা বলুন, অথবা মাত্র দুই মিনিটে অনলাইনে আবেদন করুন।")}
            </p>
          </div>
          <a
            href={waLink("Hello Green Bangla, I want to open an account.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-green-dark px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-green-deep"
          >
            {tx(lang, "Chat on WhatsApp", "হোয়াটসঅ্যাপে চ্যাট করুন")}
          </a>
        </div>
      </Section>
    </Page>
  );
}
