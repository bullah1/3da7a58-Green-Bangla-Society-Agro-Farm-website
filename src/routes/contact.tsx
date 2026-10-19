import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { useSite } from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Online Application | Green Bangla Society" },
      {
        name: "description",
        content:
          "Contact Green Bangla Society by phone, email or WhatsApp, or submit an online application for loan, DPS, FDR and savings services.",
      },
      { property: "og:title", content: "Contact Green Bangla Society" },
      {
        property: "og:description",
        content: "Phone, email, WhatsApp and an online application form for all our services.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { lang } = useLang();
  const site = useSite();
  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Contact", "যোগাযোগ")}
        title={tx(lang, "Talk to us today", "আজই আমাদের সাথে কথা বলুন")}
        description={tx(
          lang,
          "Send an application from this page and it reaches us instantly on WhatsApp or email — no account or login needed.",
          "এই পৃষ্ঠা থেকে আবেদন পাঠান এবং তা সরাসরি আমাদের হোয়াটসঅ্যাপ বা ইমেলে পৌঁছে যাবে — কোনো অ্যাকাউন্ট বা লগইনের প্রয়োজন নেই।",
        )}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <Card>
              <h2 className="text-base font-bold text-green-deep">{tx(lang, "Office", "অফিস")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {tx(lang, "Sat – Thu, 9:00 – 18:00", "শনি – বৃহস্পতি, ৯:০০ – ১৮:০০")}
              </p>
              <p className="text-xs text-muted-foreground">
                {tx(lang, "Friday closed", "শুক্রবার বন্ধ")}
              </p>
            </Card>
            <Card>
              <h2 className="text-base font-bold text-green-deep">
                {tx(lang, "Reach us", "আমাদের সাথে যোগাযোগ")}
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>
                  {tx(lang, "Phone:", "ফোন:")}{" "}
                  <a className="font-semibold text-green-dark" href={site.tel(site.phone)}>
                    {site.phone}
                  </a>
                  {", "}
                  <a className="font-semibold text-green-dark" href={site.tel(site.phone2)}>
                    {site.phone2}
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a
                    className="font-semibold text-green-dark"
                    href={`https://wa.me/${site.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {site.whatsapp}
                  </a>
                </li>
                <li>
                  {tx(lang, "Email:", "ইমেল:")}{" "}
                  <a className="font-semibold text-green-dark" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  {", "}
                  <a className="font-semibold text-green-dark" href={`mailto:${site.email2}`}>
                    {site.email2}
                  </a>
                </li>
                <li>
                  Facebook:{" "}
                  <a
                    className="font-semibold text-green-dark"
                    href={site.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tx(lang, "Green Bangla Society page", "গ্রীনবাংলা সোসাইটি পেজ")}
                  </a>
                </li>
                <li>
                  {tx(lang, "Website:", "ওয়েবসাইট:")} {site.domain}
                </li>
              </ul>
              <a
                href={site.waLink("Hello Green Bangla, I have a question.")}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-lg bg-green-dark px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-green-deep"
              >
                {tx(lang, "Chat on WhatsApp", "হোয়াটসঅ্যাপে চ্যাট করুন")}
              </a>
            </Card>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-green-deep">
              {tx(lang, "Online application form", "অনলাইন আবেদন ফর্ম")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {tx(
                lang,
                "Fill in your details and send the summary by WhatsApp or email.",
                "আপনার তথ্য পূরণ করুন এবং হোয়াটসঅ্যাপ বা ইমেলের মাধ্যমে সারাংশ পাঠান।",
              )}
            </p>
            <div className="mt-5">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </Section>
    </Page>
  );
}
