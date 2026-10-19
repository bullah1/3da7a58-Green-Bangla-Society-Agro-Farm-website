import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroFarm from "@/assets/hero-farm.jpg";
import agroFarm from "@/assets/agro-farm.jpg";
import { site as builtIn } from "@/lib/site";

/** Everything the owner can change from Admin → Site settings. */
export type SiteSettings = {
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  email2: string;
  address: string;
  facebook: string;
  domain: string;

  hero_tag_bn: string;
  hero_tag_en: string;
  hero_title1_bn: string;
  hero_title1_en: string;
  hero_title2_bn: string;
  hero_title2_en: string;
  hero_text_bn: string;
  hero_text_en: string;
  /** Uploaded image URL, or "" for the built-in photo. */
  hero_image: string;

  stat_years: string;
  stat_members: string;
  stat_land: string;

  agro_image: string;
  about_image: string;
};

export const defaultSettings: SiteSettings = {
  phone: builtIn.phone,
  phone2: builtIn.phone2,
  whatsapp: builtIn.whatsappDisplay,
  email: builtIn.email,
  email2: builtIn.email2,
  address: builtIn.address,
  facebook: builtIn.facebook,
  domain: builtIn.domain,

  hero_tag_bn: "সমবায় সমিতি ও এগ্রো ফার্ম, ফরিদপুর",
  hero_tag_en: "Cooperative society and agro farm, Faridpur",
  hero_title1_bn: "আপনার সঞ্চয় বাড়ান।",
  hero_title1_en: "Grow your savings.",
  hero_title2_bn: "দেশকে সমৃদ্ধ করুন।",
  hero_title2_en: "Grow the land.",
  hero_text_bn: `${builtIn.society} সদস্যদের জন্য সমবায় সঞ্চয়, ঋণ, ডিপিএস এবং এফডিআর সেবা নিয়ে এসেছে — পাশাপাশি ${builtIn.farm} সরবরাহ করছে খামারের খাঁটি ও তাজা খাবার। এক বিশ্বস্ত পরিবার, দুই মজবুত ভিত্তি।`,
  hero_text_en: `${builtIn.society} brings cooperative savings, loan, DPS and FDR services to members — while ${builtIn.farm} supplies honest, farm-fresh food. One trusted family, two strong roots.`,
  hero_image: "",

  stat_years: "12+",
  stat_members: "9,500+",
  stat_land: "42",

  agro_image: "",
  about_image: "",
};

export const settingKeys = Object.keys(defaultSettings) as (keyof SiteSettings)[];

/** Keep only known string fields; anything missing falls back to the built-in value. */
export function mergeSettings(raw: unknown): SiteSettings {
  const out = { ...defaultSettings };
  if (raw && typeof raw === "object") {
    for (const k of settingKeys) {
      const v = (raw as Record<string, unknown>)[k];
      if (typeof v === "string" && (v.trim() !== "" || k.endsWith("_image"))) out[k] = v;
    }
  }
  return out;
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return mergeSettings(data?.data);
}

/** For the root loader: never block or break the page if the database is slow or missing. */
export async function loadSettingsSafely(timeoutMs = 2500): Promise<SiteSettings | null> {
  try {
    return await Promise.race([
      fetchSettings(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
  } catch {
    return null;
  }
}

export const settingsQuery = {
  queryKey: ["site-settings"],
  queryFn: fetchSettings,
  staleTime: 60 * 1000,
};

const rootApi = getRouteApi("__root__");

export type Site = SiteSettings & {
  society: string;
  farm: string;
  heroImage: string;
  agroImage: string;
  aboutImage: string;
  /** Digits for wa.me, e.g. 8801834757376 */
  whatsappNumber: string;
  waLink: (message: string) => string;
  orderLink: (productName: string) => string;
  tel: (phone: string) => string;
};

/** Digits for wa.me from any typed number (+880…, 01…, Bangla digits). */
export function toWaNumber(phone: string) {
  const bn = "০১২৩৪৫৬৭৮৯";
  const ascii = phone.replace(/[০-৯]/g, (d) => String(bn.indexOf(d)));
  const digits = ascii.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

export function toBnDigits(s: string) {
  return s.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]!);
}

/** Current site settings: server-loaded values first, kept fresh after admin edits. */
export function useSite(): Site {
  const loaded = rootApi.useLoaderData() as { settings: SiteSettings | null } | undefined;
  const { data } = useQuery({
    ...settingsQuery,
    initialData: loaded?.settings ?? undefined,
  });
  const s = data ?? loaded?.settings ?? defaultSettings;
  const whatsappNumber = toWaNumber(s.whatsapp) || builtIn.whatsapp;
  return {
    ...s,
    society: builtIn.society,
    farm: builtIn.farm,
    heroImage: s.hero_image || heroFarm,
    agroImage: s.agro_image || agroFarm,
    aboutImage: s.about_image || agroFarm,
    whatsappNumber,
    waLink: (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    orderLink: (name) =>
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I want to order ${name}`)}`,
    tel: (phone) => `tel:${phone.replace(/[^+\d]/g, "")}`,
  };
}
