import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHero, Section, Card } from "@/components/site/Layout";
import { ProductGrid } from "@/components/site/ProductGrid";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Agro Shop — Order Farm Fresh Products on WhatsApp | Green Bangla" },
      {
        name: "description",
        content:
          "Browse Green Bangla Agro Shop: eggs, milk, honey, fish, vegetables, saplings and agro inputs. Tap to order any product directly on WhatsApp.",
      },
      { property: "og:title", content: "Green Bangla Agro Shop" },
      {
        property: "og:description",
        content: "Farm-fresh groceries, poultry, fish and saplings — order instantly on WhatsApp.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { lang } = useLang();

  const steps = [
    {
      en_t: "1. Choose",
      bn_t: "১. পছন্দ করুন",
      en_b: "Find your product in the grid and check availability.",
      bn_b: "গ্রিডে আপনার পণ্যটি খুঁজুন এবং সহজলভ্যতা যাচাই করুন।",
    },
    {
      en_t: "2. Tap WhatsApp",
      bn_t: "২. হোয়াটসঅ্যাপে ট্যাপ করুন",
      en_b: "The product name is added to your message automatically.",
      bn_b: "পণ্যের নাম স্বয়ংক্রিয়ভাবে আপনার মেসেজে যুক্ত হয়ে যাবে।",
    },
    {
      en_t: "3. Confirm",
      bn_t: "৩. নিশ্চিত করুন",
      en_b: "We reply with total price, delivery time and payment options.",
      bn_b: "আমরা মোট মূল্য, ডেলিভারি সময় এবং পেমেন্ট অপশনসহ উত্তর দেব।",
    },
  ];

  return (
    <Page>
      <PageHero
        eyebrow={tx(lang, "Agro Shop", "এগ্রো শপ")}
        title={tx(lang, "Farm fresh, ordered in one tap", "খামারের সতেজ পণ্য, এক ট্যাপে অর্ডার")}
        description={tx(
          lang,
          "No cart, no checkout, no waiting. Pick a product, tap the WhatsApp button, and our team confirms price, delivery and payment with you directly.",
          "কোনো কার্ট নেই, কোনো চেকআউট নেই, অপেক্ষা নেই। একটি পণ্য বেছে নিন, হোয়াটসঅ্যাপ বাটনে ট্যাপ করুন এবং আমাদের টিম সরাসরি আপনার সাথে মূল্য, ডেলিভারি এবং পেমেন্ট নিশ্চিত করবে।",
        )}
      />

      <Section>
        <ProductGrid />
      </Section>

      <Section tone="surface" title={tx(lang, "How ordering works", "অর্ডার করবেন যেভাবে")}>
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.en_t}>
              <h3 className="text-base font-bold text-green-deep">{tx(lang, s.en_t, s.bn_t)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tx(lang, s.en_b, s.bn_b)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
