import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/loan")({
  head: () => ({
    meta: [
      { title: "Loan & Investment Financing | Green Bangla Society" },
      {
        name: "description",
        content:
          "Apply for business, agriculture or family financing from Green Bangla Society with transparent profit sharing and flexible instalments.",
      },
      { property: "og:title", content: "Loan & Investment — Green Bangla Society" },
      {
        property: "og:description",
        content: "Purpose-based financing with clear terms, flexible instalments and fast approval.",
      },
    ],
  }),
  component: Loan,
});

const products = [
  {
    en: "Small business finance",
    bn: "ক্ষুদ্র ব্যবসা অর্থায়ন",
    r: "৳20,000 – ৳5,00,000",
    termEn: "6 – 36 months",
    termBn: "৬ – ৩৬ মাস",
  },
  {
    en: "Agriculture & livestock",
    bn: "কৃষি ও গবাদি পশু",
    r: "৳25,000 – ৳10,00,000",
    termEn: "6 – 48 months",
    termBn: "৬ – ৪৮ মাস",
  },
  {
    en: "Family & emergency",
    bn: "পারিবারিক ও জরুরি",
    r: "৳10,000 – ৳1,00,000",
    termEn: "3 – 24 months",
    termBn: "৩ – ২৪ মাস",
  },
];

const eligibility = [
  { en: "Member of the society for at least 3 months", bn: "কমপক্ষে ৩ মাস ধরে সমিতির সদস্য" },
  { en: "Verifiable income or business activity", bn: "যাচাইযোগ্য আয় বা ব্যবসায়িক কার্যক্রম" },
  { en: "Two guarantors who are also members", bn: "দুইজন জামিনদার যারা সমিতির সদস্য" },
  { en: "Clean repayment record with the society", bn: "সমিতির সাথে ঋণের ভালো রেকর্ড" },
];

const documents = [
  { en: "National ID copy (applicant & guarantors)", bn: "জাতীয় পরিচয়পত্রের কপি (আবেদনকারী ও জামিনদার)" },
  { en: "Two passport-size photographs", bn: "দুই কপি পাসপোর্ট সাইজের ছবি" },
  { en: "Trade licence or land documents, if applicable", bn: "ট্রেড লাইসেন্স বা জমির দলিল, যদি প্রযোজ্য হয়" },
  { en: "Bank or mobile-wallet statement of last 3 months", bn: "গত ৩ মাসের ব্যাংক বা মোবাইল ওয়ালেট স্টেটমেন্ট" },
];

function Loan() {
  const { lang } = useLang();

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Loan", "ঋণ")}
        title={tx(lang, "Financing that respects your plan", "আপনার পরিকল্পনা অনুযায়ী অর্থায়ন")}
        description={tx(
          lang,
          "Purpose-based financing for members with clear documentation, an agreed profit share and instalments that match your cash flow.",
          "সদস্যদের জন্য উদ্দেশ্য-ভিত্তিক অর্থায়ন, যেখানে থাকছে স্বচ্ছ নথিপত্র, মুনাফার অংশীদারিত্ব এবং আপনার আয় অনুযায়ী কিস্তির সুবিধা।",
        )}
      />

      <Section title={tx(lang, "Financing products", "অর্থায়ন স্কিমসমূহ")}>
        <div className="grid gap-5 sm:grid-cols-3">
          {products.map((p) => (
            <Card key={p.en}>
              <h3 className="text-base font-bold text-green-deep">{tx(lang, p.en, p.bn)}</h3>
              <p className="mt-3 font-display text-lg font-extrabold text-foreground">{p.r}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {tx(lang, "Term:", "মেয়াদ:")} {tx(lang, p.termEn, p.termBn)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface" title={tx(lang, "Eligibility & documents", "যোগ্যতা ও প্রয়োজনীয় কাগজপত্র")}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold text-green-deep">{tx(lang, "Eligibility", "যোগ্যতা")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {eligibility.map((item) => (
                <li key={item.en}>{tx(lang, item.en, item.bn)}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-base font-bold text-green-deep">
              {tx(lang, "Documents required", "প্রয়োজনীয় কাগজপত্র")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {documents.map((item) => (
                <li key={item.en}>{tx(lang, item.en, item.bn)}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section title={tx(lang, "Online application", "অনলাইন আবেদন")}>
        <ApplicationForm defaultService={tx(lang, "Loan / Investment", "ঋণ / বিনিয়োগ")} />
      </Section>
    </Page>
  );
}
