/**
 * Central site configuration.
 * NOTE: replace the placeholder WhatsApp number / email with the real ones.
 */
export const site = {
  society: "Green Bangla Society",
  farm: "Green Bangla Agro Farm",
  domain: "gbtizarah.com",
  whatsapp: "8801834757376",
  phone: "+880 1735-808380",
  phone2: "+880 1716-212431",
  whatsappDisplay: "+880 1834-757376",
  email: "gbsociety80@gmail.com",
  email2: "gbtizarah@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61565950551214",
  address: "Middle Alipur, Faridpur, Bangladesh",
};

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function orderLink(productName: string) {
  return waLink(`Hello, I want to order ${productName}`);
}

export const bdt = (n: number) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);
