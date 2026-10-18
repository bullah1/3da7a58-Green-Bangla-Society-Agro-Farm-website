import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/fdr")({
  head: () => ({
    meta: [
      { title: "FDR Fixed Deposit Scheme | Green Bangla Society" },
      {
        name: "description",
        content:
          "Place a one-time deposit with Green Bangla Society for a fixed term and receive stable returns. Calculate your FDR maturity and apply online.",
      },
      { property: "og:title", content: "FDR Scheme — Green Bangla Society" },
      {
        property: "og:description",
        content: "Fixed-term deposits with predictable profit, paid monthly or at maturity.",
      },
    ],
  }),
  component: Fdr,
});

const terms = [
  { en: "1 Year", bn: "১ বছর", rate: "9.0%" },
  { en: "2 Years", bn: "২ বছর", rate: "9.5%" },
  { en: "3 Years", bn: "৩ বছর", rate: "10.0%" },
  { en: "5 Years", bn: "৫ বছর", rate: "11.0%" },
];

const features = [
  { en: "Minimum deposit ৳25,000, no maximum limit", bn: "ন্যূনতম জমা ২৫,০০০৳, সর্বোচ্চ কোনো সীমা নেই" },
  { en: "Monthly profit payout option available", bn: "মাসিক মুনাফা উত্তোলনের সুবিধা" },
  { en: "Automatic renewal on request", bn: "অনুরোধ সাপেক্ষে স্বয়ংক্রিয় নবায়ন" },
  { en: "Financing facility against the deposit", bn: "জমার বিপরীতে ঋণ সুবিধা" },
];

const beforeInvest = [
  { en: "Early encashment may reduce the applicable profit rate", bn: "মেয়াদ উত্তীর্ণের আগে টাকা তুললে মুনাফার হার কম হতে পারে" },
  { en: "Nominee details are recorded at the time of opening", bn: "হিসাব খোলার সময় নমিনির তথ্য গ্রহণ করা হয়" },
  { en: "Receipt and agreement copy are issued to every depositor", bn: "প্রতিটি আমানতকারীকে রসিদ এবং চুক্তিনামা প্রদান করা হয়" },
  { en: "Rates are reviewed annually by the managing committee", bn: "মুনাফার হার ব্যবস্থাপনা কমিটি দ্বারা বার্ষিক পর্যালোচনা করা হয়" },
];

function Fdr() {
  const { lang } = useLang();

  return (
    <Page>
      <PageHero
        eyebrow="FDR"
        title={tx(lang, "Fixed deposit, predictable profit", "ফিক্সড ডিপোজিট, নিশ্চিত মুনাফা")}
        description={tx(
          lang,
          "Deposit once, choose your term, and receive profit either monthly as income or in full at maturity. Minimum deposit ৳25,000.",
          "একবার জমা দিন, মেয়াদ বেছে নিন এবং প্রতি মাসে বা মেয়াদ শেষে মুনাফা বুঝে নিন। সর্বনিম্ন জমা ২৫,০০০৳।"
        )}
      />

      <Section title={tx(lang, "Term & profit rates", "মেয়াদ ও মুনাফার হার")}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {terms.map((p) => (
            <Card key={p.en}>
              <h3 className="text-base font-bold text-green-deep">{tx(lang, p.en, p.bn)}</h3>
              <p className="mt-3 font-display text-3xl font-extrabold text-green-dark">{p.rate}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {tx(lang, "Indicative annual profit rate", "বার্ষিক আনুমানিক মুনাফার হার")}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold text-green-deep">{tx(lang, "Key features", "মূল বৈশিষ্ট্যসমূহ")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {features.map((f) => (
                <li key={f.en}>{tx(lang, f.en, f.bn)}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-base font-bold text-green-deep">{tx(lang, "Before you invest", "বিনিয়োগের আগে জেনে নিন")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {beforeInvest.map((b) => (
                <li key={b.en}>{tx(lang, b.en, b.bn)}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="surface" title={tx(lang, "FDR calculator", "এফডিআর ক্যালকুলেটর")}>
        <SavingsCalculator defaultMode="fdr" />
      </Section>

      <Section title={tx(lang, "Open an FDR", "এফডিআর শুরু করুন")}>
        <ApplicationForm defaultService={tx(lang, "FDR Scheme", "এফডিআর স্কিম")} />
      </Section>
    </Page>
  );
}
