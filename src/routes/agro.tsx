import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { FarmDashboard } from "@/components/site/FarmDashboard";
import { useSite } from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/agro")({
  head: () => ({
    meta: [
      { title: "Green Bangla Agro Farm — Crop, Livestock, Poultry, Fishery, Nursery" },
      {
        name: "description",
        content:
          "Green Bangla Agro Farm runs integrated crop, livestock, poultry, fish farming and nursery units across 42 acres, with a live farm statistics dashboard.",
      },
      { property: "og:title", content: "Green Bangla Agro Farm" },
      {
        property: "og:description",
        content: "Integrated farming: crops, cattle, poultry, fisheries and a plant nursery.",
      },
    ],
  }),
  component: Agro,
});

function Agro() {
  const { lang } = useLang();
  const site = useSite();

  const units = [
    {
      en: "Crop Farming",
      bn: "শস্য চাষ",
      en_b: "Paddy, seasonal vegetables, maize and mustard grown with organic compost and drip irrigation on 42 acres.",
      bn_b: "৪২ একর জমিতে জৈব সার এবং ড্রিপ ইরিগেশন ব্যবহার করে ধান, মৌসুমি সবজি, ভুট্টা এবং সরিষা চাষ করা হয়।",
    },
    {
      en: "Livestock",
      bn: "গবাদি পশু",
      en_b: "260 heads of cattle and goats under veterinary supervision, supplying milk, meat and organic manure.",
      bn_b: "পশুচিকিত্সকের তত্ত্বাবধানে ২৬০টি গরু ও ছাগল, যা দুধ, মাংস এবং জৈব সার সরবরাহ করে।",
    },
    {
      en: "Poultry",
      bn: "হাঁস-মুরগি",
      en_b: "12,500 layer and broiler birds in bio-secure sheds producing farm-fresh eggs and dressed chicken daily.",
      bn_b: "বায়ো-সিকিউর শেডে ১২,৫০০টি লেয়ার এবং ব্রয়লার মুরগি প্রতিদিন খামার-তাজা ডিম এবং ড্রেসড চিকেন উৎপাদন করে।",
    },
    {
      en: "Fish Farming",
      bn: "মৎস্য চাষ",
      en_b: "Nine acres of ponds cultivating tilapia, pangash, rui and katla with scheduled water quality checks.",
      bn_b: "নয় একর পুকুরে নিয়মিত পানির গুণমান পরীক্ষা করে তেলাপিয়া, পাঙ্গাস, রুই এবং কাতলা চাষ করা হয়।",
    },
    {
      en: "Nursery",
      bn: "নার্সারি",
      en_b: "38,000 grafted fruit saplings, timber plants and ornamentals available for farmers and households.",
      bn_b: "কৃষক এবং গৃহস্থালির জন্য ৩৮,০০০টি কলম করা ফলের চারা, বনজ গাছ এবং শোভাবর্ধক গাছ পাওয়া যায়।",
    },
    {
      en: "Processing & Supply",
      bn: "প্রসেসিং ও সরবরাহ",
      en_b: "Same-day grading, packaging and delivery of farm output to households, shops and restaurants.",
      bn_b: "খামারের পণ্য একই দিনে গ্রেডিং, প্যাকেজিং এবং গৃহস্থালি, দোকান ও রেস্তোরাঁয় সরবরাহ করা হয়।",
    },
  ];

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Agro Farm", "এগ্রো ফার্ম")}
        title={tx(
          lang,
          "An integrated farm, not a single crop",
          "একটি সমন্বিত খামার, একক কোনো ফসল নয়",
        )}
        description={tx(
          lang,
          "Green Bangla Agro Farm combines crops, livestock, poultry, fisheries and a nursery so land, feed and waste circulate within one system — better yield, lower cost, honest food.",
          "গ্রীন বাংলা এগ্রো ফার্ম শস্য, গবাদি পশু, হাঁস-মুরগি, মৎস্য ও নার্সারি সমন্বয় করে যাতে জমি, খাদ্য ও বর্জ্য এক ব্যবস্থার মধ্যে সঞ্চালিত হয় — ভালো ফলন, কম খরচ, বিশুদ্ধ খাবার।",
        )}
      />

      <Section>
        <img
          src={site.agroImage}
          alt={tx(
            lang,
            "Poultry shed, cattle and fish pond at Green Bangla Agro Farm",
            "গ্রীন বাংলা এগ্রো ফার্মের পোল্ট্রি শেড, গবাদি পশু এবং মাছের পুকুর",
          )}
          loading="lazy"
          width={1400}
          height={900}
          className="w-full rounded-3xl border border-border object-cover shadow-lift"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((u) => (
            <Card key={u.en}>
              <h2 className="text-base font-bold text-green-deep">{tx(lang, u.en, u.bn)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{tx(lang, u.en_b, u.bn_b)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        tone="surface"
        title={tx(lang, "Farm dashboard", "ফার্ম ড্যাশবোর্ড")}
        description={tx(
          lang,
          "Land, livestock, poultry, employment and per-unit capacity at a glance.",
          "জমি, গবাদি পশু, হাঁস-মুরগি, কর্মসংস্থান এবং ইউনিট-ভিত্তিক সক্ষমতা এক নজরে।",
        )}
      >
        <FarmDashboard />
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-card sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-green-deep">
              {tx(lang, "Buy straight from the farm", "সরাসরি খামার থেকে কিনুন")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {tx(
                lang,
                "Browse the agro shop and place your order on WhatsApp in one tap.",
                "এগ্রো শপ দেখুন এবং এক ট্যাপে হোয়াটসঅ্যাপে আপনার অর্ডার দিন।",
              )}
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-lg bg-green-dark px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-green-deep"
          >
            {tx(lang, "Open agro shop", "এগ্রো শপ দেখুন")}
          </Link>
        </div>
      </Section>
    </Page>
  );
}
