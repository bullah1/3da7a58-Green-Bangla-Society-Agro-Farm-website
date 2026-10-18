import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Transparency — Licence, Audit Reports & Policies | Green Bangla" },
      {
        name: "description",
        content:
          "Green Bangla Society publishes its registration licence, annual audit reports and operating policies for members to download and review.",
      },
      { property: "og:title", content: "Transparency — Green Bangla Society" },
      {
        property: "og:description",
        content: "Licence, audited accounts and policy documents available for download.",
      },
    ],
  }),
  component: Transparency,
});

type Doc = { en_t: string; bn_t: string; en_meta: string; bn_meta: string; file: string };

function DocCard({ d, preview }: { d: Doc; preview?: boolean }) {
  const { lang } = useLang();
  return (
    <Card>
      {preview && (
        <div className="mb-4 overflow-hidden rounded-lg border border-border bg-secondary">
          <iframe
            src={`${d.file}#toolbar=0&navpanes=0&view=FitH`}
            title={tx(lang, d.en_t, d.bn_t)}
            loading="lazy"
            className="h-80 w-full"
          />
        </div>
      )}
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-dark">
        {tx(lang, "PDF document", "পিডিএফ ডকুমেন্ট")}
      </p>
      <h3 className="mt-2 text-base font-bold text-green-deep">{tx(lang, d.en_t, d.bn_t)}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{tx(lang, d.en_meta, d.bn_meta)}</p>
      <div className="mt-4 flex gap-2">
        <a
          href={d.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-bold text-green-deep transition-colors hover:bg-secondary"
        >
          {tx(lang, "View", "দেখুন")}
        </a>
        <a
          href={d.file}
          download
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-green-dark px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-deep"
        >
          {tx(lang, "Download", "ডাউনলোড")}
        </a>
      </div>
    </Card>
  );
}

function Transparency() {
  const { lang } = useLang();

  const groups: { en_title: string; bn_title: string; en_desc: string; bn_desc: string; docs: Doc[] }[] = [
    {
      en_title: "Licences & registration",
      bn_title: "লাইসেন্স ও নিবন্ধন",
      en_desc: "Our legal standing — certificates and licences issued by government authorities.",
      bn_desc: "আমাদের আইনি অবস্থা — সরকারি কর্তৃপক্ষ কর্তৃক ইস্যু করা সার্টিফিকেট এবং লাইসেন্স।",
      docs: [
        {
          en_t: "Cooperative Registration Certificate",
          bn_t: "সমবায় নিবন্ধন সনদ",
          en_meta: "Licence · PDF",
          bn_meta: "লাইসেন্স · পিডিএফ",
          file: "/transparency/cooperative-registration-certificate.pdf",
        },
        {
          en_t: "Trade Licence",
          bn_t: "ট্রেড লাইসেন্স",
          en_meta: "Licence · PDF",
          bn_meta: "লাইসেন্স · পিডিএফ",
          file: "/transparency/trade-licence.pdf",
        },
        {
          en_t: "TIN Certificate",
          bn_t: "টিআইএন সনদ",
          en_meta: "Licence · PDF",
          bn_meta: "লাইসেন্স · পিডিএফ",
          file: "/transparency/tin-certificate.pdf",
        },
      ],
    },
    {
      en_title: "Audit reports",
      bn_title: "অডিট রিপোর্ট",
      en_desc: "Annual accounts audited by an independent chartered accountants firm.",
      bn_desc: "একটি স্বতন্ত্র চার্টার্ড অ্যাকাউন্ট্যান্টস ফার্ম দ্বারা নিরীক্ষিত বার্ষিক হিসাব।",
      docs: [
        {
          en_t: "Annual Audit Report 2025",
          bn_t: "বার্ষিক অডিট রিপোর্ট ২০২৫",
          en_meta: "Audit · PDF",
          bn_meta: "অডিট · পিডিএফ",
          file: "/transparency/audit-report-2025.pdf",
        },
        {
          en_t: "Annual Audit Report 2024",
          bn_t: "বার্ষিক অডিট রিপোর্ট ২০২৪",
          en_meta: "Audit · PDF",
          bn_meta: "অডিট · পিডিএফ",
          file: "/transparency/audit-report-2024.pdf",
        },
        {
          en_t: "Annual Audit Report 2023",
          bn_t: "বার্ষিক অডিট রিপোর্ট ২০২৩",
          en_meta: "Audit · PDF",
          bn_meta: "অডিট · পিডিএফ",
          file: "/transparency/audit-report-2023.pdf",
        },
      ],
    },
    {
      en_title: "Policies",
      bn_title: "নীতিমালা",
      en_desc: "The written rules that govern savings, loans and member rights.",
      bn_desc: "সঞ্চয়, ঋণ এবং সদস্যের অধিকার পরিচালনাকারী লিখিত নিয়মাবলী।",
      docs: [
        {
          en_t: "Savings & Investment Policy",
          bn_t: "সঞ্চয় ও বিনিয়োগ নীতিমালা",
          en_meta: "Policy · PDF",
          bn_meta: "নীতিমালা · পিডিএফ",
          file: "/transparency/savings-investment-policy.pdf",
        },
        {
          en_t: "Loan Approval & Recovery Policy",
          bn_t: "ঋণ অনুমোদন ও আদায় নীতিমালা",
          en_meta: "Policy · PDF",
          bn_meta: "নীতিমালা · পিডিএফ",
          file: "/transparency/loan-approval-recovery-policy.pdf",
        },
        {
          en_t: "Member Rights & Grievance Policy",
          bn_t: "সদস্যের অধিকার ও অভিযোগ নীতিমালা",
          en_meta: "Policy · PDF",
          bn_meta: "নীতিমালা · পিডিএফ",
          file: "/transparency/member-rights-grievance-policy.pdf",
        },
        {
          en_t: "Code of Conduct",
          bn_t: "আচরণবিধি",
          en_meta: "Policy · PDF",
          bn_meta: "নীতিমালা · পিডিএফ",
          file: "/transparency/code-of-conduct.pdf",
        },
      ],
    },
  ];

  const handling = [
    {
      en_t: "Recorded",
      bn_t: "লিপিবদ্ধকরণ",
      en_b: "Every deposit and withdrawal is receipted and entered the same day.",
      bn_b: "প্রতিটি আমানত এবং উত্তোলন একই দিনে রসিদভুক্ত এবং এন্ট্রি করা হয়।",
    },
    {
      en_t: "Reviewed",
      bn_t: "পর্যালোচনা",
      en_b: "Accounts are audited annually by an independent firm.",
      bn_b: "একটি স্বতন্ত্র ফার্ম দ্বারা বার্ষিক হিসাব নিরীক্ষা করা হয়।",
    },
    {
      en_t: "Reported",
      bn_t: "প্রতিবেদন",
      en_b: "Results are presented to the general body and published here.",
      bn_b: "ফলাফল সাধারণ সভায় পেশ করা হয় এবং এখানে প্রকাশ করা হয়।",
    },
  ];

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Transparency", "স্বচ্ছতা")}
        title={tx(lang, "Open books, by design", "উন্মুক্ত হিসাব, নীতিগতভাবে")}
        description={tx(
          lang,
          "Members and the public can review our legal standing, audited accounts and written policies at any time. Nothing important stays behind a counter.",
          "সদস্য এবং জনসাধারণ যেকোনো সময় আমাদের আইনি অবস্থা, নিরীক্ষিত হিসাব এবং লিখিত নীতিমালা পর্যালোচনা করতে পারেন। কোনো গুরুত্বপূর্ণ তথ্যই পর্দার আড়ালে থাকে না।",
        )}
      />

      {groups.map((g) => (
        <Section
          key={g.en_title}
          title={tx(lang, g.en_title, g.bn_title)}
          description={tx(lang, g.en_desc, g.bn_desc)}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.docs.map((d) => (
              <DocCard key={d.en_t} d={d} preview={g.en_title === "Licences & registration"} />
            ))}
          </div>
        </Section>
      ))}

      <Section tone="surface" title={tx(lang, "A note on these files", "এই ফাইলগুলো সম্পর্কে একটি নোট")}>
        <p className="text-sm text-muted-foreground">
          {tx(
            lang,
            "The PDFs currently linked here are sample documents with placeholder details. Replace them with the official scanned copies (same file names) before the site goes live — the download buttons will keep working without any other change.",
            "এখানে লিঙ্ক করা পিডিএফগুলো বর্তমানে ডামি ডকুমেন্ট। সাইটটি লাইভ হওয়ার আগে এগুলোকে অফিসিয়াল স্ক্যান কপি (একই ফাইল নাম) দিয়ে প্রতিস্থাপন করুন — কোনো পরিবর্তন ছাড়াই ডাউনলোড বাটনগুলো কাজ করবে।",
          )}
        </p>
      </Section>

      <Section tone="surface" title={tx(lang, "How your money is handled", "আপনার অর্থ যেভাবে পরিচালিত হয়")}>
        <div className="grid gap-5 sm:grid-cols-3">
          {handling.map((h) => (
            <Card key={h.en_t}>
              <h3 className="text-base font-bold text-green-deep">{tx(lang, h.en_t, h.bn_t)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tx(lang, h.en_b, h.bn_b)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
