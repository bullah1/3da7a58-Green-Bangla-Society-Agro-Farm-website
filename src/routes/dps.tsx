import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { tx, useLang } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { fmtRate, fmtTaka, fmtYears, schemesOf, schemesQuery } from "@/lib/schemes";

export const Route = createFileRoute("/dps")({
  head: () => ({
    meta: [
      { title: "DPS Monthly Savings Scheme | Green Bangla Society" },
      {
        name: "description",
        content:
          "Open a DPS with Green Bangla Society from ৳500 per month. Use the DPS calculator to project your maturity amount and apply online.",
      },
      { property: "og:title", content: "DPS Scheme — Green Bangla Society" },
      {
        property: "og:description",
        content: "Monthly savings from ৳500 with 3, 5 and 10 year terms and attractive returns.",
      },
    ],
  }),
  component: Dps,
});

function Dps() {
  const { lang } = useLang();
  const { data } = useQuery(schemesQuery);
  const plans = schemesOf(data, "dps");

  return (
    <Page>
      <PageHero
        eyebrow="DPS"
        title={tx(lang, "A small monthly habit, a big result", "মাসে অল্প সঞ্চয়, শেষে বড় প্রাপ্তি")}
        description={tx(
          lang,
          "Deposit a fixed amount every month and receive the full accumulated value with profit at maturity. Ideal for education, marriage, Hajj or land purchase planning.",
          "প্রতি মাসে একটি নির্দিষ্ট পরিমাণ টাকা জমা দিন এবং মেয়াদ শেষে মুনাফাসহ সম্পূর্ণ টাকা বুঝে নিন। শিক্ষা, বিয়ে, হজ বা জমি ক্রয়ের পরিকল্পনার জন্য এটি আদর্শ।"
        )}
      />

      <Section title={tx(lang, "Available terms", "উপলব্ধ মেয়াদসমূহ")}>
        <div className="grid gap-5 sm:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id}>
              <h3 className="text-base font-bold text-green-deep">{fmtYears(p.years, lang)}</h3>
              <p className="mt-3 font-display text-3xl font-extrabold text-green-dark">
                {fmtRate(p.rate, lang)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {tx(lang, "Indicative annual profit rate", "বার্ষিক আনুমানিক মুনাফার হার")}
              </p>
              <p className="mt-4 text-sm font-semibold text-foreground">
                {tx(lang, "Minimum", "ন্যূনতম")} {fmtTaka(p.min_amount, lang)} /{" "}
                {tx(lang, "month", "মাস")}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface" title={tx(lang, "DPS calculator", "ডিপিএস ক্যালকুলেটর")}>
        <SavingsCalculator defaultMode="dps" />
      </Section>

      <Section title={tx(lang, "Open a DPS", "ডিপিএস শুরু করুন")}>
        <ApplicationForm defaultService={tx(lang, "DPS Scheme", "ডিপিএস স্কিম")} />
      </Section>
    </Page>
  );
}
