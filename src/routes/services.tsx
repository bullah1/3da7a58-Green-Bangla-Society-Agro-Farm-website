import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Loan, DPS, FDR & Savings | Green Bangla Society" },
      {
        name: "description",
        content:
          "Explore Green Bangla Society services: loan and investment, DPS monthly savings, FDR fixed deposits and general savings accounts.",
      },
      { property: "og:title", content: "Green Bangla Society Services" },
      {
        property: "og:description",
        content: "Loan, DPS, FDR and savings services designed for members across Bangladesh.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    en: "Loan & Investment",
    bn: "ঋণ ও বিনিয়োগ",
    to: "/loan" as const,
    points: [
      { en: "Business & agriculture financing", bn: "ব্যবসা ও কৃষি অর্থায়ন" },
      { en: "Flexible instalments", bn: "নমনীয় কিস্তি" },
      { en: "Transparent profit sharing", bn: "স্বচ্ছ মুনাফা বন্টন" },
    ],
  },
  {
    en: "DPS Scheme",
    bn: "ডিপিএস স্কিম",
    to: "/dps" as const,
    points: [
      { en: "Monthly deposit from ৳500", bn: "মাসিক জমা ৫০০৳ থেকে" },
      { en: "3 / 5 / 10 year terms", bn: "৩ / ৫ / ১০ বছর মেয়াদী" },
      { en: "Goal-based planning", bn: "লক্ষ্য-ভিত্তিক পরিকল্পনা" },
    ],
  },
  {
    en: "FDR Scheme",
    bn: "এফডিআর স্কিম",
    to: "/fdr" as const,
    points: [
      { en: "One-time deposit", bn: "এককালীন জমা" },
      { en: "Fixed term returns", bn: "নির্দিষ্ট মেয়াদী মুনাফা" },
      { en: "Profit monthly or at maturity", bn: "মাসিক অথবা মেয়াদ শেষে মুনাফা" },
    ],
  },
  {
    en: "Savings Account",
    bn: "সঞ্চয়ী হিসাব",
    to: "/contact" as const,
    points: [
      { en: "Open with ৳200", bn: "২০০৳ দিয়ে শুরু করুন" },
      { en: "Deposit any time", bn: "যেকোন সময় জমা" },
      { en: "Withdraw on request", bn: "প্রয়োজনে উত্তোলন" },
    ],
  },
];

function Services() {
  const { lang } = useLang();

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Services", "সেবাসমূহ")}
        title={tx(lang, "Financial services built for members", "সদস্যদের জন্য পরিকল্পিত আর্থিক সেবাসমূহ")}
        description={tx(
          lang,
          "Four core services cover borrowing, planned saving, fixed deposits and everyday savings — all documented and reviewed by our audit board.",
          "আমাদের প্রধান চারটি সেবা ঋণ গ্রহণ, পরিকল্পিত সঞ্চয়, ফিক্সড ডিপোজিট এবং দৈনন্দিন সঞ্চয়কে অন্তর্ভুক্ত করে — যা আমাদের অডিট বোর্ড দ্বারা নথিভুক্ত এবং পর্যালোচনা করা হয়।",
        )}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <Card key={s.en}>
              <h2 className="text-xl font-bold text-green-deep">{tx(lang, s.en, s.bn)}</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {s.points.map((p) => (
                  <li key={p.en} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green" />
                    {tx(lang, p.en, p.bn)}
                  </li>
                ))}
              </ul>
              <Link
                to={s.to}
                className="mt-5 inline-block text-sm font-bold text-green-dark hover:text-green-deep"
              >
                {tx(lang, "Details →", "বিস্তারিত →")}
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        tone="surface"
        title={tx(lang, "Calculate before you commit", "শুরু করার আগে যাচাই করুন")}
      >
        <SavingsCalculator />
      </Section>

      <Section title={tx(lang, "Online application form", "অনলাইন আবেদন ফর্ম")} id="apply">
        <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
          {tx(
            lang,
            "Fill in your details, choose a service, and send the application to our WhatsApp and email together with one tap.",
            "আপনার তথ্য প্রদান করুন, একটি সেবা বেছে নিন এবং এক ট্যাপেই আপনার আবেদনটি আমাদের হোয়াটসঅ্যাপ এবং ইমেইলে পাঠিয়ে দিন।",
          )}
        </p>
        <ApplicationForm />
      </Section>
    </Page>
  );
}
