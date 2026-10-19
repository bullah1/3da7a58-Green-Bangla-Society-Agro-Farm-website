import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { useSite } from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Green Bangla Society & Agro Farm" },
      {
        name: "description",
        content:
          "Our story, mission, governance and leadership behind Green Bangla Society and Green Bangla Agro Farm.",
      },
      { property: "og:title", content: "About Green Bangla" },
      {
        property: "og:description",
        content: "Mission, values and governance of Green Bangla Society and Agro Farm.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    tEn: "Transparency",
    tBn: "স্বচ্ছতা",
    bEn: "Audited accounts, published policies and open member records.",
    bBn: "নিরীক্ষিত হিসাব, প্রকাশিত নীতিমালা এবং সদস্যদের জন্য উন্মুক্ত নথিপত্র।",
  },
  {
    tEn: "Halal & ethical",
    tBn: "হালাল ও নৈতিক",
    bEn: "Profit-sharing based services free from exploitative interest.",
    bBn: "শোষণমূলক সুদ মুক্ত মুনাফা-বন্টন ভিত্তিক সেবা।",
  },
  {
    tEn: "Community first",
    tBn: "আগে জনকল্যাণ",
    bEn: "Local employment, farmer support and member welfare programmes.",
    bBn: "স্থানীয় কর্মসংস্থান, কৃষক সহায়তা এবং সদস্য কল্যাণ কার্যক্রম।",
  },
  {
    tEn: "Real assets",
    tBn: "বাস্তব সম্পদ",
    bEn: "Member funds work in real agriculture, livestock and trade.",
    bBn: "সদস্যদের আমানত বাস্তব কৃষি, গবাদি পশু এবং ব্যবসায়িক খাতে নিয়োজিত হয়।",
  },
];

function About() {
  const { lang } = useLang();
  const site = useSite();
  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "About us", "আমাদের সম্পর্কে")}
        title={tx(lang, "Two roots, one promise", "দুই ভিত্তি, এক অঙ্গীকার")}
        description={tx(
          lang,
          `${site.society} is a member-owned cooperative for savings and investment. ${site.farm} is our production arm, turning member capital into real, visible farming output.`,
          `${site.society} হলো সঞ্চয় ও বিনিয়োগের জন্য সদস্যদের মালিকানাধীন একটি সমবায় প্রতিষ্ঠান। ${site.farm} হলো আমাদের উৎপাদন শাখা, যা সদস্যদের মূলধনকে দৃশ্যমান কৃষি উৎপাদনে রূপান্তরিত করে।`,
        )}
      />

      <Section title={tx(lang, "Our story", "আমাদের গল্প")}>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">
            <p>
              {tx(
                lang,
                "Green Bangla began as a small savings circle among neighbours who wanted a fair, transparent alternative for handling their money. As trust grew, members asked for more: financing for small business, planned savings for children, and a safe place for retirement funds.",
                "গ্রীন বাংলা শুরু হয়েছিল প্রতিবেশীদের মধ্যে একটি ছোট সঞ্চয় চক্র হিসেবে, যারা তাদের অর্থ পরিচালনার জন্য একটি ন্যায্য ও স্বচ্ছ বিকল্প খুঁজছিলেন। আস্থা বাড়ার সাথে সাথে সদস্যরা আরও অনেক কিছু চেয়েছেন: ক্ষুদ্র ব্যবসার অর্থায়ন, সন্তানদের জন্য পরিকল্পিত সঞ্চয় এবং অবসরকালীন তহবিলের নিরাপদ স্থান।",
              )}
            </p>
            <p>
              {tx(
                lang,
                "To make sure member deposits are backed by productive work rather than paperwork, we built Green Bangla Agro Farm — an integrated operation covering crops, livestock, poultry, fish farming and a plant nursery. Today the same organisation serves both savers and kitchens.",
                "সদস্যদের আমানত শুধু কাগজপত্রের বদলে যেন উৎপাদনশীল কাজের মাধ্যমে সুরক্ষিত থাকে, তা নিশ্চিত করতে আমরা গড়ে তুলেছি গ্রীন বাংলা এগ্রো ফার্ম — শস্য, গবাদি পশু, হাঁস-মুরগি, মৎস্য চাষ এবং নার্সারি সম্বলিত একটি সমন্বিত উদ্যোগ। আজ একই প্রতিষ্ঠান সঞ্চয়কারী এবং রান্নাঘর — উভয়ের সেবা করে যাচ্ছে।",
              )}
            </p>
            <p>
              {tx(
                lang,
                "We remain a service organisation, not a bank. Every scheme is documented, every rupee is accounted for, and every member can inspect our reports.",
                "আমরা একটি সেবা সংস্থা হিসেবে কাজ করি, ব্যাংক হিসেবে নয়। প্রতিটি স্কিম নথিবদ্ধ, প্রতিটি টাকার হিসাব রাখা হয় এবং প্রতিটি সদস্য আমাদের রিপোর্টগুলো যাচাই করতে পারেন।",
              )}
            </p>
          </div>
          <img
            src={site.aboutImage}
            alt={tx(
              lang,
              "Green Bangla Agro Farm poultry shed, cattle and fish pond",
              "গ্রীন বাংলা এগ্রো ফার্মের হাঁস-মুরগির শেড, গবাদি পশু এবং মাছের পুকুর",
            )}
            loading="lazy"
            width={1400}
            height={900}
            className="w-full rounded-3xl border border-border object-cover shadow-lift"
          />
        </div>
      </Section>

      <Section tone="surface" title={tx(lang, "What we stand for", "আমাদের আদর্শ")}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.tEn}>
              <h3 className="text-base font-bold text-green-deep">{tx(lang, v.tEn, v.tBn)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tx(lang, v.bEn, v.bBn)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={tx(lang, "Governance", "পরিচালনা পদ্ধতি")}>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            [
              tx(lang, "General Body", "সাধারণ পরিষদ"),
              tx(
                lang,
                "All registered members, meeting annually to approve accounts.",
                "সকল নিবন্ধিত সদস্য, যারা বার্ষিক সভায় হিসাব অনুমোদন করেন।",
              ),
            ],
            [
              tx(lang, "Managing Committee", "ব্যবস্থাপনা কমিটি"),
              tx(
                lang,
                "Elected representatives responsible for day-to-day policy.",
                "দৈনন্দিন নীতি নির্ধারণের দায়িত্বে নিয়োজিত নির্বাচিত প্রতিনিধিগণ।",
              ),
            ],
            [
              tx(lang, "Audit & Shariah Board", "অডিট ও শরীয়াহ বোর্ড"),
              tx(
                lang,
                "Independent review of accounts and service structures.",
                "হিসাব এবং সেবা কাঠামোর স্বতন্ত্র পর্যালোচনা।",
              ),
            ],
          ].map(([t, b]) => (
            <Card key={t}>
              <h3 className="text-base font-bold text-green-deep">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
