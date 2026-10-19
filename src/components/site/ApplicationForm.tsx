import { useState } from "react";
import { useSite } from "@/lib/settings";
import { tx, useLang } from "@/lib/i18n";
import { submitApplication } from "@/lib/applications";

const field =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-green-dark focus:ring-2 focus:ring-ring/25";

const services = [
  { en: "Loan / Investment", bn: "ঋণ / বিনিয়োগ" },
  { en: "DPS Scheme", bn: "ডিপিএস স্কিম" },
  { en: "FDR Scheme", bn: "এফডিআর স্কিম" },
  { en: "Savings Account", bn: "সঞ্চয়ী হিসাব" },
  { en: "Agro Shop Order", bn: "অ্যাগ্রো শপ অর্ডার" },
  { en: "General Enquiry", bn: "সাধারণ জিজ্ঞাসা" },
];

/** Accepts either the English or Bangla label and returns the English option value. */
function toServiceValue(label?: string) {
  const match = services.find((s) => s.en === label || s.bn === label);
  return match ? match.en : "Loan / Investment";
}

export function ApplicationForm({ defaultService }: { defaultService?: string }) {
  const { lang } = useLang();
  const site = useSite();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: toServiceValue(defaultService),
    amount: "",
    message: "",
  });
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedFor, setSavedFor] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const summary = [
    "New application — Green Bangla",
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    form.address && `Address: ${form.address}`,
    `Service: ${form.service}`,
    form.amount && `Amount: ${form.amount} BDT`,
    form.message && `Note: ${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ready = form.name.trim().length > 1 && form.phone.trim().length > 5;

  // Store the application once per distinct content, whichever button is used.
  async function record() {
    if (savedFor === summary || save === "saving") return;
    setSave("saving");
    try {
      await submitApplication(form);
      setSavedFor(summary);
      setSave("saved");
    } catch (err) {
      console.error(err);
      setSave("error");
    }
  }

  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Application: ${form.service}`,
  )}&body=${encodeURIComponent(summary)}`;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Full name *", "পূর্ণ নাম *")}
          <input required value={form.name} onChange={set("name")} className={field} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Mobile number *", "মোবাইল নম্বর *")}
          <input
            required
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
            className={field}
            placeholder={tx(lang, "01XXXXXXXXX", "০১XXXXXXXXX")}
          />
        </label>
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Email", "ইমেইল")}
          <input type="email" value={form.email} onChange={set("email")} className={field} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Address", "ঠিকানা")}
          <input value={form.address} onChange={set("address")} className={field} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Service", "সেবা")}
          <select value={form.service} onChange={set("service")} className={field}>
            {services.map((s) => (
              <option key={s.en} value={s.en}>
                {tx(lang, s.en, s.bn)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-green-deep">
          {tx(lang, "Amount (BDT)", "পরিমাণ (টাকা)")}
          <input
            inputMode="numeric"
            value={form.amount}
            onChange={set("amount")}
            className={field}
          />
        </label>
        <label className="block text-sm font-semibold text-green-deep sm:col-span-2">
          {tx(lang, "Message", "বার্তা")}
          <textarea rows={4} value={form.message} onChange={set("message")} className={field} />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            if (!ready) return;
            // Open WhatsApp first (popup blockers allow it during the click), then the mail app.
            window.open(site.waLink(summary), "_blank", "noopener,noreferrer");
            window.location.href = mailHref;
            void record();
          }}
          className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition-colors ${
            ready
              ? "bg-green-dark text-primary-foreground hover:bg-green-deep"
              : "cursor-not-allowed bg-secondary text-muted-foreground"
          }`}
        >
          {tx(lang, "Send to WhatsApp + Email", "হোয়াটসঅ্যাপ এবং ইমেইল এ পাঠান")}
        </button>
        <a
          href={ready ? site.waLink(summary) : undefined}
          onClick={() => ready && void record()}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!ready}
          className={`inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-bold transition-colors ${
            ready
              ? "border-border text-green-deep hover:bg-secondary"
              : "pointer-events-none border-border text-muted-foreground"
          }`}
        >
          {tx(lang, "WhatsApp only", "শুধুমাত্র হোয়াটসঅ্যাপ")}
        </a>
        <a
          href={ready ? mailHref : undefined}
          onClick={() => ready && void record()}
          aria-disabled={!ready}
          className={`inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-bold transition-colors ${
            ready
              ? "border-border text-green-deep hover:bg-secondary"
              : "pointer-events-none border-border text-muted-foreground"
          }`}
        >
          {tx(lang, "Email only", "শুধুমাত্র ইমেইল")}
        </a>
      </div>
      {!ready && (
        <p className="mt-3 text-xs text-muted-foreground">
          {tx(
            lang,
            "Enter your name and mobile number to enable submission.",
            "আবেদন করতে আপনার নাম এবং মোবাইল নম্বর লিখুন।",
          )}
        </p>
      )}
      <p className="mt-3 text-xs font-semibold" role="status" aria-live="polite">
        {save === "saving" && (
          <span className="text-muted-foreground">
            {tx(lang, "Saving your application…", "আপনার আবেদন জমা হচ্ছে…")}
          </span>
        )}
        {save === "saved" && (
          <span className="text-green-dark">
            {tx(
              lang,
              "Application received. Our team will contact you on the mobile number you gave. Please also send the WhatsApp message that opened.",
              "আবেদন জমা হয়েছে। আমাদের টিম আপনার দেওয়া মোবাইল নম্বরে যোগাযোগ করবে। খুলে যাওয়া হোয়াটসঅ্যাপ মেসেজটিও পাঠিয়ে দিন।",
            )}
          </span>
        )}
        {save === "error" && (
          <span className="text-red-dark">
            {tx(
              lang,
              "We couldn't save the application online. Please send it on WhatsApp or email so it reaches us.",
              "অনলাইনে আবেদন সংরক্ষণ করা যায়নি। আবেদনটি যেন আমাদের কাছে পৌঁছায়, তাই হোয়াটসঅ্যাপ বা ইমেইলে পাঠিয়ে দিন।",
            )}
          </span>
        )}
      </p>
    </form>
  );
}
